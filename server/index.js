import express from 'express';
import multer from 'multer';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createServer } from 'http';
import { Server } from 'socket.io';
import Stripe from 'stripe';

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});
const prisma = new PrismaClient({});
const JWT_SECRET = process.env.JWT_SECRET || 'aura_super_secret_dev_key';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock_123', {
  apiVersion: '2023-10-16',
});
const MOCK_STRIPE = !process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.includes('mock');

// Middleware for authenticating requests
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Forbidden' });
    req.user = user;
    next();
  });
};
const port = process.env.PORT || 3001;

// Retry helper for Google API
const generateWithRetry = async (ai, params, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await ai.models.generateContent(params);
    } catch (err) {
      if (err.status === 503 && i < maxRetries - 1) {
        console.log(`Google API 503 Error. Retrying in ${2000 * (i + 1)}ms...`);
        await new Promise(r => setTimeout(r, 2000 * (i + 1)));
      } else {
        throw err;
      }
    }
  }
};

// Setup multer for handling multipart/form-data (image uploads)
const upload = multer({ storage: multer.memoryStorage() });

const documentUpload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = path.join(process.cwd(), 'public', 'uploads', 'documents');
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    }
  })
});
app.use(cors());

// Stripe webhook must come before express.json()
app.post('/api/webhooks/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  if (MOCK_STRIPE) {
    // Mock webhook handler
    const event = JSON.parse(req.body.toString());
    if (event.type === 'checkout.session.completed') {
      const sessionId = event.data.object.id;
      await prisma.invoice.updateMany({
        where: { stripeSessionId: sessionId },
        data: { status: 'paid' }
      });
    }
    return res.json({ received: true });
  }

  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    await prisma.invoice.updateMany({
      where: { stripeSessionId: session.id },
      data: { status: 'paid' }
    });
  }

  res.json({ received: true });
});

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use('/uploads', express.static(path.join(process.cwd(), 'public', 'uploads')));

// ---- AUTH ROUTES ----
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, role, name } = req.body;
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ error: 'User already exists' });
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, role, name }
    });
    
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ error: 'Invalid password' });
    
    const token = jwt.sign({ id: user.id, role: user.role, name: user.name, email: user.email }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { id: user.id, role: user.role, name: user.name, email: user.email, avatar: user.avatar } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---- DATA ROUTES ----

app.get('/api/users', authenticateToken, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, role: true, email: true, avatar: true }
    });
    res.json(users);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/projects', authenticateToken, async (req, res) => {
  try {
    // If client, only return their projects. If manager, only their projects. If admin, all.
    let where = {};
    if (req.user.role === 'client') where.clientId = req.user.id;
    else if (req.user.role === 'manager') where.managerId = req.user.id;
    
    const projects = await prisma.project.findMany({ where, include: { tasks: true, issues: true, documents: true, siteLogs: true, approvals: true } });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/projects', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'manager') {
      return res.status(403).json({ error: 'Forbidden' });
    }
    const project = await prisma.project.create({ data: req.body });
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/documents', authenticateToken, async (req, res) => {
  try {
    const documents = await prisma.document.findMany();
    res.json(documents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/documents', authenticateToken, documentUpload.single('file'), async (req, res) => {
  try {
    const { name, type, date, size, projectId } = req.body;
    let url = null;
    if (req.file) {
      url = `/uploads/documents/${req.file.filename}`;
    }
    const document = await prisma.document.create({
      data: {
        name, type, date, size, url, projectId, uploadedById: req.user.id
      }
    });
    res.status(201).json(document);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -- Tasks --
app.get('/api/tasks', authenticateToken, async (req, res) => {
  try {
    const tasks = await prisma.task.findMany();
    res.json(tasks);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/tasks', authenticateToken, async (req, res) => {
  try {
    const task = await prisma.task.create({ data: req.body });
    res.status(201).json(task);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.patch('/api/tasks/:id', authenticateToken, async (req, res) => {
  try {
    const task = await prisma.task.update({ where: { id: req.params.id }, data: req.body });
    res.json(task);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// -- Issues --
app.get('/api/issues', authenticateToken, async (req, res) => {
  try {
    const issues = await prisma.issue.findMany();
    res.json(issues);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/issues', authenticateToken, async (req, res) => {
  try {
    const issue = await prisma.issue.create({ data: req.body });
    res.status(201).json(issue);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.patch('/api/issues/:id', authenticateToken, async (req, res) => {
  try {
    const issue = await prisma.issue.update({ where: { id: req.params.id }, data: req.body });
    res.json(issue);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// -- SiteLogs --
app.get('/api/sitelogs', authenticateToken, async (req, res) => {
  try {
    const logs = await prisma.siteLog.findMany();
    res.json(logs);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/sitelogs', authenticateToken, async (req, res) => {
  try {
    const log = await prisma.siteLog.create({ data: req.body });
    res.status(201).json(log);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// -- Messages --
app.get('/api/messages', authenticateToken, async (req, res) => {
  try {
    const messages = await prisma.message.findMany({ include: { sender: true } });
    const parsedMessages = messages.map(m => ({
      ...m,
      readBy: m.readBy ? JSON.parse(m.readBy) : [],
      attachments: m.attachments ? JSON.parse(m.attachments) : []
    }));
    res.json(parsedMessages);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/messages', authenticateToken, async (req, res) => {
  try {
    const data = req.body;
    const msg = await prisma.message.create({
      data: {
        content: data.content,
        senderId: data.senderId,
        conversationId: data.conversationId,
        timestamp: new Date().toISOString(),
        readBy: JSON.stringify([{ userId: data.senderId, timestamp: new Date().toISOString() }]),
        attachments: data.attachments ? JSON.stringify(data.attachments) : null
      },
      include: { sender: true }
    });
    const parsedMsg = {
      ...msg,
      readBy: msg.readBy ? JSON.parse(msg.readBy) : [],
      attachments: msg.attachments ? JSON.parse(msg.attachments) : []
    };
    io.emit('receive_message', parsedMsg);
    res.status(201).json(parsedMsg);
  } catch (err) {
    console.error('Error in POST /api/messages:', err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/messages/:id/read', authenticateToken, async (req, res) => {
  try {
    const messageId = req.params.id;
    const { userId } = req.body;
    
    const message = await prisma.message.findUnique({ where: { id: messageId } });
    if (!message) return res.status(404).json({ error: 'Message not found' });
    
    let readBy = message.readBy ? JSON.parse(message.readBy) : [];
    if (!readBy.some(r => r.userId === userId)) {
      readBy.push({ userId, timestamp: new Date().toISOString() });
      await prisma.message.update({
        where: { id: messageId },
        data: { readBy: JSON.stringify(readBy) }
      });

      // Emit to the room
      io.to(message.conversationId).emit('message_read', {
        messageId,
        userId,
        readBy
      });
    }
    res.json({ success: true });
  } catch (err) {
    console.error('Error marking message as read:', err);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/messages/:id', authenticateToken, async (req, res) => {
  try {
    const messageId = req.params.id;
    const message = await prisma.message.findUnique({ where: { id: messageId } });
    if (!message) return res.status(404).json({ error: 'Message not found' });
    
    await prisma.message.update({ 
      where: { id: messageId },
      data: { isDeleted: true }
    });
    
    io.emit('message_deleted', { messageId });
    
    res.json({ success: true });
  } catch (err) {
    console.error('Error in DELETE /api/messages/:id:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/conversations', authenticateToken, async (req, res) => {
  try {
    const conversations = await prisma.conversation.findMany();
    const parsedConversations = conversations.map(c => ({
      ...c,
      participants: c.participants ? JSON.parse(c.participants) : []
    }));
    res.json(parsedConversations);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/conversations', authenticateToken, async (req, res) => {
  try {
    const conv = await prisma.conversation.create({ data: req.body });
    res.status(201).json(conv);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// -- Notifications --
app.get('/api/notifications', authenticateToken, async (req, res) => {
  try {
    const notifications = await prisma.notification.findMany({ where: { userId: req.user.id } });
    res.json(notifications);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.patch('/api/notifications/:id/read', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const notification = await prisma.notification.update({
      where: { id },
      data: { read: true }
    });
    res.json(notification);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update notification' });
  }
});

// --- Invoices ---
app.get('/api/invoices', authenticateToken, async (req, res) => {
  try {
    const invoices = await prisma.invoice.findMany({
      where: req.user.role === 'customer' ? { clientId: req.user.id } : undefined
    });
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch invoices' });
  }
});

app.post('/api/invoices', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'manager') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  const { ref, amount, date, clientId, projectId } = req.body;
  try {
    const invoice = await prisma.invoice.create({
      data: {
        ref,
        amount,
        date,
        clientId,
        projectId,
        status: 'pending'
      }
    });
    res.status(201).json(invoice);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create invoice' });
  }
});

app.post('/api/invoices/:id/pay', authenticateToken, async (req, res) => {
  try {
    const invoice = await prisma.invoice.findUnique({ where: { id: req.params.id } });
    if (!invoice) return res.status(404).json({ error: 'Invoice not found' });
    
    // Parse numeric amount safely (e.g. from '$5,000' to 5000)
    const numericAmount = parseInt(invoice.amount.toString().replace(/[^0-9]/g, ''), 10) || 5000;

    if (MOCK_STRIPE) {
      const mockSessionId = `mock_sess_${Date.now()}`;
      await prisma.invoice.update({
        where: { id: invoice.id },
        data: { stripeSessionId: mockSessionId }
      });
      // Return a simulated URL
      return res.json({ url: `/hub-customer?payment=mock&session_id=${mockSessionId}` });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: { name: `Invoice ${invoice.ref}` },
          unit_amount: numericAmount * 100, // Stripe expects cents
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${req.headers.origin}/hub?payment=success`,
      cancel_url: `${req.headers.origin}/hub?payment=cancelled`,
      client_reference_id: invoice.id,
    });

    await prisma.invoice.update({
      where: { id: invoice.id },
      data: { stripeSessionId: session.id }
    });

    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

app.use('/uploads', express.static(path.join(process.cwd(), 'public', 'uploads')));

const isMockMode = !process.env.GOOGLE_API_KEY || process.env.GOOGLE_API_KEY === 'your_google_api_key_here' || process.env.GOOGLE_API_KEY === 'your_actual_api_key_here';

const initGenAI = () => {
  return new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });
};

// Endpoint for analyzing the space
app.post('/api/analyze-space', upload.single('image'), async (req, res) => {
  try {
    const spaceType = req.body.spaceType || 'Unknown Room';

    if (isMockMode) {
      console.log('Running in MOCK mode (No valid API key found).');
      return setTimeout(() => {
        res.json({
          success: true,
          data: {
            spaceSummary: { roomType: spaceType, estimatedStyle: 'Modern Transitional', currentDesignQuality: 'Average with good potential' },
            layoutAnalysis: { furniturePlacement: 'Pushed against walls', spaceUtilization: 'Could be optimized', trafficFlow: 'Adequate', functionalZones: ['Seating', 'Entertainment'] },
            lightingAnalysis: { naturalLight: 'Good from window', artificialLight: 'Needs layering', recommendations: 'Add floor lamps' },
            colorAnalysis: { existingPalette: ['#f5f5f5', '#8c7b75', '#333333'], suggestedPalette: ['#faf9f6', '#d2b48c', '#2c3e50', '#e67e22'] },
            materialAnalysis: { walls: 'Painted drywall', flooring: 'Hardwood', ceiling: 'Flat white', furnitureFinishes: 'Mixed wood' },
            designImprovements: { working: ['Natural light'], needsImprovement: ['Lighting', 'Layout'], priorityRecommendations: ['Add area rug', 'Warmer lighting'] }
          }
        });
      }, 2000);
    }

    const ai = initGenAI();

    const promptText = `
      You are an expert interior designer. Analyze the provided image of a ${spaceType}.
      Return a JSON object strictly matching this schema, providing detailed professional insights.
      Do not include any markdown formatting like \`\`\`json, just return the raw JSON object.
      {
        "spaceSummary": {
          "roomType": "string",
          "estimatedStyle": "string",
          "currentDesignQuality": "string"
        },
        "layoutAnalysis": {
          "furniturePlacement": "string",
          "spaceUtilization": "string",
          "trafficFlow": "string",
          "functionalZones": ["string", "string"]
        },
        "lightingAnalysis": {
          "naturalLight": "string",
          "artificialLight": "string",
          "recommendations": "string"
        },
        "colorAnalysis": {
          "existingPalette": ["#hex", "#hex", "#hex"],
          "suggestedPalette": ["#hex", "#hex", "#hex", "#hex"]
        },
        "materialAnalysis": {
          "walls": "string",
          "flooring": "string",
          "ceiling": "string",
          "furnitureFinishes": "string"
        },
        "designImprovements": {
          "working": ["string", "string"],
          "needsImprovement": ["string", "string"],
          "priorityRecommendations": ["string", "string", "string"]
        }
      }
    `;

    const response = await generateWithRetry(ai, {
      model: 'gemini-flash-latest',
      contents: [
        {
          role: 'user',
          parts: [
            { text: promptText },
            {
              inlineData: {
                data: req.file.buffer.toString('base64'),
                mimeType: req.file.mimetype
              }
            }
          ]
        }
      ],
      config: {
        responseMimeType: 'application/json'
      }
    });

    const responseText = response.text;
    const jsonStr = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    const resultJson = JSON.parse(jsonStr);

    res.json({ success: true, data: resultJson });

  } catch (error) {
    console.error('Analysis Error:', error);
    res.status(500).json({ success: false, error: error.message || 'Failed to analyze space' });
  }
});

// Unified Endpoint for Design Assistant (Dual-Model Execution)
app.post('/api/generate-design', async (req, res) => {
  try {
    const { image, style = 'Modern', roomType = 'room', prompt = '' } = req.body;

    if (!image) {
      return res.status(400).json({ success: false, error: 'Image is required' });
    }

    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
    const mimeMatch = image.match(/^data:(image\/\w+);base64,/);
    const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';

    const ai = initGenAI();
    const imagePart = {
      inlineData: {
        data: base64Data,
        mimeType: mimeType
      }
    };

    // STEP A: Analysis using gemini-2.5-flash
    const analysisPrompt = `
      You are an expert interior designer. Analyze the provided image of a ${roomType}.
      The user wants to redesign it in a "${style}" style. Custom instructions: "${prompt}".
      
      Return a JSON object exactly matching this schema:
      {
        "analysis": "String (A detailed 2-3 sentence analysis of the current space)",
        "recommendations": ["String", "String", "String"],
        "colorPalette": ["#hex", "#hex", "#hex", "#hex"],
        "simulatedEdits": [
          { "top": "String (e.g. '50%')", "left": "String (e.g. '30%')", "label": "String (e.g. 'Modern Sofa')" }
        ]
      }
      Do not include any markdown formatting like \`\`\`json.
    `;

    let analysisResult = {
      analysis: "Could not analyze the space due to high server demand. We generated your design nonetheless.",
      recommendations: ["Ensure good lighting", "Clear clutter"],
      colorPalette: ["#ffffff", "#cccccc", "#333333"],
      simulatedEdits: [
        { top: "35%", left: "25%", label: "Natural Light Optimization" },
        { top: "50%", left: "75%", label: "Spatial Reconfiguration" },
        { top: "70%", left: "40%", label: "Flooring Enhancement" },
        { top: "25%", left: "60%", label: "Lighting Upgrade" }
      ]
    };

    try {
      const responseA = await generateWithRetry(ai, {
        model: 'gemini-2.5-flash',
        contents: [analysisPrompt, imagePart],
        config: {
          responseMimeType: 'application/json',
        }
      });

      const textA = responseA.text;
      try {
        analysisResult = JSON.parse(textA.replace(/```json/g, '').replace(/```/g, '').trim());
      } catch (e) {
        console.error("Failed to parse Analysis JSON", textA);
      }
    } catch (errA) {
      console.error("Analysis Step A Failed:", errA.message);
    }

    // STEP B: Image Generation
    // The user requested passing the image via inlineData to 'gemini-2.5-flash-image' 
    // to preserve the original structure (Image-to-Image / Inpainting).
    let generatedImageBase64 = image; // Fallback to original image
    
    try {
      const responseB = await generateWithRetry(ai, {
        model: 'gemini-2.5-flash-image', 
        contents: [
          `Redesign this ${roomType} in a beautiful ${style} style. ${prompt}`,
          imagePart
        ]
      });

      // Assuming the model returns the base64 bytes in the response
      if (responseB.candidates && responseB.candidates[0]?.content?.parts?.[0]?.inlineData?.data) {
        generatedImageBase64 = `data:image/jpeg;base64,${responseB.candidates[0].content.parts[0].inlineData.data}`;
      } else {
        console.warn("Unexpected response format from gemini-2.5-flash-image. Falling back to original image.");
      }
    } catch (errB) {
      console.error("Image Generation Step B Failed:", errB.message);
      // We catch the error (e.g. Quota Exceeded for the preview model) 
      // and gracefully fallback so the frontend doesn't crash.
      console.log("Falling back to text-to-image with imagen-3.0-generate-001 as an alternative...");
      try {
        const fallbackRes = await ai.models.generateImages({
          model: 'imagen-3.0-generate-001',
          prompt: `A beautiful ${style} ${roomType}. ${prompt}`,
          config: { numberOfImages: 1, outputMimeType: 'image/jpeg' }
        });
        if (fallbackRes.generatedImages && fallbackRes.generatedImages[0]?.image?.imageBytes) {
           generatedImageBase64 = `data:image/jpeg;base64,${fallbackRes.generatedImages[0].image.imageBytes}`;
        }
      } catch (fallbackErr) {
        console.error("Fallback image generation also failed:", fallbackErr.message);
      }
    }
    
    if (generatedImageBase64 === image) {
      console.warn("API quota exceeded or model failed. Falling back to original image as requested.");
    }

    const timestamp = Date.now();
    let originalImageUrl = '';
    let generatedImageUrl = '';

    const saveBase64Image = (base64String, filename) => {
      if (!base64String) return '';
      const base64Data = base64String.replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(base64Data, 'base64');
      const filepath = path.join(process.cwd(), 'public', 'uploads', 'designs', filename);
      fs.writeFileSync(filepath, buffer);
      return `/uploads/designs/${filename}`;
    };

    try {
      originalImageUrl = saveBase64Image(image, `orig_${timestamp}.jpg`);
      generatedImageUrl = saveBase64Image(generatedImageBase64, `gen_${timestamp}.jpg`);
    } catch (fsErr) {
      console.error("Failed to save images to disk:", fsErr);
    }

    res.json({ 
      success: true, 
      data: {
        analysis: analysisResult,
        generatedImage: generatedImageUrl,
        originalImage: originalImageUrl
      } 
    });

  } catch (error) {
    console.error('API Error:', error);
    let errorMessage = 'Failed to process request';
    
    // Attempt to parse stringified JSON errors from Google SDK
    try {
      if (error.message && error.message.includes('{"error":')) {
        const parsed = JSON.parse(error.message);
        if (parsed.error && parsed.error.message) {
          errorMessage = parsed.error.message;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
    } catch (e) {
      errorMessage = error.message;
    }

    res.status(500).json({ success: false, error: errorMessage });
  }
});

// Socket.io integration
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('join_project', (projectId) => {
    socket.join(`project_${projectId}`);
  });

  socket.on('join_user', (userId) => {
    socket.join(`user_${userId}`);
  });

  socket.on('send_message', async (data) => {
    try {
      const msg = await prisma.message.create({
        data: {
          content: data.content,
          senderId: data.senderId,
          conversationId: data.conversationId,
          timestamp: new Date().toISOString(),
          readBy: JSON.stringify([{ userId: data.senderId, timestamp: new Date().toISOString() }]),
          attachments: data.attachments ? JSON.stringify(data.attachments) : null
        },
        include: { sender: true }
      });
      const parsedMsg = {
        ...msg,
        readBy: msg.readBy ? JSON.parse(msg.readBy) : [],
        attachments: msg.attachments ? JSON.parse(msg.attachments) : []
      };
      // Broadcast to all clients (in a real app, broadcast to conversation room)
      io.emit('receive_message', parsedMsg);
    } catch (e) {
      console.error(e);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

server.listen(port, () => {
  console.log(`Google GenAI API and Socket.io running on http://localhost:${port}`);
});
