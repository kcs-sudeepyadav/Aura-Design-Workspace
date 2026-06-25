import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, Wand2, Loader2, CheckCircle2, ChevronRight, FileImage, Layout, Palette, ArrowRight, Trash2, Share2 } from 'lucide-react';
import { toast } from 'sonner';

interface SimulatedEdit {
  top: string;
  left: string;
  label: string;
}

interface AnalysisResult {
  analysis: string;
  recommendations: string[];
  colorPalette: string[];
  simulatedEdits: SimulatedEdit[];
}
import { useLocalStorage } from '../messaging/useLocalStorage';
import { Message } from '../messaging/types';
import { useApiData } from '../../hooks/useApiData';

export const DesignAssistant: React.FC<{ isPublic?: boolean; onNavigate?: (page: any) => void; currentUser?: any }> = ({ isPublic = false, onNavigate, currentUser: propCurrentUser }) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const [designStyle, setDesignStyle] = useState<string>('Modern');
  const [roomType, setRoomType] = useState<string>('Living Room');
  const [customPrompt, setCustomPrompt] = useState<string>('');
  
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [analysisData, setAnalysisData] = useState<AnalysisResult | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);

  // Storage
  const userStr = localStorage.getItem('aura_user');
  const currentUser = propCurrentUser || (userStr ? JSON.parse(userStr) : { id: 'c-1', role: 'customer', name: 'Ananya Mehta' });
  const { data: conversations } = useApiData('conversations');
  const { createItem: createMessage } = useApiData('messages');

  const [history, setHistory] = useLocalStorage<any[]>('aura_ai_design_history', []);
  const [publicUsed, setPublicUsed] = useLocalStorage<boolean>('aura_public_ai_used', false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image must be less than 5MB');
        return;
      }
      setSelectedImage(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setBase64Image(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!base64Image) {
      toast.error('Please upload an image first');
      return;
    }

    setIsProcessing(true);
    setAnalysisData(null);
    setGeneratedImage(null);

    try {
      const response = await fetch('/api/generate-design', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: base64Image,
          style: designStyle,
          roomType: roomType,
          prompt: customPrompt
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Generation failed');
      }

      setAnalysisData(data.data.analysis);
      setGeneratedImage(data.data.generatedImage);
      setOriginalImageUrl(data.data.originalImage);
      
      // Save to history if authenticated
      if (!isPublic) {
        setHistory(prev => [{
          id: `design-${Date.now()}`,
          timestamp: new Date().toISOString(),
          originalImage: data.data.originalImage,
          generatedImage: data.data.generatedImage,
          style: designStyle,
          roomType: roomType,
          analysisData: data.data.analysis
        }, ...prev]);
      } else {
        setPublicUsed(true);
      }
      
      toast.success('Design generated successfully!');
    } catch (error: any) {
      console.error('Generation Error:', error);
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const resetForm = () => {
    setSelectedImage(null);
    setBase64Image(null);
    setAnalysisData(null);
    setGeneratedImage(null);
    setOriginalImageUrl(null);
    setCustomPrompt('');
  };

  const handleShare = async () => {
    if (!generatedImage) return;
    if (!currentUser) {
      toast.error('You must be logged in to share designs.');
      return;
    }
    
    // Find the user's real conversation
    const conv = conversations.find((c: any) => c.participants && c.participants.includes(currentUser.id));
    const conversationId = conv ? conv.id : (conversations[0]?.id || 'conv-group-1');

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      conversationId: conversationId, 
      senderId: currentUser.id,
      content: `I generated this design concept for the ${roomType} using the AI Design Assistant. What do you think?`,
      timestamp: new Date().toISOString(),
      readBy: [],
      attachments: [{
        id: `att-${Date.now()}`,
        name: `AI_Design_${designStyle}.jpg`,
        type: 'image',
        url: generatedImage,
        size: '1.2MB',
        metadata: {
          simulatedEdits: analysisData?.simulatedEdits || []
        }
      }]
    };
    
    try {
      await createMessage(newMessage);
      toast.success('Design shared with Project Manager in Messages!');
      if (onNavigate) {
        onNavigate('messages');
      }
    } catch (e) {
      toast.error('Failed to share design');
    }
  };

  const handleDeleteHistory = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setHistory(prev => prev.filter(item => item.id !== id));
    toast.success('Design removed from history');
  };

  const handleShareHistory = async (e: React.MouseEvent, item: any) => {
    e.stopPropagation();
    if (!currentUser) {
      toast.error('You must be logged in to share designs.');
      return;
    }

    const conv = conversations.find((c: any) => c.participants && c.participants.includes(currentUser.id));
    const conversationId = conv ? conv.id : (conversations[0]?.id || 'conv-group-1');

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      conversationId: conversationId, 
      senderId: currentUser.id,
      content: `I generated this design concept for the ${item.roomType} using the AI Design Assistant. What do you think?`,
      timestamp: new Date().toISOString(),
      readBy: [],
      attachments: [{
        id: `att-${Date.now()}`,
        name: `AI_Design_${item.style}.jpg`,
        type: 'image',
        url: item.generatedImage,
        size: '1.2MB',
        metadata: {
          simulatedEdits: item.analysisData?.simulatedEdits || []
        }
      }]
    };
    
    try {
      await createMessage(newMessage);
      toast.success('Design shared with Project Manager in Messages!');
      if (onNavigate) {
        onNavigate('messages');
      }
    } catch (e) {
      toast.error('Failed to share design');
    }
  };

  const UpsellBanner = (
    <div className="bg-[#020617] border border-[#f59e0b]/20 p-12 text-center relative overflow-hidden group">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-[#f59e0b] to-transparent opacity-50" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#f59e0b]/5 via-transparent to-transparent pointer-events-none" />
      
      <Wand2 size={48} className="text-[#f59e0b] mx-auto mb-6" strokeWidth={1} />
      <h3 className="text-3xl font-light mb-4 text-white" >
        Your free <em className="italic text-[#f59e0b]">AI Design</em> is ready.
      </h3>
      <p className="text-slate-400 mb-8 max-w-lg mx-auto leading-relaxed" >
        You have experienced a glimpse of our Dual-Model AI. To generate unlimited variations, access your design history, and collaborate with our studio experts, unlock the Client Portal.
      </p>
      <button 
        onClick={() => onNavigate && onNavigate('hub-login')}
        className="inline-flex items-center gap-3 bg-[#f59e0b] text-[#020617] px-8 py-4 text-sm font-semibold uppercase tracking-[0.1em] hover:bg-[#f59e0b]/90 transition-all hover:scale-105"
      >
        Unlock Client Portal <ArrowRight size={16} />
      </button>
    </div>
  );

  return (
    <div className="text-white space-y-5" >
      
      {isPublic && publicUsed && !generatedImage ? (
        UpsellBanner
      ) : (
        <>
          <div className="bg-[#0f172a] border border-amber-500/10 p-5">
            <h2 className="text-white font-semibold mb-2" >
              AI Design Assistant
            </h2>
            <p className="text-white/40 text-sm" >
              Upload your space and let our dual-model AI analyze and reimagine it.
            </p>
          </div>

          {!generatedImage ? (
            <div className="grid lg:grid-cols-2 gap-4">
          {/* Upload Section */}
          <div className="bg-[#0f172a] border border-amber-500/10 p-5">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`border border-dashed p-10 text-center cursor-pointer transition-all ${
                selectedImage 
                  ? 'border-amber-500/50 bg-amber-500/5' 
                  : 'border-slate-700 hover:border-amber-500/30 bg-[#020617]'
              }`}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
                accept="image/jpeg,image/png,image/webp" 
                className="hidden" 
              />
              
              {base64Image ? (
                <div className="relative aspect-video overflow-hidden mb-4 border border-slate-700">
                  <img src={base64Image} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <p className="text-white font-medium flex items-center gap-2">
                      <Upload size={18} /> Change Image
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4">
                    <Upload size={28} className="text-slate-400" />
                  </div>
                  <h3 className="text-white font-medium mb-2" >Upload Room Photo</h3>
                  <p className="text-xs text-white/40 max-w-xs mx-auto" >
                    Drag and drop your image here, or click to browse. Max size 5MB.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Configuration Section */}
          <div className="bg-[#0f172a] p-5 border border-amber-500/10 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-white/50 text-xs font-medium mb-2 uppercase tracking-[0.08em]" >Design Style</label>
                <select 
                  value={designStyle}
                  onChange={(e) => setDesignStyle(e.target.value)}
                  className="w-full bg-[#020617] border border-white/10 px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#f59e0b]/50 transition-colors"
                  
                >
                  <option value="Modern">Modern</option>
                  <option value="Minimalist">Minimalist</option>
                  <option value="Industrial">Industrial</option>
                  <option value="Scandinavian">Scandinavian</option>
                  <option value="Bohemian">Bohemian</option>
                  <option value="Traditional">Traditional</option>
                </select>
              </div>
              
              <div>
                <label className="block text-white/50 text-xs font-medium mb-2 uppercase tracking-[0.08em]" >Room Type</label>
                <select 
                  value={roomType}
                  onChange={(e) => setRoomType(e.target.value)}
                  className="w-full bg-[#020617] border border-white/10 px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#f59e0b]/50 transition-colors"
                  
                >
                  <option value="Living Room">Living Room</option>
                  <option value="Bedroom">Bedroom</option>
                  <option value="Kitchen">Kitchen</option>
                  <option value="Bathroom">Bathroom</option>
                  <option value="Office">Office</option>
                  <option value="Dining Room">Dining Room</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-white/50 text-xs font-medium mb-2 uppercase tracking-[0.08em]" >Custom Instructions (Optional)</label>
              <textarea 
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="E.g., Make it feel brighter, use lots of plants, add a leather sofa..."
                className="w-full bg-[#020617] border border-white/10 px-4 py-3 text-white text-sm focus:outline-none focus:border-[#f59e0b]/50 transition-colors resize-none h-24"
                
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={!base64Image || isProcessing}
              className="w-full bg-[#f59e0b]/10 hover:bg-[#f59e0b]/20 border border-[#f59e0b]/30 disabled:opacity-50 disabled:hover:bg-[#f59e0b]/10 text-[#f59e0b] text-sm font-semibold py-3 flex items-center justify-center gap-2 transition-colors"
              
            >
              {isProcessing ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Analyzing & Generating...
                </>
              ) : (
                <>
                  <Wand2 size={20} />
                  Generate Design
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        /* Results Section */
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          
          {/* Side-by-Side Images */}
          <div className="grid md:grid-cols-2 gap-4 bg-[#0f172a] p-5 border border-amber-500/10">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-slate-400">
                <ImageIcon size={18} />
                <span className="font-medium">Original</span>
              </div>
              <div className="relative aspect-[4/3] overflow-hidden border border-slate-800">
                <img src={base64Image!} alt="Original" className="absolute inset-0 w-full h-full object-cover" />
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-amber-500">
                <Wand2 size={18} />
                <span className="font-medium">AI Generated ({designStyle})</span>
              </div>
              <div className="relative aspect-[4/3] overflow-hidden border border-amber-500/30 shadow-[0_0_30px_rgba(245,158,11,0.1)] group">
                <img src={generatedImage!} alt="Generated" className="absolute inset-0 w-full h-full object-cover" />
                
                {/* Simulated Edits Hotspots */}
                {analysisData?.simulatedEdits?.map((edit, idx) => (
                  <div 
                    key={idx} 
                    className="absolute w-6 h-6 -translate-x-1/2 -translate-y-1/2 bg-amber-500 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform shadow-lg shadow-black/50 group/spot z-10 hover:z-50"
                    style={{ top: edit.top, left: edit.left }}
                  >
                    <div className="w-2 h-2 bg-slate-900 rounded-full animate-pulse" />
                    
                    {/* Tooltip */}
                    <div className="absolute opacity-0 group-hover/spot:opacity-100 bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap pointer-events-none transition-opacity border border-white/10 z-10 shadow-xl">
                      {edit.label}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
                    </div>
                  </div>
                ))}

              </div>
            </div>
          </div>

          {/* Analysis JSON Data */}
          {analysisData && (
            <div className="grid lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2 bg-[#0f172a] p-5 border border-amber-500/10 space-y-8">
                <div>
                  <h3 className="text-xl font-medium mb-4 flex items-center gap-2">
                    <Layout size={20} className="text-amber-500" />
                    Space Analysis
                  </h3>
                  <p className="text-slate-300 leading-relaxed">{analysisData.analysis}</p>
                </div>
                
                <div>
                  <h3 className="text-xl font-medium mb-4 flex items-center gap-2">
                    <CheckCircle2 size={20} className="text-amber-500" />
                    Key Recommendations
                  </h3>
                  <ul className="space-y-3">
                    {analysisData.recommendations.map((rec, i) => (
                      <li key={i} className="flex items-start gap-3 text-slate-300">
                        <ChevronRight size={18} className="text-amber-500 shrink-0 mt-0.5" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="bg-[#0f172a] p-5 border border-amber-500/10 h-fit">
                <h3 className="text-xl font-medium mb-6 flex items-center gap-2">
                  <Palette size={20} className="text-amber-500" />
                  Color Palette
                </h3>
                <div className="space-y-4">
                  {analysisData.colorPalette.map((hex, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div 
                        className="w-12 h-12 shadow-inner border border-white/10" 
                        style={{ backgroundColor: hex }}
                      />
                      <div>
                        <p className="font-medium uppercase tracking-wider">{hex}</p>
                        <p className="text-xs text-slate-500">Accent {i + 1}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            {!isPublic && (
              <button 
                onClick={handleShare}
                className="px-6 py-3 bg-[#f59e0b]/10 text-[#f59e0b] border border-[#f59e0b]/30 hover:bg-[#f59e0b]/20 transition-colors font-semibold text-sm"
              >
                {currentUser?.role === 'customer' ? 'Share with Project Manager' : currentUser?.role === 'manager' ? 'Share with Client' : 'Share to Group'}
              </button>
            )}
            <button 
              onClick={resetForm}
              className="px-6 py-3 bg-[#0f172a] hover:bg-[#1e293b] border border-amber-500/10 text-white transition-colors font-semibold text-sm"
            >
              Start New Design
            </button>
          </div>
          
          {/* Public Upsell placed below results */}
          {isPublic && publicUsed && generatedImage && (
            <div className="mt-12">
              {UpsellBanner}
            </div>
          )}
          </div>
          )}
        </>
      )}

      {/* History Gallery */}
      {!isPublic && history.length > 0 && (
        <div className="mt-12 space-y-5">
          <h3 className="text-white font-semibold text-lg" >Your Design History</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {history.map((item) => (
              <div key={item.id} className="bg-[#0f172a] border border-amber-500/10 p-3 group cursor-pointer" onClick={() => {
                setGeneratedImage(item.generatedImage);
                setBase64Image(item.originalImage);
                setDesignStyle(item.style);
                setRoomType(item.roomType);
                setAnalysisData(item.analysisData || null); 
              }}>
                <div className="relative aspect-video overflow-hidden border border-white/5 mb-3">
                  <img src={item.generatedImage} alt={item.style} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  
                  {/* Hover Actions */}
                  <div className="absolute top-2 right-2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button 
                      onClick={(e) => handleShareHistory(e, item)}
                      className="p-1.5 bg-black/50 hover:bg-[#f59e0b] text-white border border-white/20 backdrop-blur-sm rounded-sm transition-colors"
                      title={currentUser?.role === 'customer' ? 'Share with Project Manager' : currentUser?.role === 'manager' ? 'Share with Client' : 'Share to Group'}
                    >
                      <Share2 size={14} />
                    </button>
                    <button 
                      onClick={(e) => handleDeleteHistory(e, item.id)}
                      className="p-1.5 bg-black/50 hover:bg-red-500 text-white border border-white/20 backdrop-blur-sm rounded-sm transition-colors"
                      title="Delete from History"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <p className="text-white text-xs font-medium uppercase tracking-wider mb-1" >{item.style}</p>
                <p className="text-white/40 text-[10px]" >{item.roomType}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
