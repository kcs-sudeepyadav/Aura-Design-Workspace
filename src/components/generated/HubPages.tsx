import React, { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import { Calculator,  Bell, CheckCircle2, Clock, FileText, MessageSquare, Upload, ChevronRight, ChevronLeft, BarChart2, Users, Settings, AlertCircle, Camera, TrendingUp, DollarSign, LogIn, Eye, EyeOff, Home, ArrowRight, X, Check, Download, PlusCircle, Search, Menu, ChevronDown, Send, Image, Trash2, Save, RefreshCw, MoreVertical, Shield, Activity, Lock, Unlock, UserPlus, Star, Phone, Mail, Calendar, MapPin, Layers, UserCheck, ClipboardList, BarChart, CreditCard, HardHat, PieChart, Zap, Globe, AlertTriangle, CheckSquare, FileImage, Wand2, Truck } from 'lucide-react';
import { MaterialEstimator } from './MaterialEstimator';
import { DesignAssistant } from './DesignAssistant';
import { AdminBillingView } from './AdminBillingView';
import { AdminProcurementView } from './AdminProcurementView';
import { ProfileSettings, SecurityDetails, HelpSupport } from './UserProfileViews';
import { MessageHub } from '../messaging/MessageHub';
import { useApiData } from '../../hooks/useApiData';
import { io } from 'socket.io-client';
import Universal3DViewer from './Universal3DViewer';
type Page = 'home' | 'about' | 'features' | 'portfolio' | 'case-studies' | 'process' | 'testimonials' | 'faqs' | 'contact' | 'book' | 'hub-login' | 'hub-signup' | 'hub-customer' | 'hub-manager' | 'hub-admin' | 'pitch-deck' | 'ai-design' | 'pricing';
interface HubPageProps {
  onNavigate: (page: Page) => void;
}

/* ─────────────────── TYPES ─────────────────── */

interface Approval {
  id: string;
  title: string;
  type: string;
  due: string;
  description: string;
  status: 'pending' | 'approved' | 'declined';
  imageUrl?: string;
  projectId?: string;
}
interface Milestone {
  id: string;
  label: string;
  date: string;
  done: boolean;
  note: string;
}
interface Document {
  id: string;
  name: string;
  type: string;
  date: string;
  size: string;
  projectId?: string;
  uploadedBy?: string;
  status?: 'active' | 'pending_deletion';
}
interface Invoice {
  id: string;
  label: string;
  amount: string;
  status: 'paid' | 'pending' | 'overdue';
  due: string;
  ref: string;
}
interface Message {
  id: string;
  from: string;
  text: string;
  time: string;
  mine: boolean;
  avatar: string;
}
interface Issue {
  id: string;
  title: string;
  priority: 'high' | 'medium' | 'low';
  status: 'open' | 'in-progress' | 'resolved';
  date: string;
  assignee: string;
  projectId?: string;
}
interface SiteLog {
  id: string;
  date: string;
  title: string;
  summary: string;
  crew: number;
  progress: number;
  photos?: string[];
  projectId?: string;
}
interface Task {
  id: string;
  label: string;
  done: boolean;
  assignee: string;
  due: string;
  projectId?: string;
}
export interface Project {
  id: string;
  name: string;
  client: string;
  phase: string;
  health: 'green' | 'amber' | 'red';
  budget: string;
  completion: number;
  startDate: string;
  endDate: string;
  manager: string;
  clientId?: string;
  managerId?: string;
}
interface AdminUser {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive' | 'pending';
  joined: string;
  projects: number;
}
interface SiteUpdate {
  id: string;
  date: string;
  title: string;
  description: string;
  phase: string;
  photos: string[];
  reportedBy: string;
}

/* ─────────────────── INITIAL DATA ─────────────────── */

const initialApprovals: Approval[] = [{
  id: 'app-1',
  title: 'Marble Selection — Master Bedroom',
  type: 'Material',
  due: 'Due today',
  description: 'Calacatta Gold marble proposed for the master bedroom floor. 60×60 cm slabs, bookmatched layout.',
  status: 'pending',
  imageUrl: 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=400&q=70',
  projectId: 'prj-1'
}, {
  id: 'app-2',
  title: 'Kitchen Cabinet Layout - Final',
  type: 'Drawing',
  due: 'Due in 2 days',
  description: 'Island-style kitchen layout with handleless cabinetry in Grigio Chiaro finish. Countertop: Dekton Sirius.',
  status: 'pending',
  imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=70',
  projectId: 'prj-1'
}, {
  id: 'app-3',
  title: 'Sofa Fabric Swatch - Living Room',
  type: 'Furniture',
  due: 'Due in 4 days',
  description: 'Bespoke sectional sofa in Rubelli Venezia velvet, Cognac colorway. Frame: solid oak with brass feet.',
  status: 'pending',
  imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=70',
  projectId: 'prj-2'
}, {
  id: 'app-4',
  title: 'Bathroom Tile Pattern — En-suite',
  type: 'Material',
  due: 'Due in 7 days',
  description: 'Herringbone Zellige tile in off-white glaze. Grout: Mapei Keracolor Bianco.',
  status: 'approved',
  imageUrl: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=400&q=70'
}, {
  id: 'app-5',
  title: 'Pendant Lighting — Dining Area',
  type: 'Lighting',
  due: 'Due in 10 days',
  description: 'Tom Dixon Melt Pendant in Copper, three-cluster arrangement over 2400mm dining table.',
  status: 'declined',
  imageUrl: 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=400&q=70'
}];
const initialMilestones: Milestone[] = [{
  id: 'm-1',
  label: 'Brief & Discovery',
  date: 'Jan 10, 2026',
  done: true,
  note: 'Site visit completed. Full brief captured and signed off.'
}, {
  id: 'm-2',
  label: 'Concept Presentation',
  date: 'Feb 3, 2026',
  done: true,
  note: 'Client approved mood boards v2 with minor revision on palette.'
}, {
  id: 'm-3',
  label: 'Design Development & 3D',
  date: 'Mar 15, 2026',
  done: true,
  note: 'All renders approved. BOQ finalised. Shop drawings issued.'
}, {
  id: 'm-4',
  label: 'Procurement',
  date: 'Apr 20, 2026',
  done: false,
  note: 'Marble slabs on order. Cabinet factory visit scheduled May 2.'
}, {
  id: 'm-5',
  label: 'Execution Phase 1',
  date: 'May 10, 2026',
  done: false,
  note: 'Flooring and electrical first-fix in progress.'
}, {
  id: 'm-6',
  label: 'Execution Phase 2',
  date: 'Jun 15, 2026',
  done: false,
  note: ''
}, {
  id: 'm-7',
  label: 'Styling & Photography',
  date: 'Jul 15, 2026',
  done: false,
  note: ''
}, {
  id: 'm-8',
  label: 'Handover',
  date: 'Jul 30, 2026',
  done: false,
  note: ''
}];
const initialDocuments: Document[] = [{
  id: 'doc-1',
  name: 'Design Contract - Signed',
  type: 'PDF',
  date: 'Jan 12',
  size: '2.4 MB',
  projectId: 'p-1',
  uploadedBy: 'u-mgr-1'
}, {
  id: 'doc-2',
  name: 'Concept Presentation v2',
  type: 'PDF',
  date: 'Feb 5',
  size: '18.7 MB',
  projectId: 'p-1',
  uploadedBy: 'u-mgr-1'
}, {
  id: 'doc-3',
  name: 'Material Schedule',
  type: 'Excel',
  date: 'Mar 18',
  size: '0.9 MB',
  projectId: 'p-1',
  uploadedBy: 'u-mgr-1'
}, {
  id: 'doc-4',
  name: '3D Render Package - Final',
  type: 'ZIP',
  date: 'Apr 2',
  size: '45.2 MB',
  projectId: 'p-1',
  uploadedBy: 'u-mgr-1'
}];
const initialInvoices: Invoice[] = [{
  id: 'inv-1',
  label: 'Design Retainer',
  amount: '₹3,50,000',
  status: 'paid',
  due: 'Jan 10',
  ref: 'AUR-2026-001'
}, {
  id: 'inv-2',
  label: 'Concept & Design Development',
  amount: '₹4,20,000',
  status: 'paid',
  due: 'Feb 20',
  ref: 'AUR-2026-002'
}, {
  id: 'inv-3',
  label: 'Procurement Advance — 50%',
  amount: '₹8,00,000',
  status: 'paid',
  due: 'Apr 1',
  ref: 'AUR-2026-003'
}, {
  id: 'inv-4',
  label: 'Execution Milestone 1',
  amount: '₹5,50,000',
  status: 'pending',
  due: 'Jun 1',
  ref: 'AUR-2026-004'
}, {
  id: 'inv-5',
  label: 'Procurement Balance — 50%',
  amount: '₹8,00,000',
  status: 'overdue',
  due: 'May 1',
  ref: 'AUR-2026-005'
}];
const initialMessages: Message[] = [{
  id: 'msg-1',
  from: 'Priya Sharma',
  text: 'Good morning! The marble samples have been approved and ordered from the supplier. Estimated delivery is 2 weeks.',
  time: '9:14 AM',
  mine: false,
  avatar: 'PS'
}, {
  id: 'msg-2',
  from: 'You',
  text: "That's great news. When will the updated kitchen renders be ready for review?",
  time: '10:02 AM',
  mine: true,
  avatar: 'AK'
}, {
  id: 'msg-3',
  from: 'Priya Sharma',
  text: "The updated renders with the revised island dimensions will be ready by Thursday — I'll upload them to Documents for your review.",
  time: '10:15 AM',
  mine: false,
  avatar: 'PS'
}, {
  id: 'msg-4',
  from: 'Leila Nouri',
  text: 'Just flagged — the sofa approval is due in 4 days and the lead time from the manufacturer is 10 weeks. Please prioritise that one.',
  time: '11:30 AM',
  mine: false,
  avatar: 'LN'
}, {
  id: 'msg-5',
  from: 'You',
  text: "Noted. I'll review the sofa swatch today and give feedback.",
  time: '11:45 AM',
  mine: true,
  avatar: 'AK'
}];
const initialIssues: Issue[] = [{
  id: 'iss-1',
  title: 'Electrical conduit alignment off — en-suite bathroom',
  priority: 'high',
  status: 'open',
  date: 'May 15',
  assignee: 'Suresh M.'
}, {
  id: 'iss-2',
  title: 'Marble tile delivery delayed by 10 days — supplier backlog',
  priority: 'medium',
  status: 'in-progress',
  date: 'May 13',
  assignee: 'Raj V.'
}, {
  id: 'iss-3',
  title: 'Paint shade confirmation needed — bedroom wall B (east-facing)',
  priority: 'low',
  status: 'open',
  date: 'May 12',
  assignee: 'Priya S.'
}, {
  id: 'iss-4',
  title: 'Ceiling height discrepancy — living room vs. drawing',
  priority: 'high',
  status: 'in-progress',
  date: 'May 10',
  assignee: 'Aryan B.'
}, {
  id: 'iss-5',
  title: 'Plumbing rough-in shifted 80mm from plan — master bath',
  priority: 'medium',
  status: 'resolved',
  date: 'May 8',
  assignee: 'Suresh M.'
}];
const initialSiteLogs: (any & { projectId?: string })[] = [{
  id: 'sl-1',
  date: 'May 16, 2026',
  title: 'Flooring — Day 12',
  summary: 'Level 3 master bedroom flooring 80% laid. Minor alignment issue in en-suite corrected on-site. Crew: 8 on ground.',
  crew: 8,
  progress: 80,
  photos: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=70', 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=400&q=70'],
  projectId: 'p-1'
}, {
  id: 'sl-2',
  date: 'May 15, 2026',
  title: 'Electrical First Fix',
  summary: 'All conduits in kitchen and living room confirmed. Sign-off obtained from site inspector. Smoke detector placement confirmed.',
  crew: 5,
  progress: 100,
  photos: ['https://images.unsplash.com/photo-1609220136736-443140cffec6?w=400&q=70'],
  projectId: 'p-1'
}, {
  id: 'sl-3',
  date: 'May 14, 2026',
  title: 'Material Inspection — Marble',
  summary: 'Marble slabs QC passed. 2 slabs flagged for shade mismatch and returned to vendor. Replacement slabs ETA May 22.',
  crew: 3,
  progress: 60,
  photos: [],
  projectId: 'p-2'
}, {
  id: 'sl-4',
  date: 'May 13, 2026',
  title: 'Civil Works — Partition Walls',
  summary: 'All non-structural partition walls in Bed 2 and 3 completed. Plaster curing underway. Next: Bed 1 and study.',
  crew: 10,
  progress: 75,
  photos: ['https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=400&q=70'],
  projectId: 'p-2'
}];
const initialSiteUpdates: SiteUpdate[] = [{
  id: 'su-1',
  date: 'May 16, 2026',
  title: 'Master Bedroom Flooring Progress',
  description: 'Calacatta Gold marble installation is 80% complete in the master bedroom. The bookmatched layout is looking exceptional. Minor edge-trim work remains.',
  phase: 'Execution Phase 1',
  photos: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80'],
  reportedBy: 'Suresh Menon'
}, {
  id: 'su-2',
  date: 'May 14, 2026',
  title: 'Kitchen Cabinetry Installed',
  description: 'The handleless kitchen cabinetry in Grigio Chiaro finish has been installed. Countertop templating scheduled for May 18. Hardware fitting in progress.',
  phase: 'Execution Phase 1',
  photos: ['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80'],
  reportedBy: 'Priya Sharma'
}, {
  id: 'su-3',
  date: 'May 10, 2026',
  title: 'Electrical First Fix Complete',
  description: 'All electrical conduits and wiring for the entire floor plan have been signed off by the site inspector. Smart home wiring is routed and labeled.',
  phase: 'Execution Phase 1',
  photos: [],
  reportedBy: 'Suresh Menon'
}, {
  id: 'su-4',
  date: 'May 5, 2026',
  title: 'Partition Walls & Plastering',
  description: 'Structural partitions in all bedrooms are complete. Plaster has been applied and is curing. Paint prep begins next week after quality check.',
  phase: 'Execution Phase 1',
  photos: ['https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80'],
  reportedBy: 'Raj Verma'
}];
const initialTasks: Task[] = [{
  id: 't-1',
  label: 'Flooring inspection — Level 3 master bedroom',
  done: true,
  assignee: 'Suresh M.',
  due: 'May 16'
}, {
  id: 't-2',
  label: 'Electrical first-fix completion sign-off',
  done: true,
  assignee: 'Suresh M.',
  due: 'May 15'
}, {
  id: 't-3',
  label: 'Upload site photos — Week 13',
  done: false,
  assignee: 'Raj V.',
  due: 'May 17'
}, {
  id: 't-4',
  label: 'Review change order #4 with designer Priya',
  done: false,
  assignee: 'Suresh M.',
  due: 'May 18'
}, {
  id: 't-5',
  label: 'Confirm marble replacement delivery schedule',
  done: false,
  assignee: 'Raj V.',
  due: 'May 20'
}, {
  id: 't-6',
  label: 'Plumbing inspection — Level 3 master bath',
  done: false,
  assignee: 'Suresh M.',
  due: 'May 21'
}];
const initialProjects: Project[] = [{
  id: 'p-1',
  name: 'The Penthouse Residency',
  client: 'Ananya Mehta',
  clientId: 'u-1',
  phase: 'Execution',
  health: 'green',
  budget: '₹2.8 Cr',
  completion: 58,
  startDate: 'Jan 10, 2026',
  endDate: 'Jul 30, 2026',
  manager: 'Priya Sharma',
  managerId: 'u-mgr-1'
}, {
  id: 'p-2',
  name: 'Meridian Office Tower',
  client: 'Rohan Kapoor',
  clientId: 'u-client-1',
  phase: 'Design Dev',
  health: 'amber',
  budget: '₹6.5 Cr',
  completion: 35,
  startDate: 'Feb 1, 2026',
  endDate: 'Dec 31, 2026',
  manager: 'Aryan Bose',
  managerId: 'u-mgr-2'
}, {
  id: 'p-3',
  name: 'Villa Serenity',
  client: 'Sara Johansson',
  clientId: 'u-3',
  phase: 'Procurement',
  health: 'green',
  budget: '₹1.9 Cr',
  completion: 45,
  startDate: 'Mar 1, 2026',
  endDate: 'Oct 15, 2026',
  manager: 'Leila Nouri',
  managerId: 'u-mgr-3'
}, {
  id: 'p-4',
  name: 'The Onyx Apartment',
  client: 'Meera Nair',
  clientId: 'u-4',
  phase: 'Discovery',
  health: 'red',
  budget: '₹80 L',
  completion: 12,
  startDate: 'Apr 15, 2026',
  endDate: 'Sep 30, 2026',
  manager: 'Priya Sharma',
  managerId: 'u-mgr-1'
}, {
  id: 'p-5',
  name: 'Studio 14 Co-working',
  client: 'Dev Anand',
  clientId: 'u-5',
  phase: 'Concept',
  health: 'green',
  budget: '₹1.2 Cr',
  completion: 20,
  startDate: 'May 1, 2026',
  endDate: 'Nov 30, 2026',
  manager: 'Aryan Bose'
}];
const initialAdminUsers: AdminUser[] = [];
const auditEvents: {
  id: string;
  user: string;
  action: string;
  time: string;
  type: 'approval' | 'upload' | 'user' | 'project' | 'message';
}[] = [{
  id: 'ev-1',
  user: 'Ananya Mehta',
  action: 'Approved "Bathroom Tile Pattern"',
  time: '2 hours ago',
  type: 'approval'
}, {
  id: 'ev-2',
  user: 'Suresh Menon',
  action: 'Uploaded "Site Photos Week 13"',
  time: '4 hours ago',
  type: 'upload'
}, {
  id: 'ev-3',
  user: 'Priya Sharma',
  action: 'Added new log: Flooring Day 12',
  time: '5 hours ago',
  type: 'project'
}, {
  id: 'ev-4',
  user: 'Admin',
  action: 'Invited user: Dev Anand (Client)',
  time: 'Yesterday',
  type: 'user'
}, {
  id: 'ev-5',
  user: 'Leila Nouri',
  action: 'Sent message to Ananya Mehta',
  time: 'Yesterday',
  type: 'message'
}, {
  id: 'ev-6',
  user: 'Aryan Bose',
  action: 'Updated project phase: Meridian → Design Dev',
  time: '2 days ago',
  type: 'project'
}];
const demoCredentials: {
  role: 'customer' | 'manager' | 'admin';
  label: string;
  email: string;
  password: string;
  page: Page;
}[] = [{
  role: 'customer',
  label: 'Client',
  email: 'ananya@example.com',
  password: 'password123',
  page: 'hub-customer'
}, {
  role: 'manager',
  label: 'Project Manager',
  email: 'priya@example.com',
  password: 'password123',
  page: 'hub-manager'
}, {
  role: 'admin',
  label: 'Admin',
  email: 'admin@auradesign.studio',
  password: 'password123',
  page: 'hub-admin'
}];

/* ─────────────────── SIGNUP PAGE ─────────────────── */

export const HubSignupPage: React.FC<HubPageProps> = ({
  onNavigate
}) => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    company: '',
    subdomain: '',
    teamSize: '1-5',
    password: '',
    confirm: ''
  });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    let value = e.target.value;
    if (e.target.name === 'subdomain') {
      value = value.toLowerCase().replace(/[^a-z0-9-]/g, '');
    }
    setForm(prev => ({
      ...prev,
      [e.target.name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.company.trim() || !form.subdomain.trim() || !form.password.trim()) {
      setError('Please fill in all required fields.');
      return;
    }
    if (form.password !== form.confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      // Simulate API call to provision SaaS workspace
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const teamSizeOptions = ['1-5', '6-15', '16-50', '50+'];
  
  const signupFeatures = [{
    icon: Globe,
    label: 'Custom domain mapping & white-labeling'
  }, {
    icon: Users,
    label: 'Unlimited client portals & approvals'
  }, {
    icon: Wand2,
    label: 'Dual-model AI design assistant'
  }];

  if (submitted) {
    return <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6">
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 bg-[#f59e0b]/10 border border-[#f59e0b]/20 flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 size={28} className="text-[#f59e0b]" />
          </div>
          <p className="text-[#f59e0b] text-[10px] tracking-[0.25em] uppercase mb-4" >Workspace Provisioned</p>
          <h2 className="text-white text-3xl font-light mb-4 leading-tight" >
            Your Agency Workspace<br />is ready!
          </h2>
          <p className="text-white/40 text-sm leading-relaxed mb-10 max-w-sm mx-auto" style={{
          letterSpacing: '0.03em'
        }}>
            We are configuring <span className="text-white">"{form.subdomain}.aurahq.com"</span> for your team. Check your email to access your new admin dashboard and invite your clients.
          </p>
          <button onClick={() => onNavigate('hub-login')} className="bg-[#f59e0b] text-[#020617] px-8 py-3.5 text-xs tracking-[0.12em] uppercase font-semibold hover:bg-[#fbbf24] transition-colors inline-flex items-center gap-2 shadow-md shadow-amber-500/20" >
            <span>Go to Login</span><ArrowRight size={14} />
          </button>
        </div>
      </div>;
  }

  return <div className="min-h-screen bg-[#020617] flex">
      {/* Left brand panel */}
      <div className="hidden lg:flex w-[42%] flex-col justify-between p-14 bg-[#0f172a] border-r border-amber-500/10">
        <button onClick={() => onNavigate('home')} className="flex items-center gap-3 group">
          <div className="w-9 h-9 bg-[#f59e0b] rounded-sm flex items-center justify-center shadow-md shadow-amber-500/20">
            <span className="text-[#020617] font-bold text-lg">A</span>
          </div>
          <span className="text-white font-light text-base tracking-[0.15em] uppercase" >Aura</span>
        </button>
        <div>
          <p className="text-[#f59e0b] text-[10px] tracking-[0.25em] uppercase mb-6" >Agency SaaS Platform</p>
          <h2 className="text-4xl font-light text-white mb-5 leading-tight" >
            Create your Agency<br /><em className="italic text-[#f59e0b]">Workspace.</em>
          </h2>
          <p className="text-white/40 text-sm leading-relaxed max-w-sm mb-12" style={{
          letterSpacing: '0.03em'
        }}>
            Set up your white-labeled client portal in minutes. Start your 14-day free trial and transform how your agency collaborates.
          </p>
          <div className="space-y-5 mb-12">
            {signupFeatures.map(item => <div key={item.label} className="flex items-center gap-4">
                <div className="w-8 h-8 bg-[#020617] border border-amber-500/10 flex items-center justify-center shrink-0">
                  <item.icon size={13} className="text-[#f59e0b]" />
                </div>
                <span className="text-white/50 text-sm" >{item.label}</span>
              </div>)}
          </div>
          <div className="w-12 h-px bg-[#f59e0b]/40" />
        </div>
        <p className="text-white/15 text-xs tracking-wide" >© 2026 Aura : A Design Studio Workspace. All rights reserved.</p>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-[#020617] overflow-y-auto">
        <div className="w-full max-w-md py-10">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-8 h-8 bg-[#f59e0b] rounded-sm flex items-center justify-center">
              <span className="text-[#020617] font-bold">A</span>
            </div>
            <span className="text-white font-light tracking-[0.15em] uppercase" >Aura</span>
          </div>

          <div className="mb-8">
            <p className="text-[#f59e0b] text-[10px] tracking-[0.2em] uppercase mb-3" >14-Day Free Trial</p>
            <h2 className="text-white text-3xl font-light mb-2 leading-tight" >Start your trial</h2>
            <p className="text-white/35 text-sm" >No credit card required. Setup takes 2 minutes.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="text-[10px] text-white/35 tracking-[0.12em] uppercase block mb-2" >
                  <span>Full Name </span><span className="text-[#f59e0b]">*</span>
                </label>
                <input name="name" value={form.name} onChange={handleChange} placeholder="Your full name" className="w-full bg-[#0f172a] border border-slate-800 text-white px-4 py-3 text-sm focus:outline-none focus:border-[#f59e0b]/40 transition-colors placeholder:text-white/20"  />
              </div>
              <div className="col-span-2">
                <label className="text-[10px] text-white/35 tracking-[0.12em] uppercase block mb-2" >
                  <span>Work Email Address </span><span className="text-[#f59e0b]">*</span>
                </label>
                <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@youragency.com" className="w-full bg-[#0f172a] border border-slate-800 text-white px-4 py-3 text-sm focus:outline-none focus:border-[#f59e0b]/40 transition-colors placeholder:text-white/20"  />
              </div>
              
              <div className="col-span-2">
                <label className="text-[10px] text-white/35 tracking-[0.12em] uppercase block mb-2" >
                  <span>Agency Name </span><span className="text-[#f59e0b]">*</span>
                </label>
                <input name="company" value={form.company} onChange={handleChange} placeholder="e.g. Studio Elevate" className="w-full bg-[#0f172a] border border-slate-800 text-white px-4 py-3 text-sm focus:outline-none focus:border-[#f59e0b]/40 transition-colors placeholder:text-white/20"  />
              </div>

              <div className="col-span-2">
                <label className="text-[10px] text-white/35 tracking-[0.12em] uppercase block mb-2" >
                  <span>Workspace URL </span><span className="text-[#f59e0b]">*</span>
                </label>
                <div className="flex bg-[#0f172a] border border-slate-800 focus-within:border-[#f59e0b]/40 transition-colors">
                  <input name="subdomain" value={form.subdomain} onChange={handleChange} placeholder="studio" className="w-full bg-transparent text-white px-4 py-3 text-sm focus:outline-none placeholder:text-white/20 text-right"  />
                  <div className="px-4 py-3 border-l border-slate-800 text-white/40 text-sm bg-black/20" >
                    .aurahq.com
                  </div>
                </div>
              </div>

              <div className="col-span-2">
                <label className="text-[10px] text-white/35 tracking-[0.12em] uppercase block mb-2" >
                  <span>Team Size </span><span className="text-[#f59e0b]">*</span>
                </label>
                <select name="teamSize" value={form.teamSize} onChange={handleChange} className="w-full bg-[#0f172a] border border-slate-800 text-white px-4 py-3 text-sm focus:outline-none focus:border-[#f59e0b]/40 transition-colors" >
                  {teamSizeOptions.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>

              <div>
                <label className="text-[10px] text-white/35 tracking-[0.12em] uppercase block mb-2" >
                  <span>Password </span><span className="text-[#f59e0b]">*</span>
                </label>
                <div className="relative">
                  <input name="password" type={showPw ? 'text' : 'password'} value={form.password} onChange={handleChange} autoComplete="new-password" placeholder="Min. 6 characters" className="w-full bg-[#0f172a] border border-slate-800 text-white px-4 pr-11 py-3 text-sm focus:outline-none focus:border-[#f59e0b]/40 transition-colors placeholder:text-white/20"  />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/55 transition-colors">
                    {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="text-[10px] text-white/35 tracking-[0.12em] uppercase block mb-2" >
                  <span>Confirm Password </span><span className="text-[#f59e0b]">*</span>
                </label>
                <input name="confirm" type="password" value={form.confirm} onChange={handleChange} autoComplete="new-password" placeholder="Repeat password" className="w-full bg-[#0f172a] border border-slate-800 text-white px-4 py-3 text-sm focus:outline-none focus:border-[#f59e0b]/40 transition-colors placeholder:text-white/20"  />
              </div>
            </div>

            {error && <div className="flex items-center gap-2.5 bg-red-950/30 border border-red-900/30 px-4 py-3 text-red-400 text-xs">
                <AlertTriangle size={13} className="shrink-0" /><span>{error}</span>
              </div>}

            <button type="submit" disabled={loading} className="w-full bg-[#f59e0b] text-[#020617] py-4 text-xs tracking-[0.12em] uppercase font-semibold hover:bg-[#fbbf24] transition-colors flex items-center justify-center gap-2.5 disabled:opacity-60 mt-2 shadow-md shadow-amber-500/20" >
              {loading ? <RefreshCw size={14} className="animate-spin" /> : <Zap size={14} />}
              <span>{loading ? 'Creating Workspace...' : 'Create Agency Workspace'}</span>
            </button>
          </form>

          <div className="mt-7 pt-7 border-t border-amber-500/10 text-center">
            <p className="text-white/20 text-xs" >
              <span>Already have a workspace? </span>
              <button onClick={() => onNavigate('hub-login')} className="text-[#f59e0b]/70 hover:text-[#f59e0b] transition-colors underline">Sign in</button>
            </p>
          </div>
        </div>
      </div>
    </div>;
};

/* ─────────────────── LOGIN PAGE ─────────────────── */

export const HubLoginPage: React.FC<HubPageProps> = ({
  onNavigate
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [role, setRole] = useState<'customer' | 'manager' | 'admin'>('customer');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please enter your email and password.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      // Mock login delay for realistic UI feedback
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // Mock successful login based on the selected demo role
      if (role === 'customer') onNavigate('hub-customer');
      else if (role === 'manager') onNavigate('hub-manager');
      else if (role === 'admin') onNavigate('hub-admin');
      else {
        // Fallback for manual entry
        if (email.includes('admin')) onNavigate('hub-admin');
        else if (email.includes('manager')) onNavigate('hub-manager');
        else onNavigate('hub-customer');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };
  const fillDemo = (cred: typeof demoCredentials[0]) => {
    setRole(cred.role);
    setEmail(cred.email);
    setPassword(cred.password);
    setError('');
  };
  const hubFeatures = [{
    label: 'Global Pipeline',
    desc: 'Oversee all projects from a master dashboard'
  }, {
    label: 'Client Management',
    desc: 'Deploy white-labeled portals in seconds'
  }, {
    label: 'Vendor Procurement',
    desc: 'Automate POs and track deliveries'
  }, {
    label: 'AI Design Assistant',
    desc: 'Dual-model AI tailored to your agency'
  }];
  const roleOptions: {
    value: 'customer' | 'manager' | 'admin';
    label: string;
    subtitle: string;
  }[] = [{
    value: 'customer',
    label: 'Client',
    subtitle: 'View your project'
  }, {
    value: 'manager',
    label: 'Project Manager',
    subtitle: 'Manage site ops'
  }, {
    value: 'admin',
    label: 'Admin',
    subtitle: 'Full access'
  }];
  return <div className="min-h-screen bg-[#020617] flex">
      {/* Left brand panel */}
      <div className="hidden lg:flex w-[45%] flex-col justify-between p-14 bg-[#0f172a] border-r border-amber-500/10">
        <button onClick={() => onNavigate('home')} className="flex items-center gap-3 group">
          <div className="w-9 h-9 bg-[#f59e0b] rounded-sm flex items-center justify-center shadow-md shadow-amber-500/20">
            <span className="text-[#020617] font-bold text-lg">A</span>
          </div>
          <span className="text-white font-light text-base tracking-[0.15em] uppercase" >Aura</span>
        </button>
        <div>
          <p className="text-[#f59e0b] text-[10px] tracking-[0.25em] uppercase mb-4 mt-2" >Agency Master Dashboard</p>
          <h2 className="text-4xl font-light text-white mb-5 leading-tight" >
            Command your<br /><em className="italic text-[#f59e0b]">design pipeline.</em>
          </h2>
          <p className="text-white/40 text-sm leading-relaxed max-w-sm mb-12" style={{
          letterSpacing: '0.03em'
        }}>
            Access your master dashboard to oversee client portals, track vendor POs, and manage team communications — all in one secure platform.
          </p>
          <div className="grid grid-cols-2 gap-3 mb-12">
            {hubFeatures.map(f => <div key={f.label} className="bg-[#020617] border border-amber-500/10 p-5">
                <div className="w-6 h-px bg-[#f59e0b] mb-4" />
                <p className="text-white text-sm font-medium mb-1.5" >{f.label}</p>
                <p className="text-white/30 text-xs leading-relaxed" >{f.desc}</p>
              </div>)}
          </div>
          {/* Demo credentials */}
          <div className="bg-[#020617] border border-[#f59e0b]/15 p-5">
            <p className="text-[#f59e0b] text-[10px] tracking-[0.2em] uppercase mb-4" >Test Drive the Platform (Demo Views)</p>
            <div className="space-y-2">
              {demoCredentials.map(c => <button key={c.role} onClick={() => fillDemo(c)} className="w-full flex items-center justify-between p-3 bg-[#0f172a] border border-amber-500/10 hover:border-[#f59e0b]/25 transition-colors group text-left">
                  <div>
                    <p className="text-white text-xs font-medium" >{c.label}</p>
                    <p className="text-white/25 text-[10px] mt-0.5" >{c.email} · {c.password}</p>
                  </div>
                  <ArrowRight size={12} className="text-white/20 group-hover:text-[#f59e0b] transition-colors" />
                </button>)}
            </div>
          </div>
        </div>
        <p className="text-white/15 text-xs tracking-wide mt-2" >© 2026 Aura : A Design Studio Workspace. Secure & encrypted.</p>
      </div>

      {/* Right login panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-[#020617]">
        <div className="w-full max-w-md">
          <button onClick={() => onNavigate('home')} className="lg:hidden flex items-center gap-2 text-[#f59e0b] text-xs tracking-[0.1em] uppercase mb-10 hover:opacity-70 transition-opacity" >
            <Home size={13} /><span>Back to Site</span>
          </button>

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-8 h-8 bg-[#f59e0b] rounded-sm flex items-center justify-center">
              <span className="text-[#020617] font-bold">A</span>
            </div>
            <span className="text-white font-light tracking-[0.15em] uppercase" >Aura</span>
          </div>

          <div className="mb-8">
            <p className="text-[#f59e0b] text-[10px] tracking-[0.2em] uppercase mb-3" >Agency Workspace</p>
            <h2 className="text-white text-3xl font-light mb-2 leading-tight" >Agency Login</h2>
            <p className="text-white/35 text-sm" >Sign in to access your master dashboard</p>
          </div>

          {/* Mobile demo credentials */}
          <div className="lg:hidden mb-6 bg-[#0f172a] border border-[#f59e0b]/15 p-4">
            <p className="text-[#f59e0b] text-[10px] tracking-[0.15em] uppercase mb-3" >Demo Views</p>
            <div className="flex flex-wrap gap-2">
              {demoCredentials.map(c => <button key={c.role} onClick={() => fillDemo(c)} className="px-3 py-1.5 bg-[#020617] border border-amber-500/10 text-white/50 text-xs hover:border-[#f59e0b]/30 hover:text-white/80 transition-colors" >
                  {c.label}
                </button>)}
            </div>
          </div>

          {/* Role selector */}
          <div className="mb-7">
            <p className="text-[10px] text-white/30 tracking-[0.12em] uppercase mb-3" >Signing in as</p>
            <div className="flex gap-2">
              {roleOptions.map(({
              value,
              label,
              subtitle
            }) => <button key={value} onClick={() => {
              setRole(value);
              setError('');
              const cred = demoCredentials.find(c => c.role === value);
              if (cred) {
                setEmail(cred.email);
                setPassword(cred.password);
              }
            }} className={`flex-1 py-3.5 px-2 text-center border transition-all ${role === value ? 'bg-[#f59e0b] border-[#f59e0b] text-[#020617]' : 'border-slate-800 text-white/35 hover:border-amber-500/20 hover:text-white/60 bg-[#0f172a]'}`}>
                  <p className={`text-[11px] font-semibold tracking-[0.08em] uppercase ${role === value ? 'text-[#020617]' : ''}`} >{label}</p>
                  <p className={`text-[10px] mt-0.5 ${role === value ? 'text-[#020617]/55' : 'text-white/20'}`} >{subtitle}</p>
                </button>)}
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-[10px] text-white/35 tracking-[0.12em] uppercase block mb-2" >Email Address</label>
              <div className="relative">
                <Mail size={13} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                <input type="email" value={email} autoComplete="email" onChange={e => {
                setEmail(e.target.value);
                setError('');
              }} placeholder="your@email.com" className="w-full bg-[#0f172a] border border-slate-800 text-white pl-10 pr-4 py-3.5 text-sm focus:outline-none focus:border-[#f59e0b]/40 transition-colors placeholder:text-white/20"  />
              </div>
            </div>
            <div>
              <label className="text-[10px] text-white/35 tracking-[0.12em] uppercase block mb-2" >Password</label>
              <div className="relative">
                <Lock size={13} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                <input type={showPw ? 'text' : 'password'} value={password} autoComplete="current-password" onChange={e => {
                setPassword(e.target.value);
                setError('');
              }} placeholder="••••••••" className="w-full bg-[#0f172a] border border-slate-800 text-white pl-10 pr-12 py-3.5 text-sm focus:outline-none focus:border-[#f59e0b]/40 transition-colors placeholder:text-white/20"  />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/55 transition-colors">
                  {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {error && <div className="flex items-center gap-2.5 bg-red-950/30 border border-red-900/30 px-4 py-3 text-red-400 text-xs">
                <AlertTriangle size={13} className="shrink-0" /><span>{error}</span>
              </div>}

            <button type="submit" disabled={loading} className="w-full bg-[#f59e0b] text-[#020617] py-4 text-xs tracking-[0.12em] uppercase font-semibold hover:bg-[#fbbf24] transition-colors flex items-center justify-center gap-2.5 disabled:opacity-60 mt-2 shadow-md shadow-amber-500/20" >
              {loading ? <RefreshCw size={14} className="animate-spin" /> : <LogIn size={14} />}
              <span>{loading ? 'Signing In...' : 'Sign In to Workspace'}</span>
            </button>
          </form>

          <div className="mt-7 pt-7 border-t border-amber-500/10 space-y-3">
            <p className="text-white/20 text-xs" >
              <span>Forgot your password? </span>
              <button className="text-[#f59e0b]/60 hover:text-[#f59e0b] transition-colors underline">Reset it</button>
            </p>
            <p className="text-white/20 text-xs" >
              <span>New to Aura Hub? </span>
              <button onClick={() => onNavigate('hub-signup')} className="text-[#f59e0b]/60 hover:text-[#f59e0b] transition-colors underline">Request access</button>
            </p>
          </div>
        </div>
      </div>
    </div>;
};

/* ─────────────────── HUB SHELL ─────────────────── */

interface HubShellProps {
  role: 'customer' | 'manager' | 'admin';
  onNavigate: (page: Page) => void;
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
  notifCount?: number;
  userName?: string;
  userInitials?: string;
}
const customerTabs: {
  id: string;
  label: string;
  icon: React.ElementType;
}[] = [{
  id: 'overview',
  label: 'Overview',
  icon: BarChart2
}, {
  id: 'timeline',
  label: 'Timeline',
  icon: Clock
}, {
  id: 'approvals',
  label: 'Approvals',
  icon: CheckSquare
}, {
  id: 'updates',
  label: 'Site Updates',
  icon: Camera
}, {
  id: 'documents',
  label: 'Documents',
  icon: FileText
}, {
  id: 'messages',
  label: 'Messages',
  icon: MessageSquare
}, {
  id: 'payments',
  label: 'Payments',
  icon: CreditCard
}, {
  id: 'design-assistant',
  label: 'AI Design Assistant',
  icon: Wand2
}];
const managerTabs: {
  id: string;
  label: string;
  icon: React.ElementType;
}[] = [{
  id: 'overview',
  label: 'Today',
  icon: Home
}, {
  id: 'logs',
  label: 'Site Logs',
  icon: ClipboardList
}, {
  id: 'tasks',
  label: 'Tasks',
  icon: CheckSquare
}, {
  id: 'issues',
  label: 'Issues',
  icon: AlertCircle
}, {
  id: 'approvals',
  label: 'Approvals',
  icon: CheckCircle2
}, {
  id: 'messages',
  label: 'Messages',
  icon: MessageSquare
}, {
  id: 'upload',
  label: 'Upload',
  icon: Upload
}];
const adminTabs: {
  id: string;
  label: string;
  icon: React.ElementType;
}[] = [{
  id: 'overview',
  label: 'Dashboard',
  icon: BarChart2
}, {
  id: 'projects',
  label: 'Projects',
  icon: FileText
}, {
  id: 'users',
  label: 'Users',
  icon: Users
}, {
  id: 'reports',
  label: 'Reports',
  icon: BarChart
}, {
  id: 'billing',
  label: 'Billing & Invoices',
  icon: CreditCard
}, {
  id: 'settings',
  label: 'Settings',
  icon: Settings
}, {
  id: 'messages',
  label: 'Communications',
  icon: MessageSquare
}, {
  id: 'procurement',
  label: 'Vendor & POs',
  icon: Truck
}, {
  id: 'estimator',
  label: 'Estimator',
  icon: Calculator
}];
const HubShell: React.FC<HubShellProps> = ({
  role,
  onNavigate,
  children,
  activeTab,
  onTabChange,
  notifCount = 0,
  userName = '',
  userInitials = ''
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { data: messages } = useApiData('messages');
  const { data: conversations } = useApiData('conversations');
  const { data: users } = useApiData('users');
  
  const userStr = localStorage.getItem('aura_user');
  let currentUser; if (userStr) { currentUser = JSON.parse(userStr); } else { if (role === 'customer') currentUser = { id: 'c-1', role: 'customer', name: 'Ananya Mehta' }; else if (role === 'manager') currentUser = { id: 'm-1', role: 'manager', name: 'Sarah Jenkins' }; else currentUser = { id: 'admin-1', role: 'admin', name: 'Admin User' }; }
  const currentUserId = currentUser?.id || '';
  const [liveMessages, setLiveMessages] = useState<any[]>([]);

  const dropdownRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setNotifOpen(false);
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (messages) setLiveMessages(messages);
  }, [messages]);

  useEffect(() => {
    const handleUpdate = (e: any) => setLiveMessages(e.detail);
    window.addEventListener('aura-messages-updated', handleUpdate);
    
    // Global socket connection for background notifications
    const globalSocket = io('http://localhost:3001', { autoConnect: true });
    if (currentUserId) {
      globalSocket.emit('join_user', currentUserId);
    }
    
    globalSocket.on('receive_message', (msg: any) => {
      setLiveMessages(prev => {
        if (prev.some(m => m.id === msg.id)) return prev;
        
        if (msg.senderId !== currentUserId) {
          toast('New Message', { 
            description: 'You have received a new message.',
            icon: '💬'
          });
        }
        
        return [...prev, msg];
      });
    });

    globalSocket.on('message_read', ({ messageId, readBy }: any) => {
      setLiveMessages(prev => prev.map(m => 
        m.id === messageId ? { ...m, readBy } : m
      ));
    });

    return () => {
      window.removeEventListener('aura-messages-updated', handleUpdate);
      globalSocket.disconnect();
    };
  }, [currentUserId]);

  const unreadMessagesCount = liveMessages.filter(m => {
    const conv = conversations?.find((c: any) => c.id === m.conversationId);
    if (!conv) return false;
    if (currentUserId !== 'u-admin-1' && !conv.participants.includes(currentUserId)) return false;
    return !m.readBy.some((r: any) => r.userId === currentUserId) && m.senderId !== currentUserId;
  }).length;

  const tabs = role === 'customer' ? customerTabs : role === 'manager' ? managerTabs : adminTabs;
  const roleLabel = role === 'customer' ? 'Client Portal' : role === 'manager' ? 'Project Manager' : 'Admin Console';
  const roleBadgeColor = role === 'customer' ? 'text-blue-400' : role === 'manager' ? 'text-green-400' : 'text-[#f59e0b]';
  const notifications = [{
    id: 'n-1',
    text: 'New approval request: Marble Selection due today',
    time: '2 min ago',
    read: false
  }, {
    id: 'n-2',
    text: 'Site log uploaded by Suresh for May 16',
    time: '4 hrs ago',
    read: false
  }, {
    id: 'n-3',
    text: 'Invoice #AUR-2026-005 is overdue',
    time: '1 day ago',
    read: false
  }];
  let tabLabel = tabs.find(t => t.id === activeTab)?.label ?? activeTab;
  if (activeTab === 'profile-settings') tabLabel = 'Profile Settings';
  if (activeTab === 'security-details') tabLabel = 'Security Details';
  if (activeTab === 'help-support') tabLabel = 'Help & Support';
  return <div className="h-screen bg-[#020617] text-white flex overflow-hidden">
      {/* Sidebar — Desktop */}
      <aside className={`${sidebarOpen ? 'w-60' : 'w-[60px]'} transition-all duration-300 bg-[#0f172a] border-r border-amber-500/10 flex-col shrink-0 hidden md:flex`}>
        <div className="h-16 flex items-center px-4 border-b border-amber-500/10 gap-3 justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-[#f59e0b] rounded-sm flex items-center justify-center shrink-0 shadow-sm shadow-amber-500/20">
              <span className="text-[#020617] font-bold text-sm">A</span>
            </div>
            {sidebarOpen && <span className="text-white font-light text-sm tracking-[0.12em] uppercase" >Aura</span>}
          </div>
          {sidebarOpen && <button onClick={() => setSidebarOpen(false)} className="text-white/20 hover:text-white/50 transition-colors p-1">
              <ChevronRight size={14} className="rotate-180" />
            </button>}
        </div>

        {sidebarOpen && <div className="px-4 py-3 border-b border-amber-500/10">
            <p className={`text-[10px] tracking-[0.15em] uppercase font-semibold ${roleBadgeColor}`} >{roleLabel}</p>
            {userName && <p className="text-white/50 text-xs mt-0.5" >{userName}</p>}
          </div>}

        {!sidebarOpen && <button onClick={() => setSidebarOpen(true)} className="flex justify-center py-3 border-b border-amber-500/10 text-white/20 hover:text-white/50 transition-colors">
            <Menu size={15} />
          </button>}

        <nav className="flex-1 py-3 overflow-y-auto">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button 
              key={id} 
              onClick={() => onTabChange(id)} 
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-xs transition-colors ${
                activeTab === id ? 'text-[#f59e0b] bg-[#f59e0b]/8 border-r-2 border-[#f59e0b]' : 'text-white/40 hover:text-white/70 hover:bg-white/3'
              }`} 
              title={!sidebarOpen ? label : undefined} 
              
            >
              <Icon size={15} className="shrink-0" />
              {sidebarOpen && <span className="tracking-[0.04em] flex-1 text-left">{label}</span>}
              {sidebarOpen && id === 'messages' && unreadMessagesCount > 0 && (
                <span className="ml-auto bg-[#f59e0b] text-[#020617] text-[10px] font-bold px-1.5 py-0.5 rounded-sm">
                  {unreadMessagesCount}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="border-t border-amber-500/10 p-3 space-y-1">
          <button onClick={() => {
                    localStorage.removeItem('aura_token');
                    localStorage.removeItem('aura_user');
                    onNavigate('hub-login');
                  }} className="w-full flex items-center gap-3 px-3 py-2 text-white/30 hover:text-white/60 text-xs transition-colors hover:bg-white/3 rounded" title={!sidebarOpen ? 'Sign Out' : undefined} >
            <LogIn size={13} className="shrink-0" />
            {sidebarOpen && <span>Sign Out</span>}
          </button>
          <button onClick={() => onNavigate('home')} className="w-full flex items-center gap-3 px-3 py-2 text-white/30 hover:text-white/60 text-xs transition-colors hover:bg-white/3 rounded" title={!sidebarOpen ? 'Public Site' : undefined} >
            <Home size={13} className="shrink-0" />
            {sidebarOpen && <span>Public Site</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="bg-[#0f172a] w-64 flex flex-col border-r border-amber-500/10">
            <div className="h-16 flex items-center justify-between px-4 border-b border-amber-500/10">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-[#f59e0b] rounded-sm flex items-center justify-center">
                  <span className="text-[#020617] font-bold text-sm">A</span>
                </div>
                <span className="text-white font-light text-sm tracking-widest uppercase" >Aura</span>
              </div>
              <button onClick={() => setMobileSidebarOpen(false)} className="text-white/40"><X size={18} /></button>
            </div>
            <div className="px-4 py-3 border-b border-amber-500/10">
              <p className={`text-[10px] tracking-[0.15em] uppercase font-semibold ${roleBadgeColor}`} >{roleLabel}</p>
              {userName && <p className="text-white/50 text-xs mt-0.5" >{userName}</p>}
            </div>
            <nav className="flex-1 py-3">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button 
                  key={id} 
                  onClick={() => {
                    onTabChange(id);
                    setMobileSidebarOpen(false);
                  }} 
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                    activeTab === id ? 'text-[#f59e0b] bg-[#f59e0b]/8' : 'text-white/50'
                  }`} 
                  
                >
                  <Icon size={16} className="shrink-0" />
                  <span className="flex-1 text-left">{label}</span>
                  {id === 'messages' && unreadMessagesCount > 0 && (
                    <span className="bg-[#f59e0b] text-[#020617] text-[10px] font-bold px-1.5 py-0.5 rounded-sm">
                      {unreadMessagesCount}
                    </span>
                  )}
                </button>
              ))}
            </nav>
            <div className="border-t border-amber-500/10 p-4 space-y-3">
              <button onClick={() => {
                        localStorage.removeItem('aura_token');
                        localStorage.removeItem('aura_user');
                        onNavigate('hub-login');
                        setMobileSidebarOpen(false);
                      }} className="flex items-center gap-2 text-white/30 text-sm" >
                <LogIn size={14} /><span>Sign Out</span>
              </button>
              <button onClick={() => {
            onNavigate('home');
            setMobileSidebarOpen(false);
          }} className="flex items-center gap-2 text-white/30 text-sm" >
                <Home size={14} /><span>Public Site</span>
              </button>
            </div>
          </div>
          <div className="flex-1 bg-black/60" onClick={() => setMobileSidebarOpen(false)} />
        </div>}

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 bg-[#0f172a] border-b border-amber-500/10 flex items-center justify-between px-5 shrink-0">
          <div className="flex items-center gap-3">
            <button className="md:hidden text-white/50 hover:text-white/80 transition-colors" onClick={() => setMobileSidebarOpen(true)}>
              <Menu size={20} />
            </button>
            <div>
              <h1 className="text-white text-sm font-medium" >{tabLabel}</h1>
              <p className={`text-[10px] tracking-[0.1em] uppercase hidden md:block ${roleBadgeColor}`} >{roleLabel}</p>
            </div>
          </div>
          <div className="flex items-center gap-3" ref={dropdownRef}>
            <div className="relative">
              <button onClick={() => setNotifOpen(!notifOpen)} className="relative text-white/40 hover:text-white/70 transition-colors p-2">
                <Bell size={16} />
                {notifCount > 0 && <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-[#f59e0b] rounded-full text-[#020617] text-[8px] font-bold flex items-center justify-center">{notifCount}</span>}
              </button>
              {notifOpen && <div className="absolute right-0 top-12 w-80 bg-[#0f172a] border border-amber-500/10 shadow-2xl z-50">
                  <div className="p-4 border-b border-amber-500/10 flex justify-between items-center">
                    <p className="text-white text-sm font-medium" >Notifications</p>
                    <button onClick={() => setNotifOpen(false)} className="text-white/30 hover:text-white/60"><X size={14} /></button>
                  </div>
                  {notifications.map(n => <div key={n.id} className="p-4 border-b border-amber-500/10 hover:bg-white/3 transition-colors cursor-pointer">
                      <div className="flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${n.read ? 'bg-white/10' : 'bg-[#f59e0b]'}`} />
                        <div>
                          <p className="text-white/80 text-xs leading-relaxed" >{n.text}</p>
                          <p className="text-white/30 text-[10px] mt-1" >{n.time}</p>
                        </div>
                      </div>
                    </div>)}
                  <div className="p-3 text-center">
                    <button className="text-[#f59e0b] text-xs hover:text-[#fbbf24] transition-colors" >Mark all as read</button>
                  </div>
                </div>}
            </div>
            <div className="relative">
              <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-2.5 hover:bg-white/5 p-1 rounded transition-colors pr-2">
                <div className="w-8 h-8 bg-[#f59e0b]/15 border border-[#f59e0b]/20 rounded-full flex items-center justify-center text-[#f59e0b] text-xs font-semibold">{userInitials}</div>
                {userName && <span className="text-white/70 text-xs hidden sm:block" >{userName}</span>}
                <ChevronDown size={14} className="text-white/30 hidden sm:block" />
              </button>
              
              {profileOpen && (
                <div className="absolute right-0 top-[calc(100%+8px)] w-56 bg-[#0f172a] border border-amber-500/10 shadow-2xl z-50 py-2">
                  <div className="px-4 py-3 border-b border-amber-500/10 mb-2">
                    <p className="text-white text-sm font-medium" >{userName}</p>
                    <p className="text-white/40 text-xs mt-0.5" >{roleLabel}</p>
                  </div>
                  
                  <button onClick={() => { onTabChange('profile-settings'); setProfileOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-white/50 hover:text-white hover:bg-white/5 text-sm transition-colors" >
                    <Settings size={14} /> Profile Settings
                  </button>
                  <button onClick={() => { onTabChange('security-details'); setProfileOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-white/50 hover:text-white hover:bg-white/5 text-sm transition-colors" >
                    <Shield size={14} /> Security Details
                  </button>
                  <button onClick={() => { onTabChange('help-support'); setProfileOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-white/50 hover:text-white hover:bg-white/5 text-sm transition-colors" >
                    <AlertCircle size={14} /> Help & Support
                  </button>
                  
                  <div className="border-t border-amber-500/10 mt-2 pt-2">
                        <button onClick={() => {
                          localStorage.removeItem('aura_token');
                          localStorage.removeItem('aura_user');
                          onNavigate('hub-login');
                        }} className="w-full flex items-center gap-3 px-4 py-2.5 text-red-400/80 hover:text-red-400 hover:bg-red-500/10 text-sm transition-colors" >
                          <LogIn size={14} /> Sign Out
                        </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Mobile tab bar */}
        <div className="md:hidden flex overflow-x-auto border-b border-amber-500/10 bg-[#0f172a] px-2 shrink-0">
          {tabs.map(({
          id,
          label,
          icon: Icon
        }) => <button key={id} onClick={() => onTabChange(id)} className={`shrink-0 flex items-center gap-1.5 px-3 py-3 text-xs border-b-2 transition-colors ${activeTab === id ? 'border-[#f59e0b] text-[#f59e0b]' : 'border-transparent text-white/35'}`} >
              <Icon size={13} />
              <span>{label}</span>
            </button>)}
        </div>

        <main className="flex-1 overflow-y-auto p-5 md:p-6">{children}</main>
      </div>
    </div>;
};

/* ─────────────────── CLIENT DASHBOARD ─────────────────── */

export const HubCustomerPage: React.FC<HubPageProps> = ({
  onNavigate
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const userStr = localStorage.getItem('aura_user');
  const currentUser = userStr ? JSON.parse(userStr) : { id: 'c-1', role: 'customer', name: 'Ananya Mehta' };
  const userName = currentUser?.name || 'Ananya Mehta';
  const userInitials = userName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();
  const { data: users } = useApiData('users');

  useEffect(() => {
    if (currentUser && currentUser.role !== 'customer' && currentUser.role !== 'client') {
      onNavigate(currentUser.role === 'manager' ? 'hub-manager' : 'hub-admin');
    }
  }, [currentUser, onNavigate]);
  const [approvals, setApprovals] = useState<Approval[]>(initialApprovals);
  const [milestones] = useState<Milestone[]>(initialMilestones);
  const { data: documents, setData: setDocuments, updateItem: updateDocument, deleteItem: deleteDocument } = useApiData('documents');
  const { data: invoices, setData: setInvoices } = useApiData('invoices');
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [messageInput, setMessageInput] = useState('');
  const [selectedApproval, setSelectedApproval] = useState<Approval | null>(null);
  const [docSearch, setDocSearch] = useState('');
  const [docFilter, setDocFilter] = useState('all');
  const [selected3DDoc, setSelected3DDoc] = useState<any | null>(null);
  const [orbitSpeed, setOrbitSpeed] = useState(1);
  const [viewerResetHash, setViewerResetHash] = useState(0);
  const { data: siteUpdates } = useApiData('siteupdates');
  const [selectedUpdate, setSelectedUpdate] = useState<SiteUpdate | null>(null);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pendingCount = approvals.filter(a => a.status === 'pending').length;
  const completedMilestones = milestones.filter(m => m.done).length;
  const totalProgress = Math.round(completedMilestones / milestones.length * 100);
  
  const parseAmount = (val: string) => parseInt(val.replace(/[^0-9]/g, ''), 10) || 0;
  const formatCurrency = (val: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
  
  const totalPaid = invoices.filter((i: any) => i.status === 'paid').reduce((sum: number, inv: any) => sum + parseAmount(inv.amount), 0);
  const totalOutstanding = invoices.filter((i: any) => i.status === 'pending').reduce((sum: number, inv: any) => sum + parseAmount(inv.amount), 0);
  const totalOverdueAmount = invoices.filter((i: any) => i.status === 'overdue').reduce((sum: number, inv: any) => sum + parseAmount(inv.amount), 0);
  const overdueInvoices = invoices.filter((i: any) => i.status === 'overdue').length;
  const paidInvoices = invoices.filter((i: any) => i.status === 'paid').length;
  const handlePayment = async (invoiceId: string) => {
    try {
      const token = localStorage.getItem('aura_token');
      const res = await fetch(`http://localhost:3001/api/invoices/${invoiceId}/pay`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (err) {
      toast.error('Payment failed to initialize.');
    }
  };
  const handleApproval = (id: string, status: 'approved' | 'declined') => {
    setApprovals(prev => prev.map(a => a.id === id ? {
      ...a,
      status
    } : a));
    setSelectedApproval(null);
    toast.success(`Approval ${status} successfully`);
  };
  const sendMessage = () => {
    if (!messageInput.trim()) return;
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      from: 'You',
      text: messageInput.trim(),
      time: new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      }),
      mine: true,
      avatar: 'AK'
    };
    setMessages(prev => [...prev, newMsg]);
    setMessageInput('');
    setTimeout(() => {
      const reply: Message = {
        id: `msg-reply-${Date.now()}`,
        from: 'Priya Sharma',
        text: "Thank you for your message. I'll get back to you shortly with more details.",
        time: new Date().toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit'
        }),
        mine: false,
        avatar: 'PS'
      };
      setMessages(prev => [...prev, reply]);
    }, 1500);
  };
  const filteredDocs = documents.filter(d => {
    if (d.status === 'pending_deletion') return false;
    const matchSearch = d.name.toLowerCase().includes(docSearch.toLowerCase());
    const matchFilter = docFilter === 'all' || d.type.toLowerCase() === docFilter.toLowerCase();
    return matchSearch && matchFilter;
  });
  const docTypes = ['all', ...Array.from(new Set(documents.map(d => d.type.toLowerCase())))];
  return <HubShell role="customer" onNavigate={onNavigate} activeTab={activeTab} onTabChange={setActiveTab} notifCount={pendingCount} userName={userName} userInitials={userInitials}>

      {/* ── OVERVIEW ── */}
      {activeTab === 'overview' && <div className="space-y-5">
          <div className="bg-[#0f172a] border border-amber-500/10 p-6">
            <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
              <div>
                <p className="text-[#f59e0b] text-[10px] tracking-[0.2em] uppercase mb-1" >Active Project</p>
                <h2 className="text-white text-xl font-semibold" >The Penthouse Residency</h2>
                <p className="text-white/40 text-sm mt-1" >Mumbai · Phase 3: Execution · Est. handover Jul 30, 2026</p>
              </div>
              <div className="flex items-center gap-2 bg-emerald-900/20 border border-emerald-700/30 px-4 py-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-emerald-400 text-xs tracking-[0.08em] uppercase font-semibold" >On Track</span>
              </div>
            </div>
            <div className="mb-3 flex justify-between text-xs text-white/40">
              <span >Overall Completion</span>
              <span className="text-[#f59e0b] font-semibold">{totalProgress}%</span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#f59e0b] to-[#fbbf24] rounded-full transition-all duration-700" style={{
            width: `${totalProgress}%`
          }} />
            </div>
            <div className="mt-5 grid grid-cols-3 gap-4 pt-5 border-t border-amber-500/10">
              {[{
            label: 'Milestones Done',
            value: `${completedMilestones}/${milestones.length}`
          }, {
            label: 'Pending Approvals',
            value: pendingCount.toString(),
            urgent: pendingCount > 0
          }, {
            label: 'Overdue Invoices',
            value: overdueInvoices.toString(),
            urgent: overdueInvoices > 0
          }].map(stat => <div key={stat.label} className="text-center">
                  <p className={`text-2xl font-light ${stat.urgent ? 'text-[#f59e0b]' : 'text-white'}`} >{stat.value}</p>
                  <p className="text-white/30 text-xs mt-1" >{stat.label}</p>
                </div>)}
            </div>
          </div>
          
          {/* Pending Document Deletions Queue */}
          {(documents || []).filter((d: any) => d.status === 'pending_deletion').length > 0 && (
            <div className="bg-red-900/10 border border-red-500/20 p-5 mt-5">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle size={16} className="text-red-400" />
                <h3 className="text-red-400 font-semibold">Pending Document Deletions</h3>
              </div>
              <div className="space-y-2">
                {(documents || []).filter((d: any) => d.status === 'pending_deletion').map((doc: any) => (
                  <div key={doc.id} className="flex items-center justify-between p-3 bg-[#020617] border border-red-500/10 hover:border-red-500/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <FileText size={14} className="text-red-400/50" />
                      <div>
                        <p className="text-white text-sm font-medium">{doc.name}</p>
                        <p className="text-white/40 text-xs">
                          {doc.size} • Uploaded by {doc.uploadedBy || 'PM'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateDocument && updateDocument(doc.id, { status: 'active' })} className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white/70 text-[10px] uppercase tracking-wider rounded transition-colors">
                        Restore
                      </button>
                      <button onClick={() => deleteDocument && deleteDocument(doc.id)} className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 text-[10px] uppercase tracking-wider rounded transition-colors flex items-center gap-1">
                        <Check size={12} /> Confirm Hard Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 bg-[#0f172a] border border-amber-500/10 p-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-white text-sm font-semibold" >Pending Approvals</h3>
                {pendingCount > 0 && <span className="bg-[#f59e0b]/20 text-[#f59e0b] text-[10px] px-2.5 py-0.5 font-semibold">{pendingCount} pending</span>}
              </div>
              <div className="space-y-2.5">
                {approvals.filter(a => a.status === 'pending').slice(0, 3).map(a => <div key={a.id} className="flex items-center justify-between bg-[#020617] p-3.5 border border-amber-500/10 hover:border-[#f59e0b]/20 transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      {a.imageUrl && <img src={a.imageUrl} alt={a.title} className="w-10 h-10 object-cover shrink-0 opacity-70" />}
                      <div className="min-w-0">
                        <p className="text-white text-sm truncate" >{a.title}</p>
                        <p className="text-white/30 text-xs" >{a.type} · <span className="text-[#f59e0b]/80">{a.due}</span></p>
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0 ml-3">
                      <button onClick={() => setSelectedApproval(a)} className="px-3 py-1.5 bg-white/5 border border-white/10 text-white/50 text-[10px] hover:text-white transition-colors" >Review</button>
                      <button onClick={() => handleApproval(a.id, 'approved')} className="w-7 h-7 bg-emerald-900/30 border border-emerald-700/30 flex items-center justify-center hover:bg-emerald-800/40 transition-colors"><Check size={12} className="text-emerald-400" /></button>
                      <button onClick={() => handleApproval(a.id, 'declined')} className="w-7 h-7 bg-red-900/20 border border-red-700/20 flex items-center justify-center hover:bg-red-800/30 transition-colors"><X size={12} className="text-red-400" /></button>
                    </div>
                  </div>)}
                {pendingCount === 0 && <div className="text-center py-8">
                    <CheckCircle2 size={28} className="text-emerald-400/40 mx-auto mb-2" />
                    <p className="text-white/30 text-sm" >All caught up — no pending approvals</p>
                  </div>}
              </div>
              {pendingCount > 0 && <button onClick={() => setActiveTab('approvals')} className="mt-4 text-[#f59e0b] text-xs tracking-[0.1em] uppercase flex items-center gap-1.5 hover:gap-2.5 transition-all" >
                  <span>View All Approvals</span><ArrowRight size={12} />
                </button>}
            </div>

            <div className="bg-[#0f172a] border border-amber-500/10 p-5">
              <h3 className="text-white text-sm font-semibold mb-4" >Latest Site Updates</h3>
              <div className="space-y-4">
                {siteUpdates.slice(0, 3).map(upd => <button key={upd.id} onClick={() => {
              setActiveTab('updates');
              setSelectedUpdate(upd);
            }} className="w-full text-left border-l-2 border-[#f59e0b]/30 pl-3.5 hover:border-[#f59e0b] transition-colors group">
                    <p className="text-[#f59e0b] text-[10px] uppercase tracking-[0.1em] mb-0.5" >{upd.date}</p>
                    <p className="text-white text-xs font-medium mb-0.5" >{upd.title}</p>
                    <p className="text-white/40 text-xs leading-relaxed line-clamp-2" >{upd.description}</p>
                  </button>)}
              </div>
              <button onClick={() => setActiveTab('updates')} className="mt-5 text-[#f59e0b] text-xs tracking-[0.1em] uppercase flex items-center gap-1.5 hover:gap-2.5 transition-all" >
                <span>All Updates</span><ArrowRight size={12} />
              </button>
            </div>
          </div>
        </div>}

      {/* ── TIMELINE ── */}
      {activeTab === 'timeline' && <div className="bg-[#0f172a] border border-amber-500/10 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-white font-semibold" >Project Milestones</h2>
            <span className="text-white/30 text-xs" >{completedMilestones} of {milestones.length} complete</span>
          </div>
          <div className="space-y-0">
            {milestones.map((m, i) => <div key={m.id} className="flex gap-6 items-start group">
                <div className="flex flex-col items-center">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all ${m.done ? 'bg-[#f59e0b] border-[#f59e0b]' : i === completedMilestones ? 'bg-transparent border-[#f59e0b]/50 border-dashed' : 'bg-transparent border-white/15'}`}>
                    {m.done ? <Check size={14} className="text-[#020617]" /> : <span className="text-white/30 text-xs font-medium">{i + 1}</span>}
                  </div>
                  {i < milestones.length - 1 && <div className={`w-0.5 h-12 ${m.done ? 'bg-[#f59e0b]/40' : 'bg-white/8'}`} />}
                </div>
                <div className={`pb-10 flex-1 ${i === completedMilestones ? 'opacity-100' : m.done ? 'opacity-60' : 'opacity-40'}`}>
                  <div className="flex flex-wrap justify-between items-start gap-2">
                    <p className={`font-medium text-sm ${m.done ? 'text-white' : i === completedMilestones ? 'text-[#f59e0b]' : 'text-white/50'}`} >{m.label}</p>
                    <p className="text-white/30 text-xs" >{m.date}</p>
                  </div>
                  {m.note && <p className="text-white/40 text-xs mt-1.5 leading-relaxed" >{m.note}</p>}
                  {i === completedMilestones && !m.done && <span className="inline-block mt-2 text-[10px] bg-[#f59e0b]/15 text-[#f59e0b] px-2 py-0.5 tracking-[0.08em] uppercase" >Current Phase</span>}
                </div>
              </div>)}
          </div>
        </div>}

      {/* ── APPROVALS ── */}
      {activeTab === 'approvals' && <div className="space-y-4">
          {selectedApproval && <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
              <div className="bg-[#0f172a] border border-amber-500/10 w-full max-w-lg">
                <div className="flex justify-between items-center p-5 border-b border-amber-500/10">
                  <div>
                    <p className="text-[#f59e0b] text-[10px] tracking-[0.15em] uppercase mb-0.5" >{selectedApproval.type}</p>
                    <h3 className="text-white font-medium" >{selectedApproval.title}</h3>
                  </div>
                  <button onClick={() => setSelectedApproval(null)} className="text-white/30 hover:text-white/60"><X size={18} /></button>
                </div>
                {selectedApproval.imageUrl && <img src={selectedApproval.imageUrl} alt={selectedApproval.title} className="w-full h-52 object-cover" />}
                <div className="p-5">
                  <p className="text-white/50 text-sm leading-relaxed mb-5" >{selectedApproval.description}</p>
                  <p className="text-white/30 text-xs mb-5" >{selectedApproval.due}</p>
                  <div className="flex gap-3">
                    <button onClick={() => handleApproval(selectedApproval.id, 'approved')} className="flex-1 py-3 bg-emerald-900/40 border border-emerald-700/40 text-emerald-400 text-sm font-semibold hover:bg-emerald-800/50 transition-colors flex items-center justify-center gap-2"><Check size={15} /><span>Approve</span></button>
                    <button onClick={() => handleApproval(selectedApproval.id, 'declined')} className="flex-1 py-3 bg-red-900/20 border border-red-700/20 text-red-400 text-sm font-semibold hover:bg-red-800/30 transition-colors flex items-center justify-center gap-2"><X size={15} /><span>Decline</span></button>
                  </div>
                </div>
              </div>
            </div>}
          {(['pending', 'approved', 'declined'] as const).map(status => {
        const group = approvals.filter(a => a.status === status);
        if (group.length === 0) return null;
        return <div key={status} className="bg-[#0f172a] border border-amber-500/10 p-5">
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="text-white text-sm font-semibold capitalize" >{status}</h3>
                  <span className={`text-[10px] px-2 py-0.5 font-semibold uppercase ${status === 'pending' ? 'bg-[#f59e0b]/20 text-[#f59e0b]' : status === 'approved' ? 'bg-emerald-900/30 text-emerald-400' : 'bg-red-900/20 text-red-400'}`}>{group.length}</span>
                </div>
                <div className="space-y-3">
                  {group.map(a => <div key={a.id} className={`flex items-center justify-between p-4 border transition-colors ${status === 'pending' ? 'bg-[#020617] border-amber-500/10 hover:border-[#f59e0b]/20' : 'bg-[#020617]/50 border-white/3'}`}>
                      <div className="flex items-center gap-3 min-w-0">
                        {a.imageUrl && <img src={a.imageUrl} alt={a.title} className="w-12 h-12 object-cover shrink-0 opacity-70" />}
                        <div className="min-w-0">
                          <p className="text-white text-sm font-medium truncate" >{a.title}</p>
                          <p className="text-white/30 text-xs" >{a.type} · {a.due}</p>
                        </div>
                      </div>
                      {status === 'pending' ? <div className="flex gap-2 ml-3 shrink-0">
                          <button onClick={() => setSelectedApproval(a)} className="px-3 py-1.5 bg-white/5 border border-white/10 text-white/50 text-xs hover:text-white transition-colors" >Review</button>
                          <button onClick={() => handleApproval(a.id, 'approved')} className="px-4 py-1.5 bg-emerald-900/30 border border-emerald-700/30 text-emerald-400 text-xs hover:bg-emerald-800/40 transition-colors flex items-center gap-1"><Check size={11} /><span>Approve</span></button>
                          <button onClick={() => handleApproval(a.id, 'declined')} className="px-4 py-1.5 bg-red-900/20 border border-red-700/20 text-red-400 text-xs hover:bg-red-800/30 transition-colors flex items-center gap-1"><X size={11} /><span>Decline</span></button>
                        </div> : <div className="flex items-center gap-2 ml-3">
                          <span className={`text-xs px-3 py-1 font-semibold ${status === 'approved' ? 'bg-emerald-900/30 text-emerald-400' : 'bg-red-900/20 text-red-400'}`}>{status === 'approved' ? 'Approved' : 'Declined'}</span>
                          {status === 'declined' && <button onClick={() => setApprovals(prev => prev.map(ap => ap.id === a.id ? {
                  ...ap,
                  status: 'pending'
                } : ap))} className="text-white/25 text-xs hover:text-white/50 transition-colors" >Undo</button>}
                        </div>}
                    </div>)}
                </div>
              </div>;
      })}
        </div>}

      {/* ── SITE UPDATES ── */}
      {activeTab === 'updates' && <div className="space-y-5">
          {selectedUpdate && <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <div className="bg-[#0f172a] border border-amber-500/10 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
                <div className="flex justify-between items-center p-5 border-b border-amber-500/10 bg-[#020617] sticky top-0 z-10">
                  <div>
                    <p className="text-[#f59e0b] text-[10px] tracking-[0.15em] uppercase mb-0.5" >{selectedUpdate.date} · {selectedUpdate.phase}</p>
                    <h3 className="text-white font-medium text-lg" >{selectedUpdate.title}</h3>
                  </div>
                  <button onClick={() => { setSelectedUpdate(null); setActivePhotoIndex(0); }} className="text-white/30 hover:text-white/60"><X size={20} /></button>
                </div>
                {selectedUpdate.photos.length > 0 && <div className="relative w-full aspect-[16/9] bg-black group/slider border-b border-amber-500/10 flex items-center justify-center">
                    <img src={selectedUpdate.photos[activePhotoIndex]} alt={`Site update photo ${activePhotoIndex + 1}`} className="w-full h-full object-contain" />
                    
                    {selectedUpdate.photos.length > 1 && (
                      <>
                        <button 
                          onClick={(e) => { e.stopPropagation(); setActivePhotoIndex(prev => prev === 0 ? selectedUpdate.photos.length - 1 : prev - 1); }}
                          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-[#f59e0b] text-white rounded-full flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-all border border-white/10"
                        >
                          <ChevronLeft size={20} />
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); setActivePhotoIndex(prev => prev === selectedUpdate.photos.length - 1 ? 0 : prev + 1); }}
                          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-[#f59e0b] text-white rounded-full flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-all border border-white/10"
                        >
                          <ChevronRight size={20} />
                        </button>
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/5">
                          {selectedUpdate.photos.map((_, idx) => (
                            <button 
                              key={idx} 
                              onClick={() => setActivePhotoIndex(idx)}
                              className={`w-1.5 h-1.5 rounded-full transition-all ${idx === activePhotoIndex ? 'bg-[#f59e0b] w-3' : 'bg-white/40 hover:bg-white/80'}`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>}
                <div className="p-6">
                  <p className="text-white/70 text-base leading-relaxed mb-6" >{selectedUpdate.description}</p>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-[#f59e0b] text-xs font-bold">
                      {selectedUpdate.reportedBy.split(' ').map(n => n[0]).join('')}
                    </div>
                    <p className="text-white/30 text-sm" >Reported by <span className="text-white/70 font-medium">{selectedUpdate.reportedBy}</span></p>
                  </div>
                </div>
              </div>
            </div>}
          <div className="bg-[#0f172a] border border-amber-500/10 p-5">
            <h2 className="text-white font-semibold mb-5" >Site Progress Updates</h2>
            <div className="space-y-4">
              {siteUpdates.map(upd => <div key={upd.id} className="bg-[#020617] border border-amber-500/10 hover:border-[#f59e0b]/20 transition-colors cursor-pointer group" onClick={() => setSelectedUpdate(upd)}>
                  <div className="flex gap-4 p-4">
                    {upd.photos.length > 0 ? <img src={upd.photos[0]} alt={upd.title} className="w-20 h-20 object-cover shrink-0 opacity-80" /> : <div className="w-20 h-20 bg-white/5 flex items-center justify-center shrink-0">
                        <Camera size={20} className="text-white/20" />
                      </div>}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-3 mb-1.5">
                        <p className="text-white font-medium text-sm" >{upd.title}</p>
                        <p className="text-white/30 text-xs shrink-0" >{upd.date}</p>
                      </div>
                      <p className="text-[#f59e0b] text-[10px] uppercase tracking-wider mb-2" >{upd.phase}</p>
                      <p className="text-white/40 text-xs leading-relaxed line-clamp-2" >{upd.description}</p>
                      <div className="flex items-center gap-4 mt-3">
                        <span className="text-white/25 text-xs" >By {upd.reportedBy}</span>
                        {upd.photos.length > 0 && <span className="flex items-center gap-1 text-white/25 text-xs">
                            <FileImage size={11} /><span >{upd.photos.length} photos</span>
                          </span>}
                        <span className="text-[#f59e0b] text-xs group-hover:underline" >View details →</span>
                      </div>
                    </div>
                  </div>
                </div>)}
            </div>
          </div>
        </div>}

      {/* ── DOCUMENTS ── */}
      {activeTab === 'documents' && <div className="bg-[#0f172a] border border-amber-500/10 p-5">
          <div className="flex flex-wrap gap-3 justify-between items-center mb-5">
            <h2 className="text-white font-semibold" >Documents & Files</h2>
            <div className="flex gap-2 flex-wrap">
              <div className="flex items-center gap-2 bg-[#020617] border border-amber-500/10 px-3 py-2">
                <Search size={12} className="text-white/30" />
                <input value={docSearch} onChange={e => setDocSearch(e.target.value)} placeholder="Search files..." className="bg-transparent text-white text-xs w-32 focus:outline-none placeholder:text-white/20"  />
              </div>
              <div className="flex gap-1">
                {docTypes.map(t => <button key={t} onClick={() => setDocFilter(t)} className={`px-3 py-2 text-[10px] uppercase tracking-wider border transition-colors ${docFilter === t ? 'bg-[#f59e0b] border-[#f59e0b] text-[#020617] font-bold' : 'border-amber-500/10 text-white/30 hover:border-amber-500/25'}`} >{t}</button>)}
              </div>
            </div>
          </div>
          <div className="space-y-2">
            {filteredDocs.map(doc => <div key={doc.id} className="flex items-center justify-between p-4 bg-[#020617] border border-amber-500/10 hover:border-amber-500/20 transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-[#f59e0b]/10 flex items-center justify-center shrink-0">
                    <FileText size={15} className="text-[#f59e0b]" />
                  </div>
                  <div>
                    <p className="text-white text-sm" >{doc.name}</p>
                    <p className="text-white/30 text-xs mt-0.5" >{doc.type} · {doc.size} · Added {doc.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {(doc.name.includes('3D') || ['3D', 'GLB', 'GLTF', 'USDZ', 'FBX', 'OBJ', 'DAE', 'STL', '3MF', 'STEP', 'STP', 'IGES'].includes(doc.type) || doc.type === 'ZIP') && (
                    <button onClick={() => setSelected3DDoc(doc)} className="text-white/25 hover:text-[#f59e0b] transition-colors opacity-0 group-hover:opacity-100 px-2 py-1 flex items-center gap-1 bg-[#f59e0b]/10 rounded border border-[#f59e0b]/20">
                      <Eye size={13} /><span className="text-[10px] uppercase font-semibold text-[#f59e0b]" >View 3D</span>
                    </button>
                  )}
                  <button onClick={() => toast.success('Downloading...')} className="text-white/25 hover:text-[#f59e0b] transition-colors opacity-0 group-hover:opacity-100"><Download size={15} /></button>
                </div>
              </div>)}
            {filteredDocs.length === 0 && <div className="text-center py-10">
                <FileText size={24} className="text-white/10 mx-auto mb-2" />
                <p className="text-white/30 text-sm" >No documents match your search</p>
              </div>}
          </div>

          {/* 3D Viewer Modal */}
          {selected3DDoc && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#020617]/90 backdrop-blur-sm">
              <div className="bg-[#0f172a] w-full max-w-5xl h-[80vh] border border-[#f59e0b]/30 flex flex-col shadow-2xl">
                <div className="flex justify-between items-center p-4 border-b border-white/10 bg-[#020617]">
                  <div className="flex items-center gap-3">
                    <div className="bg-[#f59e0b]/20 p-2 rounded">
                      <Layers size={16} className="text-[#f59e0b]" />
                    </div>
                    <div>
                      <h3 className="text-white font-medium" >{selected3DDoc.name}</h3>
                      <p className="text-white/40 text-[10px] uppercase tracking-wide" >In-Browser 3D Viewer</p>
                    </div>
                  </div>
                  <button onClick={() => setSelected3DDoc(null)} className="text-white/40 hover:text-white bg-white/5 p-2 rounded transition-colors">
                    <X size={18} />
                  </button>
                </div>
                
                <div className="flex-1 relative bg-[#020617] overflow-hidden group flex items-center justify-center">
                  {/* Real 3D Model Viewer */}
                  {(() => {
                    const ext = selected3DDoc.url?.match(/\.([a-zA-Z0-9]+)(?:[\?#]|$)/)?.[1]?.toLowerCase() || selected3DDoc.type?.toLowerCase();
                    if (ext === 'usdz') {
                      return (
                        // @ts-ignore
                        <model-viewer 
                          src={selected3DDoc.url || 'https://modelviewer.dev/shared-assets/models/Astronaut.glb'}
                          alt={selected3DDoc.name}
                          auto-rotate
                          camera-controls
                          shadow-intensity="1"
                          environment-image="neutral"
                          exposure="1.2"
                          style={{ width: '100%', height: '100%' }}
                        ></model-viewer>
                      );
                    }
                    return <Universal3DViewer url={selected3DDoc.url || ''} type={selected3DDoc.type || ''} orbitSpeed={orbitSpeed} resetHash={viewerResetHash} />;
                  })()}
                  
                  {/* WebGL Overlay Grid */}
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA0MCAwIEwgMCAwIDAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50 pointer-events-none"></div>

                  {/* Viewer Controls */}
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-[#0f172a]/90 backdrop-blur border border-white/10 px-6 py-3 rounded-full shadow-xl">
                    <button onClick={() => setViewerResetHash(Date.now())} className="text-white/50 hover:text-white transition-colors"><RefreshCw size={18} /></button>
                    <div className="w-px h-4 bg-white/10"></div>
                    <button onClick={() => setOrbitSpeed(s => s === 0 ? -1 : (s > 0 ? -s : s * 1.5))} className="text-white/50 hover:text-[#f59e0b] transition-colors"><ChevronLeft size={20} /></button>
                    <button onClick={() => setOrbitSpeed(s => s === 0 ? 1 : 0)} className="text-[10px] text-white/60 tracking-widest uppercase font-semibold mx-2 hover:text-white" >Orbit</button>
                    <button onClick={() => setOrbitSpeed(s => s === 0 ? 1 : (s < 0 ? -s : s * 1.5))} className="text-white/50 hover:text-[#f59e0b] transition-colors"><ChevronRight size={20} /></button>
                    <div className="w-px h-4 bg-white/10"></div>
                    <button onClick={() => window.open(selected3DDoc?.url, '_blank')} className="text-white/50 hover:text-white transition-colors"><Download size={18} /></button>
                  </div>

                  {/* Loading overlay simulation */}
                  <div className="absolute top-4 left-4 flex items-center gap-3 bg-[#0f172a]/80 backdrop-blur px-3 py-2 border border-[#f59e0b]/30 rounded">
                    <div className="w-2 h-2 rounded-full bg-[#f59e0b] animate-pulse"></div>
                    <span className="text-[10px] text-[#f59e0b] font-medium tracking-wide" >WebGL Active</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>}

      {/* ── MESSAGES ── */}
      {/* ─────────────────── MESSAGES ─────────────────── */}
      {activeTab === 'messages' && (
        <div className="flex flex-col h-full min-h-[500px]" style={{ height: 'calc(100vh - 120px)' }}>
          <MessageHub 
            currentUser={currentUser} 
            allUsers={users || []}
          />
        </div>
      )}

      {/* ── PAYMENTS ── */}
      {activeTab === 'payments' && <div className="space-y-5">
          <div className="grid sm:grid-cols-3 gap-4">
            {[{
          label: 'Total Paid',
          value: formatCurrency(totalPaid),
          color: 'text-emerald-400',
          sub: `${paidInvoices} invoices settled`
        }, {
          label: 'Outstanding',
          value: formatCurrency(totalOutstanding),
          color: 'text-[#f59e0b]',
          sub: totalOutstanding > 0 ? 'Pending payment' : 'All clear'
        }, {
          label: 'Overdue',
          value: formatCurrency(totalOverdueAmount),
          color: overdueInvoices > 0 ? 'text-red-400' : 'text-white/40',
          sub: overdueInvoices > 0 ? 'Action required' : 'All clear'
        }].map(s => <div key={s.label} className="bg-[#0f172a] border border-amber-500/10 p-5">
                <p className={`text-2xl font-light ${s.color}`} >{s.value}</p>
                <p className="text-white/40 text-xs mt-1" >{s.label}</p>
                <p className="text-white/20 text-[10px] mt-0.5" >{s.sub}</p>
              </div>)}
          </div>
          <div className="bg-[#0f172a] border border-amber-500/10 p-5">
            <h2 className="text-white font-semibold mb-5" >Invoice History</h2>
            <div className="space-y-2.5">
              {invoices.map(inv => <div key={inv.id} className={`flex items-center justify-between p-4 border transition-colors ${inv.status === 'overdue' ? 'bg-red-900/10 border-red-800/20' : 'bg-[#020617] border-amber-500/10'}`}>
                  <div>
                    <p className="text-white text-sm font-medium" >{inv.label}</p>
                    <p className="text-white/30 text-xs mt-0.5" >{inv.ref} · Due {inv.due}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-white font-medium" >{inv.amount}</span>
                    <span className={`text-xs px-3 py-1 font-semibold uppercase tracking-wider ${inv.status === 'paid' ? 'bg-emerald-900/30 text-emerald-400' : inv.status === 'overdue' ? 'bg-red-900/30 text-red-400' : 'bg-[#f59e0b]/15 text-[#f59e0b]'}`} >{inv.status}</span>
                    {inv.status !== 'paid' && <button onClick={() => handlePayment(inv.id)} className="text-[#f59e0b] text-xs font-semibold underline hover:text-[#fbbf24] transition-colors" >Pay Now</button>}
                    <button onClick={() => toast.success('Downloading document...')} className="text-white/20 hover:text-white/50 transition-colors"><Download size={13} /></button>
                  </div>
                </div>)}
            </div>
          </div>
          <div className="bg-[#0f172a] border border-amber-500/10 p-5">
            <h3 className="text-white font-semibold mb-3" >Payment Schedule</h3>
            <p className="text-white/40 text-sm mb-4" >Milestone-based payment structure for The Penthouse Residency.</p>
            <div className="grid grid-cols-3 gap-4">
              {[{
            phase: 'At Start',
            pct: '30%',
            amount: '₹3,50,000',
            done: true
          }, {
            phase: 'During Execution',
            pct: '40%',
            amount: '₹13,50,000',
            done: false
          }, {
            phase: 'On Handover',
            pct: '30%',
            amount: '₹11,20,000',
            done: false
          }].map(p => <div key={p.phase} className={`p-4 border text-center ${p.done ? 'bg-emerald-900/10 border-emerald-800/20' : 'bg-[#020617] border-amber-500/10'}`}>
                  <p className={`text-xl font-light mb-1 ${p.done ? 'text-emerald-400' : 'text-[#f59e0b]'}`} >{p.pct}</p>
                  <p className="text-white text-xs font-medium mb-0.5" >{p.phase}</p>
                  <p className="text-white/30 text-xs" >{p.amount}</p>
                  {p.done && <div className="flex items-center justify-center gap-1 mt-2">
                      <Check size={10} className="text-emerald-400" />
                      <span className="text-emerald-400 text-[10px]" >Paid</span>
                    </div>}
                </div>)}
            </div>
          </div>
        </div>}

      {activeTab === 'design-assistant' && (
        <div className="space-y-5">
          <DesignAssistant onNavigate={setActiveTab} currentUser={currentUser} />
        </div>
      )}

      {/* Approval Review Modal */}
      {selectedApproval && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-amber-500/20 w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-amber-500/10 bg-[#020617]">
              <h3 className="text-white font-semibold text-lg" >
                Review Approval
              </h3>
              <button 
                onClick={() => setSelectedApproval(null)}
                className="text-white/40 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Content */}
            <div className="p-6 space-y-6 flex-1">
              {/* Image Preview */}
              {selectedApproval.imageUrl && (
                <div className="relative aspect-video w-full rounded overflow-hidden border border-white/10 bg-black/50 flex items-center justify-center">
                  <img src={selectedApproval.imageUrl} alt={selectedApproval.title} className="w-full h-full object-contain" />
                </div>
              )}
              
              {/* Info */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs tracking-[0.1em] text-[#f59e0b] uppercase font-semibold border border-[#f59e0b]/30 px-2 py-0.5 bg-[#f59e0b]/10 rounded-sm">
                    {selectedApproval.type}
                  </span>
                  <span className="text-white/40 text-xs font-medium">Due: {selectedApproval.due}</span>
                </div>
                <h4 className="text-white text-2xl mb-3 mt-4" >
                  {selectedApproval.title}
                </h4>
                
                <p className="text-slate-300 text-sm leading-relaxed" >
                  Please review the attached details for the {selectedApproval.title}. Your prompt approval will allow the execution team to proceed with the procurement and installation phases without delay. Let us know if you need any adjustments before proceeding.
                </p>
              </div>
            </div>
            
            {/* Actions */}
            <div className="p-5 border-t border-amber-500/10 bg-[#020617] flex gap-3 justify-end">
              <button 
                onClick={() => handleApproval(selectedApproval.id, 'declined')}
                className="px-6 py-2.5 border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors font-medium text-sm flex items-center gap-2"
              >
                <X size={16} /> Decline
              </button>
              <button 
                onClick={() => handleApproval(selectedApproval.id, 'approved')}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white transition-colors font-medium text-sm flex items-center gap-2 shadow-lg shadow-emerald-900/20"
              >
                <Check size={16} /> Approve Now
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'profile-settings' && <ProfileSettings userName={userName} />}
      {activeTab === 'security-details' && <SecurityDetails />}
      {activeTab === 'help-support' && <HelpSupport />}

    </HubShell>;
};

/* ─────────────────── Project Manager DASHBOARD ─────────────────── */

export const HubManagerPage: React.FC<HubPageProps> = ({
  onNavigate
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const userStr = localStorage.getItem('aura_user');
  const currentUser = userStr ? JSON.parse(userStr) : { id: 'm-1', role: 'manager', name: 'Sarah Jenkins' };

  const formatIndianDate = (dateString: string) => {
    if (!dateString) return '';
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return dateString;
    const [year, month, day] = dateString.split('-');
    return `${day}-${month}-${year}`;
  };

  useEffect(() => {
    if (currentUser && currentUser.role !== 'manager') {
      onNavigate((currentUser.role === 'customer' || currentUser.role === 'client') ? 'hub-customer' : 'hub-admin');
    }
  }, [currentUser, onNavigate]);
  const { data: users } = useApiData('users');
  const { data: tasks, setData: setTasks } = useApiData('tasks');
  const { data: issues, setData: setIssues } = useApiData('issues');
  const { data: siteLogs, setData: setSiteLogs } = useApiData('sitelogs');
  const { data: siteUpdates, setData: setSiteUpdates } = useApiData('siteupdates');
  const [newClientUpdateOpen, setNewClientUpdateOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [clientUpdateForm, setClientUpdateForm] = useState({ title: '', phase: '', description: '', photos: [] as string[] });
  const [newLogOpen, setNewLogOpen] = useState(false);
  const [newIssueOpen, setNewIssueOpen] = useState(false);
  const [logForm, setLogForm] = useState({
    title: '',
    summary: '',
    crew: '',
    progress: '',
    projectId: '',
    photos: [] as string[]
  });
  const [issueForm, setIssueForm] = useState({
    title: '',
    priority: 'medium',
    assignee: '',
    projectId: ''
  });
  const [newTaskForm, setNewTaskForm] = useState({
    text: '',
    projectId: ''
  });
  const [approvals, setApprovals] = useState(initialApprovals);
  const [newApprovalOpen, setNewApprovalOpen] = useState(false);
  const [approvalForm, setApprovalForm] = useState({
    title: '',
    type: 'Material',
    due: '',
    description: '',
    projectId: '',
    imageUrl: ''
  });
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const { data: documents, setData: setDocuments, updateItem: updateDocument, deleteItem: deleteDocument } = useApiData('documents');
  const { data: projects, setData: setProjects } = useApiData('projects');
  const [selectedUploadProject, setSelectedUploadProject] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentUserId = currentUser?.id || 'u-mgr-1';
  const userName = currentUser?.name || 'Suresh Menon';
  const userInitials = userName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();
  const assignedProjects = projects.filter(p => p.managerId === currentUserId);

  const doneCount = tasks.filter(t => t.done).length;
  const openIssues = issues.filter(i => i.status === 'open').length;
  const pendingApprovals = approvals.filter(a => a.status === 'pending');
  const toggleTask = (id: string) => setTasks(prev => prev.map(t => t.id === id ? {
    ...t,
    done: !t.done
  } : t));
  const addApproval = () => {
    if (!approvalForm.title.trim()) return;
    setApprovals(prev => [{
      id: `app-${Date.now()}`,
      projectId: approvalForm.projectId,
      title: approvalForm.title.trim(),
      type: approvalForm.type as any,
      due: approvalForm.due || 'TBD',
      description: approvalForm.description,
      imageUrl: approvalForm.imageUrl,
      status: 'pending'
    }, ...prev]);
    setApprovalForm({ title: '', type: 'Material', due: '', description: '', projectId: '', imageUrl: '' });
    setNewApprovalOpen(false);
    toast.success('Approval request sent to client');
  };
  const addTask = () => {
    if (!newTaskForm.text.trim()) return;
    setTasks(prev => [...prev, {
      id: `t-${Date.now()}`,
      label: newTaskForm.text.trim(),
      done: false,
      assignee: 'Suresh M.',
      due: new Date(Date.now() + 86400000 * 3).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short'
      }),
      projectId: newTaskForm.projectId
    }]);
    setNewTaskForm({ text: '', projectId: '' });
  };
  const removeTask = (id: string) => setTasks(prev => prev.filter(t => t.id !== id));
  const submitLog = () => {
    if (!logForm.title.trim() || !logForm.summary.trim()) return;
    const newLog: SiteLog = {
      id: `sl-${Date.now()}`,
      date: new Date().toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }),
      title: logForm.title,
      summary: logForm.summary,
      crew: parseInt(logForm.crew) || 0,
      progress: parseInt(logForm.progress) || 0,
      photos: [],
      projectId: logForm.projectId
    };
    setSiteLogs(prev => [newLog, ...prev]);
    setLogForm({
      title: '',
      summary: '',
      crew: '',
      progress: '',
      projectId: ''
    });
    setNewLogOpen(false);
  };

  const submitClientUpdate = () => {
    if (!clientUpdateForm.title.trim() || !clientUpdateForm.description.trim()) return;
    const newUpdate = {
      id: `su-${Date.now()}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      title: clientUpdateForm.title,
      description: clientUpdateForm.description,
      phase: clientUpdateForm.phase || 'General Update',
      photos: clientUpdateForm.photos,
      reportedBy: userName || 'Site Manager'
    };
    setSiteUpdates(prev => [newUpdate, ...(prev || [])]);
    setClientUpdateForm({ title: '', phase: '', description: '', photos: [] });
    setNewClientUpdateOpen(false);
  };

  const submitIssue = () => {
    if (!issueForm.title.trim()) return;
    const newIssue: Issue = {
      id: `iss-${Date.now()}`,
      title: issueForm.title,
      priority: issueForm.priority as 'high' | 'medium' | 'low',
      status: 'open',
      date: new Date().toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short'
      }),
      assignee: issueForm.assignee || 'Unassigned',
      projectId: issueForm.projectId
    };
    setIssues(prev => [newIssue, ...prev]);
    setIssueForm({
      title: '',
      priority: 'medium',
      assignee: '',
      projectId: ''
    });
    setNewIssueOpen(false);
  };
  const updateIssueStatus = (id: string, status: Issue['status']) => setIssues(prev => prev.map(i => i.id === id ? {
    ...i,
    status
  } : i));
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const newFiles = files.filter(f => {
      const exists = documents?.some((d: any) => d.name === f.name && d.status !== 'pending_deletion') || uploadedFiles.some(uf => uf.name === f.name);
      if (exists) {
        toast.error(`File "${f.name}" already exists.`);
        return false;
      }
      return true;
    });
    if (newFiles.length > 0) setUploadedFiles(prev => [...prev, ...newFiles]);
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (!selectedUploadProject) {
      toast.error("Please select a project before dropping files.");
      return;
    }
    const files = Array.from(e.dataTransfer.files);
    const newFiles = files.filter(f => {
      const exists = documents?.some((d: any) => d.name === f.name && d.status !== 'pending_deletion') || uploadedFiles.some(uf => uf.name === f.name);
      if (exists) {
        toast.error(`File "${f.name}" already exists.`);
        return false;
      }
      return true;
    });
    if (newFiles.length > 0) {
      setUploadedFiles(prev => [...prev, ...newFiles]);
    }
  };
  
  const handleUploadSubmit = async () => {
    if (!selectedUploadProject || uploadedFiles.length === 0) return;
    setIsUploading(true);
    setUploadProgress(0);
    try {
      const formData = new FormData();
      uploadedFiles.forEach(file => {
        formData.append('files', file);
      });
      
      const xhr = new XMLHttpRequest();
      xhr.open('POST', '/api/upload', true);
      
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const percentComplete = Math.round((e.loaded / e.total) * 100);
          setUploadProgress(percentComplete);
        }
      };

      const data = await new Promise<any>((resolve, reject) => {
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(JSON.parse(xhr.responseText));
          } else {
            reject(new Error('Upload failed'));
          }
        };
        xhr.onerror = () => reject(new Error('Network error'));
        xhr.send(formData);
      });

      const newDocs: Document[] = data.files.map((fileObj: any) => ({
        id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        name: fileObj.name,
        type: fileObj.type,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        size: fileObj.size,
        projectId: selectedUploadProject,
        uploadedBy: currentUserId,
        url: fileObj.url,
        status: 'active'
      }));
      setDocuments((prev: any) => {
        const nextData = [...(prev || []), ...newDocs];
        localStorage.setItem('aura_mock_documents', JSON.stringify(nextData));
        return nextData;
      });
      setUploadedFiles([]);
      setSelectedUploadProject('');
      toast.success('Files uploaded successfully!');
    } catch (error) {
      console.error('Error uploading files:', error);
      toast.error('Failed to upload files. Please try again.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };
  const priorityColors: Record<string, string> = {
    high: 'bg-red-900/30 text-red-400 border-red-800/30',
    medium: 'bg-yellow-900/20 text-yellow-400 border-yellow-800/20',
    low: 'bg-white/5 text-white/30 border-white/10'
  };
  const statusColors: Record<string, string> = {
    open: 'text-red-400',
    'in-progress': 'text-yellow-400',
    resolved: 'text-emerald-400'
  };
  return <HubShell role="manager" onNavigate={onNavigate} activeTab={activeTab} onTabChange={setActiveTab} notifCount={openIssues} userName={userName} userInitials={userInitials}>

      {/* ── TODAY OVERVIEW ── */}
      {activeTab === 'overview' && <div className="space-y-5">
          {assignedProjects.length > 0 && (
            <div className="bg-[#0f172a] border border-amber-500/10 p-5 mb-5">
              <h3 className="text-white font-semibold mb-4" >Your Assigned Projects</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {assignedProjects.map(project => (
                  <div key={project.id} className="bg-[#020617] border border-slate-800 p-4 relative overflow-hidden group">
                    <div className={`absolute top-0 left-0 w-1 h-full ${project.health === 'green' ? 'bg-emerald-500' : project.health === 'amber' ? 'bg-amber-500' : 'bg-red-500'}`} />
                    <p className="text-white font-medium mb-1" >{project.name}</p>
                    <p className="text-[#f59e0b] text-[10px] tracking-[0.1em] uppercase mb-3" >{project.phase}</p>
                    <div className="flex items-center gap-3 text-white/40 text-xs" >
                      <span>Budget: {project.budget}</span>
                      <span>•</span>
                      <span>{project.completion}% Complete</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[{
          label: 'Tasks Remaining',
          value: `${tasks.length - doneCount}`,
          sub: `${doneCount} done today`,
          icon: CheckSquare,
          urgent: tasks.length - doneCount > 2
        }, {
          label: 'Open Issues',
          value: openIssues.toString(),
          sub: `${issues.filter(i => i.status === 'in-progress').length} in progress`,
          icon: AlertCircle,
          urgent: openIssues > 0
        }, {
          label: 'Pending Approvals',
          value: pendingApprovals.length.toString(),
          sub: 'awaiting client',
          icon: Layers,
          urgent: pendingApprovals.length > 0
        }].map(({
          label,
          value,
          sub,
          icon: Icon,
          urgent
        }) => <div key={label} className={`bg-[#0f172a] p-5 ${urgent ? 'border border-[#f59e0b]/25' : 'border border-amber-500/10'}`}>
                <Icon size={18} className={urgent ? 'text-[#f59e0b] mb-3' : 'text-white/30 mb-3'} />
                <p className={`text-2xl font-light ${urgent ? 'text-[#f59e0b]' : 'text-white'}`} >{value}</p>
                <p className="text-white/40 text-xs mt-0.5" >{label}</p>
                <p className="text-white/20 text-[10px] mt-0.5" >{sub}</p>
              </div>)}
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div className="bg-[#0f172a] border border-amber-500/10 p-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-white text-sm font-semibold" >Today's Tasks</h3>
                <span className="text-white/30 text-xs" >{doneCount}/{tasks.length}</span>
              </div>
              <div className="space-y-2.5">
                {tasks.slice(0, 5).map(t => <button key={t.id} onClick={() => toggleTask(t.id)} className="w-full flex items-center gap-3 text-left group">
                    <div className={`w-5 h-5 border flex items-center justify-center shrink-0 transition-colors ${t.done ? 'bg-[#f59e0b] border-[#f59e0b]' : 'border-white/20 group-hover:border-[#f59e0b]/50'}`}>
                      {t.done && <Check size={10} className="text-[#020617]" />}
                    </div>
                    <span className={`text-sm flex-1 ${t.done ? 'text-white/25 line-through' : 'text-white/70'}`} >{t.label}</span>
                  </button>)}
              </div>
              <button onClick={() => setActiveTab('tasks')} className="mt-4 text-[#f59e0b] text-xs tracking-[0.1em] uppercase flex items-center gap-1.5 hover:gap-2.5 transition-all" >
                <span>Manage All Tasks</span><ArrowRight size={12} />
              </button>
            </div>

            <div className="bg-[#0f172a] border border-amber-500/10 p-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-white text-sm font-semibold" >Active Issues</h3>
                <button onClick={() => setActiveTab('issues')} className="text-[#f59e0b] text-[10px] uppercase tracking-wider hover:text-[#fbbf24] transition-colors" >View All</button>
              </div>
              <div className="space-y-3">
                {issues.filter(i => i.status !== 'resolved').slice(0, 3).map(issue => <div key={issue.id} className="flex items-start justify-between p-3 bg-[#020617] border border-amber-500/10">
                    <div className="min-w-0 mr-3">
                      <p className="text-white text-sm leading-tight" >{issue.title}</p>
                      <p className="text-white/30 text-xs mt-1" >{issue.assignee} · {issue.date}</p>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 border shrink-0 font-semibold uppercase ${priorityColors[issue.priority]}`} >{issue.priority}</span>
                  </div>)}
              </div>
            </div>
          </div>

          {/* Recent logs summary */}
          <div className="bg-[#0f172a] border border-amber-500/10 p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white text-sm font-semibold" >Recent Site Logs</h3>
              <button onClick={() => setActiveTab('logs')} className="text-[#f59e0b] text-[10px] uppercase tracking-wider" >Add Log</button>
            </div>
            <div className="space-y-3">
              {siteLogs.slice(0, 2).map(log => <div key={log.id} className="flex items-center justify-between p-3 bg-[#020617] border border-amber-500/10">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-[#f59e0b] text-[10px] uppercase tracking-[0.12em]" >{log.date}</p>
                      {log.projectId && (
                        <span className="text-white/40 text-[10px] bg-white/5 px-1.5 py-0.5 rounded uppercase tracking-wider" >
                          {projects.find(p => p.id === log.projectId)?.name || 'Project'}
                        </span>
                      )}
                    </div>
                    <p className="text-white text-sm font-medium" >{log.title}</p>
                    <p className="text-white/40 text-xs mt-0.5 line-clamp-1" >{log.summary}</p>
                  </div>
                  <div className="text-right ml-4 shrink-0">
                    <p className="text-white/30 text-xs" >{log.crew} crew</p>
                    <p className="text-[#f59e0b] text-sm font-semibold">{log.progress}%</p>
                  </div>
                </div>)}
            </div>
          </div>
        </div>}

      {/* ── SITE LOGS ── */}﻿      {/* 🔹 SITE TRACKING & UPDATES 🔹 */}
      {activeTab === 'logs' && <div className="space-y-4">
          
          <div className="flex gap-3 mb-6">
            <button onClick={() => setNewClientUpdateOpen(!newClientUpdateOpen)} className="bg-[#f59e0b] text-[#020617] px-5 py-2.5 text-xs font-semibold flex items-center gap-2 hover:bg-[#fbbf24] transition-colors shadow-sm" >
              <PlusCircle size={14} /><span>Post Client Update</span>
            </button>
            <button onClick={() => setNewLogOpen(!newLogOpen)} className="bg-white/5 border border-white/10 text-white/70 px-5 py-2.5 text-xs font-semibold flex items-center gap-2 hover:bg-white/10 transition-colors" >
              <FileText size={14} /><span>New Internal Log</span>
            </button>
          </div>

          {newClientUpdateOpen && <div className="bg-[#0f172a] border border-[#f59e0b]/50 shadow-[0_0_15px_rgba(245,158,11,0.1)] p-6 mb-6">
              <h3 className="text-[#f59e0b] font-semibold mb-4 text-sm" >Post New Client Update</h3>
              <p className="text-white/40 text-xs mb-6" >This update will be visible immediately to the client in their portal.</p>
              
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-[10px] text-white/40 tracking-[0.1em] uppercase block mb-2" >Title</label>
                  <input value={clientUpdateForm.title} onChange={e => setClientUpdateForm(p => ({ ...p, title: e.target.value }))} placeholder="e.g. Master Bedroom Flooring Complete" className="w-full bg-[#020617] border border-slate-800 text-white px-4 py-2.5 text-sm focus:outline-none focus:border-[#f59e0b]/50 placeholder:text-white/20"  />
                </div>
                <div>
                  <label className="text-[10px] text-white/40 tracking-[0.1em] uppercase block mb-2" >Phase</label>
                  <input value={clientUpdateForm.phase} onChange={e => setClientUpdateForm(p => ({ ...p, phase: e.target.value }))} placeholder="e.g. Execution Phase 1" className="w-full bg-[#020617] border border-slate-800 text-white px-4 py-2.5 text-sm focus:outline-none focus:border-[#f59e0b]/50 placeholder:text-white/20"  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="text-[10px] text-white/40 tracking-[0.1em] uppercase block mb-2" >Description</label>
                <textarea value={clientUpdateForm.description} onChange={e => setClientUpdateForm(p => ({ ...p, description: e.target.value }))} rows={4} placeholder="Describe the progress for the client in rich detail..." className="w-full bg-[#020617] border border-slate-800 text-white px-4 py-2.5 text-sm focus:outline-none focus:border-[#f59e0b]/50 resize-none placeholder:text-white/20"  />
              </div>

              <div className="mb-6">
                <label className="text-[10px] text-white/40 tracking-[0.1em] uppercase block mb-2" >Photos</label>
                <div className="border border-dashed border-white/20 bg-[#020617] p-6 text-center hover:border-[#f59e0b]/50 transition-colors cursor-pointer group" onClick={() => {
                  setClientUpdateForm(p => ({ ...p, photos: [...p.photos, 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&q=80'] }));
                  toast.success('Mock photo selected');
                }}>
                  <Image size={24} className="text-white/20 mx-auto mb-2 group-hover:text-[#f59e0b] transition-colors" />
                  <p className="text-white/40 text-xs" >Click to upload progress photos</p>
                </div>
                {clientUpdateForm.photos.length > 0 && (
                  <div className="flex gap-3 mt-3 overflow-x-auto pb-2">
                    {clientUpdateForm.photos.map((url, i) => (
                      <div key={i} className="relative w-20 h-20 shrink-0 group">
                        <img src={url} alt="Progress" className="w-full h-full object-cover" />
                        <button onClick={() => setClientUpdateForm(p => ({ ...p, photos: p.photos.filter((_, idx) => idx !== i) }))} className="absolute top-1 right-1 bg-red-500/80 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                          <X size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-3 border-t border-amber-500/10 pt-4">
                <button onClick={submitClientUpdate} className="bg-[#f59e0b] text-[#020617] px-6 py-2.5 text-xs font-semibold hover:bg-[#fbbf24] transition-colors shadow-sm" >Post Update to Client Feed</button>
                <button onClick={() => setNewClientUpdateOpen(false)} className="px-6 py-2.5 text-xs border border-amber-500/10 text-white/40 hover:text-white/70 transition-colors" >Cancel</button>
              </div>
          </div>}

          {newLogOpen && <div className="bg-[#0f172a] border border-[#f59e0b]/30 p-5 mb-6">
              <h3 className="text-white font-semibold mb-4 text-sm" >New Internal Site Log</h3>
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-[10px] text-white/40 tracking-[0.1em] uppercase block mb-2" >Title</label>
                  <input value={logForm.title} onChange={e => setLogForm(p => ({ ...p, title: e.target.value }))} placeholder="e.g. Flooring - Day 13" className="w-full bg-[#020617] border border-slate-800 text-white px-4 py-2.5 text-sm focus:outline-none focus:border-[#f59e0b]/50 placeholder:text-white/20"  />
                </div>
                <div>
                  <label className="text-[10px] text-white/40 tracking-[0.1em] uppercase block mb-2" >Project</label>
                  <select value={logForm.projectId} onChange={e => setLogForm(p => ({ ...p, projectId: e.target.value }))} className="w-full bg-[#020617] border border-slate-800 text-white px-4 py-2.5 text-sm focus:outline-none focus:border-[#f59e0b]/50" >
                    <option value="">Select Project</option>
                    {assignedProjects.map(proj => <option key={proj.id} value={proj.id}>{proj.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-white/40 tracking-[0.1em] uppercase block mb-2" >Crew Size</label>
                    <input type="number" value={logForm.crew} onChange={e => setLogForm(p => ({ ...p, crew: e.target.value }))} placeholder="0" className="w-full bg-[#020617] border border-slate-800 text-white px-4 py-2.5 text-sm focus:outline-none focus:border-[#f59e0b]/50 placeholder:text-white/20"  />
                  </div>
                  <div>
                    <label className="text-[10px] text-white/40 tracking-[0.1em] uppercase block mb-2" >Progress %</label>
                    <input type="number" min="0" max="100" value={logForm.progress} onChange={e => setLogForm(p => ({ ...p, progress: e.target.value }))} placeholder="0" className="w-full bg-[#020617] border border-slate-800 text-white px-4 py-2.5 text-sm focus:outline-none focus:border-[#f59e0b]/50 placeholder:text-white/20"  />
                  </div>
                </div>
              </div>
              <div className="mb-4">
                <label className="text-[10px] text-white/40 tracking-[0.1em] uppercase block mb-2" >Summary</label>
                <textarea value={logForm.summary} onChange={e => setLogForm(p => ({ ...p, summary: e.target.value }))} rows={3} placeholder="Describe today's internal site activity..." className="w-full bg-[#020617] border border-slate-800 text-white px-4 py-2.5 text-sm focus:outline-none focus:border-[#f59e0b]/50 resize-none placeholder:text-white/20"  />
              </div>
              <div className="mb-6">
                <label className="text-[10px] text-white/40 tracking-[0.1em] uppercase block mb-2" >Photos</label>
                <div className="border border-dashed border-white/20 bg-[#020617] p-6 text-center hover:border-white/40 transition-colors cursor-pointer group" onClick={() => {
                  setLogForm(p => ({ ...p, photos: [...(p.photos || []), 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&q=80'] }));
                  toast.success('Mock photo selected');
                }}>
                  <Image size={24} className="text-white/20 mx-auto mb-2 group-hover:text-white/40 transition-colors" />
                  <p className="text-white/40 text-xs" >Click to upload progress photos</p>
                </div>
                {logForm.photos && logForm.photos.length > 0 && (
                  <div className="flex gap-3 mt-3 overflow-x-auto pb-2">
                    {logForm.photos.map((url, i) => (
                      <div key={i} className="relative w-20 h-20 shrink-0 group">
                        <img src={url} alt="Progress" className="w-full h-full object-cover" />
                        <button onClick={() => setLogForm(p => ({ ...p, photos: p.photos.filter((_, idx) => idx !== i) }))} className="absolute top-1 right-1 bg-red-500/80 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                          <X size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex gap-3">
                <button onClick={submitLog} className="bg-white/10 text-white px-6 py-2.5 text-xs font-semibold hover:bg-white/20 transition-colors shadow-sm" >{logForm.id ? 'Update Log' : 'Save Internal Log'}</button>
                <button onClick={() => setNewLogOpen(false)} className="px-6 py-2.5 text-xs border border-white/10 text-white/40 hover:text-white/70 transition-colors" >Cancel</button>
              </div>
          </div>}

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Client Updates Feed */}
            <div className="bg-[#0f172a] border border-amber-500/10 p-5">
              <h2 className="text-[#f59e0b] font-semibold mb-5 text-sm tracking-wide" >Recent Client Updates</h2>
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {siteUpdates?.map((upd: any) => (
                  <div key={upd.id} className="bg-[#020617] border border-amber-500/10 p-4">
                    <div className="flex gap-4">
                      {upd.photos && upd.photos.length > 0 ? (
                        <img src={upd.photos[0]} alt={upd.title} className="w-16 h-16 object-cover shrink-0 opacity-80" />
                      ) : (
                        <div className="w-16 h-16 bg-white/5 flex items-center justify-center shrink-0">
                          <Camera size={16} className="text-white/20" />
                        </div>
                      )}
                      <div>
                        <p className="text-white/40 text-[10px] tracking-wider mb-1" >{upd.date} • {upd.phase}</p>
                        <p className="text-white text-sm font-medium mb-1.5" >{upd.title}</p>
                        <p className="text-white/50 text-xs line-clamp-2" >{upd.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
                {(!siteUpdates || siteUpdates.length === 0) && (
                  <p className="text-white/30 text-xs italic">No client updates posted yet.</p>
                )}
              </div>
            </div>

            {/* Internal Logs Feed */}
            <div className="bg-[#0f172a] border border-slate-800 p-5">
              <h2 className="text-white/70 font-semibold mb-5 text-sm tracking-wide" >Internal Site Logs</h2>
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {siteLogs?.map((log: any) => {
                  let parsedPhotos = [];
                  try { parsedPhotos = typeof log.photos === 'string' ? JSON.parse(log.photos || '[]') : log.photos || []; } catch(e) {}
                  return (
                    <div key={log.id} className="group relative bg-[#060c1c]/60 backdrop-blur-md border border-slate-800/60 hover:border-slate-700 p-4 transition-all duration-300 shadow-lg">
                      <div className="absolute inset-0 bg-gradient-to-br from-slate-800/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                      
                      <div className="flex gap-4 relative z-10">
                        {parsedPhotos && parsedPhotos.length > 0 ? (
                          <div className="relative w-20 h-20 shrink-0 rounded overflow-hidden shadow-md">
                            <img src={parsedPhotos[0]} alt="Log cover" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out opacity-90" />
                            {parsedPhotos.length > 1 && (
                              <div className="absolute bottom-1 right-1 bg-black/60 backdrop-blur-sm px-1.5 py-0.5 rounded text-[9px] text-white font-medium">+{parsedPhotos.length - 1}</div>
                            )}
                          </div>
                        ) : (
                          <div className="w-20 h-20 bg-slate-900/50 border border-slate-800/80 rounded flex flex-col items-center justify-center shrink-0 shadow-inner">
                            <FileText size={18} className="text-slate-600 mb-1" />
                            <span className="text-[9px] text-slate-500 uppercase tracking-widest">Log</span>
                          </div>
                        )}
                        
                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                          <div className="flex justify-between items-start mb-1.5">
                            <p className="text-slate-400 text-[10px] uppercase tracking-[0.1em] font-medium" >
                              {log.date}
                              {log.projectId && <span className="ml-2 text-slate-500 capitalize tracking-normal">• {assignedProjects.find(p => p.id === log.projectId)?.name || 'Unknown Project'}</span>}
                            </p>
                            <div className="flex items-center gap-3">
                              <button onClick={() => {
                                setLogForm({ id: log.id, title: log.title, summary: log.summary, crew: log.crew?.toString() || '0', progress: log.progress?.toString() || '0', projectId: log.projectId || '', photos: parsedPhotos });
                                setNewLogOpen(true);
                              }} className="text-slate-500 hover:text-amber-400 transition-colors bg-slate-800/50 p-1.5 rounded-full" title="Edit Log">
                                <FileText size={12} />
                              </button>
                              <div className="flex items-center gap-1.5 bg-slate-900/80 border border-slate-800 px-2 py-0.5 rounded-full shadow-sm">
                                <Users size={10} className="text-slate-400" />
                                <span className="text-slate-300 text-[10px] font-semibold">{log.crew} <span className="text-slate-500 font-normal">crew</span></span>
                              </div>
                            </div>
                          </div>
                          
                          <h3 className="text-slate-100 font-medium text-sm mb-1.5 truncate group-hover:text-blue-400 transition-colors" >{log.title}</h3>
                          
                          <p className="text-slate-400 text-xs leading-relaxed line-clamp-2" >{log.summary}</p>
                        </div>
                      </div>
                      
                      {log.progress > 0 && (
                        <div className="mt-4 flex items-center gap-3 relative z-10">
                          <div className="flex-1 h-1.5 bg-slate-900/80 border border-slate-800 rounded-full overflow-hidden shadow-inner">
                            <div className="h-full bg-gradient-to-r from-blue-600 to-indigo-400 rounded-full shadow-[0_0_8px_rgba(96,165,250,0.4)]" style={{ width: `${log.progress}%` }} />
                          </div>
                          <span className="text-blue-400 text-[10px] font-bold tracking-wider w-8 text-right">{log.progress}%</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>}

      {/* ── TASKS ── */}
      {activeTab === 'tasks' && <div className="bg-[#0f172a] border border-amber-500/10 p-5">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-white font-semibold" >Task List</h2>
            <span className="text-white/30 text-xs" >{doneCount}/{tasks.length} completed</span>
          </div>
          <div className="flex gap-3 mb-5">
            <input value={newTaskForm.text} onChange={e => setNewTaskForm(p => ({ ...p, text: e.target.value }))} onKeyDown={e => e.key === 'Enter' && addTask()} placeholder="Add a new task and press Enter..." className="flex-1 bg-[#020617] border border-slate-800 text-white px-4 py-2.5 text-sm focus:outline-none focus:border-[#f59e0b]/50 placeholder:text-white/20"  />
            <select value={newTaskForm.projectId} onChange={e => setNewTaskForm(p => ({ ...p, projectId: e.target.value }))} className="w-1/4 min-w-[150px] bg-[#020617] border border-slate-800 text-white px-3 py-2.5 text-sm focus:outline-none focus:border-[#f59e0b]/50" >
              <option value="">Select Project</option>
              {assignedProjects.map(proj => <option key={proj.id} value={proj.id}>{proj.name}</option>)}
            </select>
            <button onClick={addTask} className="bg-[#f59e0b] text-[#020617] px-5 py-2.5 text-xs font-semibold hover:bg-[#fbbf24] transition-colors flex items-center gap-2 shadow-sm" >
              <PlusCircle size={13} /><span>Add</span>
            </button>
          </div>
          <div className="space-y-2">
            {tasks.map(t => <div key={t.id} className={`flex items-center gap-3 p-3.5 border transition-colors ${t.done ? 'bg-[#020617]/50 border-white/3' : 'bg-[#020617] border-amber-500/10 hover:border-amber-500/20'}`}>
                <button onClick={() => toggleTask(t.id)} className={`w-5 h-5 border flex items-center justify-center shrink-0 transition-colors ${t.done ? 'bg-[#f59e0b] border-[#f59e0b]' : 'border-white/20 hover:border-[#f59e0b]/50'}`}>
                  {t.done && <Check size={10} className="text-[#020617]" />}
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className={`text-sm ${t.done ? 'text-white/25 line-through' : 'text-white/80'}`} >{t.label}</p>
                    {t.projectId && <span className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-white/50 text-[10px] tracking-normal capitalize">{assignedProjects.find(p => p.id === t.projectId)?.name || 'Unknown'}</span>}
                  </div>
                  <p className="text-white/25 text-xs" >{t.assignee} · Due {t.due}</p>
                </div>
                <button onClick={() => removeTask(t.id)} className="text-white/15 hover:text-red-400 transition-colors p-1 shrink-0">
                  <Trash2 size={13} />
                </button>
              </div>)}
          </div>
        </div>}

      {/* ── ISSUES ── */}
      {activeTab === 'issues' && <div className="space-y-4">
          {newIssueOpen && <div className="bg-[#0f172a] border border-[#f59e0b]/30 p-5">
              <h3 className="text-white font-semibold mb-4" >Log New Issue</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] text-white/40 tracking-[0.1em] uppercase block mb-2" >Issue Title</label>
                  <input value={issueForm.title} onChange={e => setIssueForm(p => ({
              ...p,
              title: e.target.value
            }))} placeholder="Describe the issue briefly..." className="w-full bg-[#020617] border border-slate-800 text-white px-4 py-2.5 text-sm focus:outline-none focus:border-[#f59e0b]/50 placeholder:text-white/20"  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] text-white/40 tracking-[0.1em] uppercase block mb-2" >Priority</label>
                    <select value={issueForm.priority} onChange={e => setIssueForm(p => ({
                ...p,
                priority: e.target.value
              }))} className="w-full bg-[#020617] border border-slate-800 text-white px-4 py-2.5 text-sm focus:outline-none focus:border-[#f59e0b]/50" >
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-white/40 tracking-[0.1em] uppercase block mb-2" >Project</label>
                    <select value={issueForm.projectId} onChange={e => setIssueForm(p => ({
                ...p,
                projectId: e.target.value
              }))} className="w-full bg-[#020617] border border-slate-800 text-white px-4 py-2.5 text-sm focus:outline-none focus:border-[#f59e0b]/50" >
                      <option value="">Select Project</option>
                      {assignedProjects.map(proj => <option key={proj.id} value={proj.id}>{proj.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-white/40 tracking-[0.1em] uppercase block mb-2" >Assignee</label>
                    <input value={issueForm.assignee} onChange={e => setIssueForm(p => ({
                ...p,
                assignee: e.target.value
              }))} placeholder="Team member name" className="w-full bg-[#020617] border border-slate-800 text-white px-4 py-2.5 text-sm focus:outline-none focus:border-[#f59e0b]/50 placeholder:text-white/20"  />
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={submitIssue} className="bg-[#f59e0b] text-[#020617] px-6 py-2.5 text-xs font-semibold hover:bg-[#fbbf24] transition-colors shadow-sm" >Log Issue</button>
                  <button onClick={() => setNewIssueOpen(false)} className="px-6 py-2.5 text-xs border border-amber-500/10 text-white/40 hover:text-white/70 transition-colors" >Cancel</button>
                </div>
              </div>
            </div>}

          <div className="bg-[#0f172a] border border-amber-500/10 p-5">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-white font-semibold" >Issues & Blockers</h2>
              <button onClick={() => setNewIssueOpen(!newIssueOpen)} className="bg-[#f59e0b] text-[#020617] px-4 py-2 text-xs font-semibold flex items-center gap-2 hover:bg-[#fbbf24] transition-colors shadow-sm" >
                <PlusCircle size={13} /><span>Log Issue</span>
              </button>
            </div>
            <div className="space-y-3">
              {issues.map(issue => <div key={issue.id} className={`p-4 border transition-colors ${issue.status === 'resolved' ? 'bg-[#020617]/40 border-white/3 opacity-60' : 'bg-[#020617] border-amber-500/10'}`}>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <span className={`text-[10px] px-2 py-0.5 border shrink-0 font-semibold uppercase mt-0.5 ${priorityColors[issue.priority]}`} >{issue.priority}</span>
                      <div className="min-w-0">
                        <p className="text-white text-sm leading-tight mb-1" >
                          {issue.title}
                          {issue.projectId && <span className="ml-2 px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-white/50 text-[10px] tracking-normal capitalize">{assignedProjects.find(p => p.id === issue.projectId)?.name || 'Unknown Project'}</span>}
                        </p>
                        <p className="text-white/30 text-xs mt-1" >{issue.assignee} · {issue.date}</p>
                      </div>
                    </div>
                    <span className={`text-xs shrink-0 font-medium ${statusColors[issue.status]}`} >{issue.status.replace('-', ' ')}</span>
                  </div>
                  <div className="flex gap-2">
                    {issue.status === 'open' && <button onClick={() => updateIssueStatus(issue.id, 'in-progress')} className="px-3 py-1 text-[10px] border border-yellow-800/30 text-yellow-400 hover:bg-yellow-900/20 transition-colors uppercase tracking-wider" >Mark In Progress</button>}

                    {issue.status === 'in-progress' && <button onClick={() => updateIssueStatus(issue.id, 'resolved')} className="px-3 py-1 text-[10px] border border-emerald-800/30 text-emerald-400 hover:bg-emerald-900/20 transition-colors uppercase tracking-wider" >Mark Resolved</button>}
                    {issue.status === 'resolved' && <button onClick={() => updateIssueStatus(issue.id, 'open')} className="px-3 py-1 text-[10px] border border-white/10 text-white/30 hover:text-white/50 transition-colors uppercase tracking-wider" >Reopen</button>}
                  </div>
                </div>)}
            </div>
          </div>
        </div>}

      {/* ── APPROVALS ── */}
      {activeTab === 'approvals' && <div className="space-y-4">
          {newApprovalOpen && <div className="bg-[#0f172a] border border-[#f59e0b]/30 p-5">
            <h3 className="text-white font-semibold mb-4" >Request Client Approval</h3>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] text-white/40 tracking-[0.1em] uppercase block mb-2" >Request Title</label>
                <input value={approvalForm.title} onChange={e => setApprovalForm(p => ({ ...p, title: e.target.value }))} placeholder="e.g. Master Bedroom Marble" className="w-full bg-[#020617] border border-slate-800 text-white px-4 py-2.5 text-sm focus:outline-none focus:border-[#f59e0b]/50 placeholder:text-white/20"  />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-white/40 tracking-[0.1em] uppercase block mb-2" >Type</label>
                  <select value={approvalForm.type} onChange={e => setApprovalForm(p => ({ ...p, type: e.target.value }))} className="w-full bg-[#020617] border border-slate-800 text-white px-3 py-2.5 text-sm focus:outline-none focus:border-[#f59e0b]/50" >
                    <option value="Material">Material</option>
                    <option value="Drawing">Drawing</option>
                    <option value="Furniture">Furniture</option>
                    <option value="Budget">Budget</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-white/40 tracking-[0.1em] uppercase block mb-2" >Due Date</label>
                  <input type="date" value={approvalForm.due} onChange={e => setApprovalForm(p => ({ ...p, due: e.target.value }))} onClick={(e) => { try { (e.target as HTMLInputElement).showPicker(); } catch(err){} }} className="w-full bg-[#020617] border border-slate-800 text-white px-3 py-2.5 text-sm focus:outline-none focus:border-[#f59e0b]/50 placeholder:text-white/20 [color-scheme:dark]"  />
                </div>
              </div>
              <div>
                  <label className="text-[10px] text-white/40 tracking-[0.1em] uppercase block mb-2" >Project</label>
                  <select value={approvalForm.projectId} onChange={e => setApprovalForm(p => ({ ...p, projectId: e.target.value }))} className="w-full bg-[#020617] border border-slate-800 text-white px-3 py-2.5 text-sm focus:outline-none focus:border-[#f59e0b]/50" >
                    <option value="">Select Project</option>
                    {assignedProjects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
              </div>
              <div>
                <label className="text-[10px] text-white/40 tracking-[0.1em] uppercase block mb-2" >Details/Notes</label>
                <textarea value={approvalForm.description} onChange={e => setApprovalForm(p => ({ ...p, description: e.target.value }))} rows={2} className="w-full bg-[#020617] border border-slate-800 text-white px-4 py-3 text-sm focus:outline-none focus:border-[#f59e0b]/50 resize-none"  />
              </div>
              <div className="mb-6">
                <label className="text-[10px] text-white/40 tracking-[0.1em] uppercase block mb-2" >Attachment (Optional)</label>
                <div className="border border-dashed border-white/20 bg-[#020617] p-6 text-center hover:border-white/40 transition-colors cursor-pointer group" onClick={() => {
                  setApprovalForm(p => ({ ...p, imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80' }));
                  toast.success('Mock photo selected');
                }}>
                  <Image size={24} className="text-white/20 mx-auto mb-2 group-hover:text-white/40 transition-colors" />
                  <p className="text-white/40 text-xs" >Click to upload attachment</p>
                </div>
                {approvalForm.imageUrl && (
                  <div className="flex gap-3 mt-3 overflow-x-auto pb-2">
                    <div className="relative w-20 h-20 shrink-0 group">
                      <img src={approvalForm.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                      <button onClick={() => setApprovalForm(p => ({ ...p, imageUrl: '' }))} className="absolute top-1 right-1 bg-red-500/80 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        <X size={10} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button onClick={() => setNewApprovalOpen(false)} className="px-6 py-2.5 text-xs border border-amber-500/10 text-white/40 hover:text-white/70 transition-colors" >Cancel</button>
                <button onClick={addApproval} className="bg-[#f59e0b] text-[#020617] px-6 py-2.5 text-xs font-semibold hover:bg-[#fbbf24] transition-colors shadow-sm" >Send Request</button>
              </div>
            </div>
          </div>}

          <div className="bg-[#0f172a] border border-amber-500/10 p-5">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-white font-semibold" >Client Approvals — Pending</h2>
              <button onClick={() => setNewApprovalOpen(!newApprovalOpen)} className="bg-[#f59e0b] text-[#020617] px-4 py-2 text-xs font-semibold flex items-center gap-2 hover:bg-[#fbbf24] transition-colors shadow-sm" >
                <PlusCircle size={13} /><span>Request Approval</span>
              </button>
            </div>
          <div className="space-y-3">
            {pendingApprovals.map(a => <div key={a.id} className="flex items-center gap-4 p-4 bg-[#020617] border border-amber-500/10">
                {a.imageUrl && <img src={a.imageUrl} alt={a.title} className="w-14 h-14 object-cover shrink-0 opacity-70" />}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-white text-sm font-medium" >{a.title}</p>
                    {a.projectId && <span className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-white/50 text-[10px] tracking-normal capitalize">{assignedProjects.find(p => p.id === a.projectId)?.name || (a.projectId === 'prj-1' ? assignedProjects[0]?.name : assignedProjects[1]?.name) || 'Unknown Project'}</span>}
                  </div>
                  <p className="text-white/30 text-xs mt-0.5" >{a.type} · <span className="text-[#f59e0b]/80">{formatIndianDate(a.due)}</span></p>
                  <p className="text-white/40 text-xs mt-1 line-clamp-1" >{a.description}</p>
                </div>
                <div className="shrink-0">
                  <span className="text-[10px] text-yellow-400 bg-yellow-900/20 border border-yellow-800/20 px-2.5 py-1 uppercase tracking-wider" >Awaiting Client</span>
                </div>
              </div>)}
            {pendingApprovals.length === 0 && <div className="text-center py-10">
                <CheckCircle2 size={28} className="text-emerald-400/40 mx-auto mb-2" />
                <p className="text-white/30 text-sm" >No pending approvals from clients</p>
              </div>}
          </div>
        </div>
      </div>}

      {/* ── UPLOAD ── */}
      {activeTab === 'upload' && <div className="space-y-4">
          <input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleFileSelect} />
          <div className="bg-[#0f172a] border border-amber-500/10 p-6">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-white font-semibold" >Upload Site Files</h2>
              <select value={selectedUploadProject} onChange={e => setSelectedUploadProject(e.target.value)} className="bg-[#020617] border border-slate-800 text-white px-3 py-1.5 text-sm focus:outline-none focus:border-[#f59e0b]/40 transition-colors" >
                <option value="">Select Project</option>
                {assignedProjects.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            {!selectedUploadProject ? (
              <div className="w-full border-2 border-dashed border-red-500/20 bg-red-900/10 p-14 flex flex-col items-center gap-3">
                <AlertCircle size={32} className="text-red-400/50" />
                <div className="text-center">
                  <p className="text-red-400 font-medium mb-1" >Select a Project First</p>
                  <p className="text-red-400/60 text-sm" >You must choose a project from the dropdown above before uploading files.</p>
                </div>
              </div>
            ) : (
              <button onClick={() => fileInputRef.current?.click()} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} className={`w-full border-2 border-dashed p-14 flex flex-col items-center gap-3 group transition-colors ${isDragging ? 'border-[#f59e0b] bg-[#f59e0b]/5' : 'border-amber-500/10 hover:border-[#f59e0b]/30'}`}>
                <Upload size={32} className="text-white/20 group-hover:text-[#f59e0b]/50 transition-colors" />
                <div className="text-center">
                  <p className="text-white font-medium mb-1" >Drop files here or click to browse</p>
                  <p className="text-white/40 text-sm" >Photos, PDFs, DWG, ZIP — all file types accepted</p>
                </div>
                <span className="bg-[#f59e0b] text-[#020617] px-7 py-2.5 text-xs font-semibold hover:bg-[#fbbf24] transition-colors shadow-sm" >Browse Files</span>
              </button>
            )}

            {uploadedFiles.length > 0 && <div className="mt-5">
                <h3 className="text-white/50 text-xs tracking-[0.1em] uppercase mb-3" >Queued for Upload ({uploadedFiles.length})</h3>
                <div className="space-y-2">
                  {uploadedFiles.map((file, i) => <div key={`uploaded-${i}`} className="flex items-center justify-between p-3 bg-[#020617] border border-amber-500/10">
                      <div className="flex items-center gap-3">
                        <Image size={14} className="text-[#f59e0b]" />
                        <p className="text-white text-sm" >{file.name}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-20 h-1 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-[#f59e0b] rounded-full transition-all duration-300" style={{
                            width: isUploading ? `${uploadProgress}%` : '0%'
                          }} />
                        </div>
                        {!isUploading && (
                          <button onClick={() => setUploadedFiles(prev => prev.filter((_, idx) => idx !== i))} className="text-white/20 hover:text-red-400 transition-colors"><X size={13} /></button>
                        )}
                      </div>
                    </div>)}
                </div>
                <button onClick={handleUploadSubmit} disabled={!selectedUploadProject || isUploading} className={`mt-4 px-7 py-2.5 text-xs font-semibold flex items-center gap-2 shadow-sm transition-colors ${(!selectedUploadProject || isUploading) ? 'bg-red-900/20 text-red-400 border border-red-800/30 cursor-not-allowed' : 'bg-[#f59e0b] text-[#020617] hover:bg-[#fbbf24]'}`} >
                  {isUploading ? (
                    <><RefreshCw size={13} className="animate-spin" /><span>Uploading... {uploadProgress}%</span></>
                  ) : selectedUploadProject ? (
                    <><Upload size={13} /><span>Upload {uploadedFiles.length} File{uploadedFiles.length > 1 ? 's' : ''} to Client Portal</span></>
                  ) : (
                    <><AlertCircle size={13} /><span>Select a Project First</span></>
                  )}
                </button>
              </div>}
          </div>

          {/* Uploaded Documents History */}
          <div className="bg-[#0f172a] border border-amber-500/10 p-6">
            <h2 className="text-white font-semibold mb-5" >Uploaded Documents History</h2>
            {documents && documents.filter((d: any) => selectedUploadProject ? d.projectId === selectedUploadProject : assignedProjects.some(p => p.id === d.projectId)).length > 0 ? (
              <div className="space-y-3">
                {documents
                  .filter((d: any) => selectedUploadProject ? d.projectId === selectedUploadProject : assignedProjects.some(p => p.id === d.projectId))
                  .map((doc: any, i: number) => (
                  <div key={`history-${i}`} className={`flex items-center justify-between p-4 bg-[#020617] border border-amber-500/10 hover:border-[#f59e0b]/30 transition-colors group ${doc.status === 'pending_deletion' ? 'opacity-50 pointer-events-none' : ''}`}>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-[#0f172a] border border-amber-500/10 flex items-center justify-center shrink-0">
                        <FileText size={16} className="text-[#f59e0b]" />
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium" >{doc.name}</p>
                        <p className="text-white/40 text-xs mt-1" >
                          {doc.size} • Uploaded on {doc.date}
                          {!selectedUploadProject && doc.projectId && ` • ${projects.find((p: any) => p.id === doc.projectId)?.name || 'Unknown Project'}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-1 bg-[#1e293b] text-white/60 text-[10px] uppercase tracking-wider rounded">{doc.type}</span>
                      <button onClick={() => toast.success(`Downloading ${doc.name}...`)} className="w-8 h-8 flex items-center justify-center bg-[#020617] border border-amber-500/10 text-white/40 hover:text-[#f59e0b] hover:border-[#f59e0b]/30 transition-colors" title="Download">
                        <Download size={14} />
                      </button>
                      {doc.status === 'pending_deletion' ? (
                        <span className="px-2.5 py-1 bg-red-900/30 text-red-400 border border-red-800/30 text-[10px] uppercase tracking-wider rounded">Pending Admin Approval</span>
                      ) : (
                        <button onClick={() => updateDocument && updateDocument(doc.id, { status: 'pending_deletion' })} className="w-8 h-8 flex items-center justify-center bg-[#020617] border border-amber-500/10 text-white/40 hover:text-red-400 hover:border-red-400/30 transition-colors group-hover:bg-[#0f172a]" title="Soft Delete">
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border border-dashed border-amber-500/10 bg-[#020617]/50">
                <FileText size={24} className="text-white/10 mx-auto mb-3" />
                <p className="text-white/40 text-sm" >
                  {selectedUploadProject ? 'No documents have been uploaded for this project yet.' : 'No documents have been uploaded yet.'}
                </p>
              </div>
            )}
          </div>
        </div>}
        
      {/* ─────────────────── MESSAGES ─────────────────── */}
      {activeTab === 'messages' && (
        <div className="flex flex-col h-full min-h-[500px]" style={{ height: 'calc(100vh - 120px)' }}>
          <MessageHub 
            currentUser={currentUser} 
            allUsers={users || []}
          />
        </div>
      )}
      {activeTab === 'profile-settings' && <ProfileSettings userName="Suresh Menon" />}
      {activeTab === 'security-details' && <SecurityDetails />}
      {activeTab === 'help-support' && <HelpSupport />}

    </HubShell>;
};

/* ─────────────────── ADMIN DASHBOARD ─────────────────── */

export const HubAdminPage: React.FC<HubPageProps> = ({
  onNavigate
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const userStr = localStorage.getItem('aura_user');
  const currentUser = userStr ? JSON.parse(userStr) : { id: 'admin-1', role: 'admin', name: 'Admin User' };

  useEffect(() => {
    if (currentUser && currentUser.role !== 'admin') {
      onNavigate((currentUser.role === 'customer' || currentUser.role === 'client') ? 'hub-customer' : 'hub-manager');
    }
  }, [currentUser, onNavigate]);

  const { data: users, refetch: refetchUsers } = useApiData('users');
  const { data: documents, setData: setDocuments, updateItem: updateDocument, deleteItem: deleteDocument } = useApiData('documents');
  const { data: projects, setData: setProjects } = useApiData('projects');
  const { data: invoices, createItem: createInvoice } = useApiData('invoices');
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(initialAdminUsers);

  useEffect(() => {
    if (users && users.length > 0) {
      setAdminUsers(users.map((u: any) => ({
        id: u.id,
        name: u.name,
        role: u.role === 'client' ? 'Client' : u.role === 'manager' ? 'Project Manager' : 'Admin',
        email: u.email,
        phone: 'N/A',
        status: 'active',
        joined: 'Recent',
        projects: 0
      })));
    }
  }, [users]);
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('all');
  const [projectSearch, setProjectSearch] = useState('');
  const [projectFilter, setProjectFilter] = useState<'all' | 'green' | 'amber' | 'red'>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteForm, setInviteForm] = useState({
    name: '',
    email: '',
    role: 'Client',
    phone: ''
  });
  const [settingsForm, setSettingsForm] = useState({
    studioName: 'Aura : A Design Studio Workspace',
    email: 'hello@auradesign.studio',
    phone: '+91 22 4891 0000',
    address: '12A Mahalaxmi Industrial Estate, Mumbai 400 011'
  });
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [newProjectOpen, setNewProjectOpen] = useState(false);
  const [newProjectForm, setNewProjectForm] = useState({
    name: '',
    clientId: '',
    budget: '',
    managerId: '',
    endDate: ''
  });
  const activeProjectsCount = projects.length;
  const totalClientsCount = adminUsers.filter(u => u.role === 'Client').length;
  const pendingCount = initialApprovals.filter(a => a.status === 'pending').length;
  const openIssuesCount = initialIssues.filter(i => i.status === 'open').length;
  const filteredProjects = projects.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(projectSearch.toLowerCase()) || p.client.toLowerCase().includes(projectSearch.toLowerCase());
    const matchFilter = projectFilter === 'all' || p.health === projectFilter;
    return matchSearch && matchFilter;
  });
  const filteredUsers = adminUsers.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase());
    const matchRole = userRoleFilter === 'all' || u.role === userRoleFilter;
    return matchSearch && matchRole;
  });
  const userRoles = ['all', ...Array.from(new Set(adminUsers.map(u => u.role)))];
  const toggleUserStatus = (id: string) => {
    setAdminUsers(prev => prev.map(u => u.id === id ? {
      ...u,
      status: u.status === 'active' ? 'inactive' : 'active'
    } : u));
  };
  const removeUser = (id: string) => {
    setAdminUsers(prev => prev.filter(u => u.id !== id));
    setSelectedUser(null);
  };
  const submitInvite = async () => {
    if (!inviteForm.name.trim() || !inviteForm.email.trim()) return;
    
    try {
      const res = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: inviteForm.name,
          email: inviteForm.email,
          role: inviteForm.role === 'Client' ? 'client' : 'manager',
          password: 'Aura@123'
        })
      });
      
      if (res.ok) {
        if (refetchUsers) await refetchUsers();
        setInviteForm({ name: '', email: '', role: 'Client', phone: '' });
        setInviteOpen(false);
      } else {
        console.error('Failed to register user');
      }
    } catch (err) {
      console.error(err);
    }
  };
  const addProject = () => {
    if (!newProjectForm.name.trim() || !newProjectForm.clientId || !newProjectForm.managerId) return;
    
    const clientUser = adminUsers.find(u => u.id === newProjectForm.clientId);
    const managerUser = adminUsers.find(u => u.id === newProjectForm.managerId);
    
    const proj: Project = {
      id: `p-${Date.now()}`,
      name: newProjectForm.name,
      client: clientUser?.name || 'Unknown Client',
      clientId: newProjectForm.clientId,
      phase: 'Discovery',
      health: 'green',
      budget: newProjectForm.budget || '—',
      completion: 0,
      startDate: new Date().toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }),
      endDate: newProjectForm.endDate || '—',
      manager: managerUser?.name || 'Unknown Manager',
      managerId: newProjectForm.managerId
    };
    setProjects(prev => [...prev, proj]);
    setNewProjectForm({
      name: '',
      clientId: '',
      budget: '',
      managerId: '',
      endDate: ''
    });
    setNewProjectOpen(false);
  };
  const updateProjectHealth = (id: string, health: Project['health']) => {
    setProjects(prev => prev.map(p => p.id === id ? {
      ...p,
      health
    } : p));
  };
  const saveSettings = () => {
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2500);
  };
  const healthColors: Record<string, string> = {
    green: 'bg-emerald-400',
    amber: 'bg-yellow-400',
    red: 'bg-red-400'
  };
  const healthLabels: Record<string, string> = {
    green: 'On Track',
    amber: 'At Risk',
    red: 'Off Track'
  };
  const statusColors: Record<string, string> = {
    active: 'text-emerald-400',
    inactive: 'text-white/30',
    pending: 'text-yellow-400'
  };
  const auditTypeIcons: Record<string, React.ElementType> = {
    approval: CheckCircle2,
    upload: Upload,
    user: UserPlus,
    project: FileText,
    message: MessageSquare
  };
  return <HubShell role="admin" onNavigate={onNavigate} activeTab={activeTab} onTabChange={setActiveTab} notifCount={openIssuesCount} userName="Admin" userInitials="AD">

      {/* ── DASHBOARD OVERVIEW ── */}
      {activeTab === 'overview' && <div className="space-y-5">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[{
          label: 'Active Projects',
          value: activeProjectsCount,
          icon: FileText,
          color: 'text-[#f59e0b]',
          sub: `${projects.filter(p => p.health === 'green').length} on track`
        }, {
          label: 'Total Clients',
          value: totalClientsCount,
          icon: Users,
          color: 'text-blue-400',
          sub: `${adminUsers.filter(u => u.status === 'pending').length} pending`
        }, {
          label: 'Pending Approvals',
          value: pendingCount,
          icon: CheckCircle2,
          color: 'text-emerald-400',
          sub: 'across all projects'
        }, {
          label: 'Open Issues',
          value: openIssuesCount,
          icon: AlertCircle,
          color: 'text-red-400',
          sub: `${initialIssues.filter(i => i.status === 'in-progress').length} in progress`
        }].map(({
          label,
          value,
          icon: Icon,
          color,
          sub
        }) => <div key={label} className="bg-[#0f172a] border border-amber-500/10 p-5">
                <Icon size={18} className={color} />
                <p className="text-white text-3xl font-light" >{value}</p>
                <p className="text-white/40 text-xs mt-0.5" >{label}</p>
                <p className="text-white/20 text-[10px] mt-0.5" >{sub}</p>
              </div>)}
          </div>

          <div className="grid lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 bg-[#0f172a] border border-amber-500/10 p-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-white font-semibold" >Active Projects</h3>
                <button onClick={() => setActiveTab('projects')} className="text-[#f59e0b] text-[10px] uppercase tracking-wider hover:text-[#fbbf24] transition-colors" >View All</button>
              </div>
              <div className="space-y-2">
                {projects.map(p => <div key={p.id} className="flex items-center justify-between p-3 bg-[#020617] border border-amber-500/10 hover:border-amber-500/20 transition-colors cursor-pointer" onClick={() => {
              setSelectedProject(p);
              setActiveTab('projects');
            }}>
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full shrink-0 ${healthColors[p.health]}`} />
                      <div>
                        <p className="text-white text-sm font-medium" >{p.name}</p>
                        <p className="text-white/30 text-xs" >{[
                    (adminUsers.find(u => u.id === p.clientId)?.name || p.client) ? `Client: ${adminUsers.find(u => u.id === p.clientId)?.name || p.client}` : null,
                    (adminUsers.find(u => u.id === p.managerId)?.name || p.manager) ? `Lead: ${adminUsers.find(u => u.id === p.managerId)?.name || p.manager}` : null
                  ].filter(Boolean).join(' · ')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-right">
                      <div>
                        <p className="text-white/50 text-xs" >{p.phase}</p>
                        <p className="text-[#f59e0b] text-xs">{p.completion}%</p>
                      </div>
                      <ChevronRight size={13} className="text-white/20" />
                    </div>
                  </div>)}
              </div>
            </div>

            <div className="bg-[#0f172a] border border-amber-500/10 p-5">
              <h3 className="text-white font-semibold mb-4" >Recent Activity</h3>
              <div className="space-y-3">
                {auditEvents.map(ev => {
              const Icon = auditTypeIcons[ev.type] ?? Activity;
              return <div key={ev.id} className="flex gap-3 items-start">
                      <div className="w-7 h-7 bg-[#020617] border border-amber-500/10 flex items-center justify-center shrink-0">
                        <Icon size={12} className="text-[#f59e0b]" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-white/70 text-xs leading-relaxed" >{ev.action}</p>
                        <p className="text-white/25 text-[10px] mt-0.5" >{ev.user} · {ev.time}</p>
                      </div>
                    </div>;
            })}
              </div>
            </div>
          </div>

          {/* Pending Document Deletions Queue */}
          {(documents || []).filter((d: any) => d.status === 'pending_deletion').length > 0 && (
            <div className="bg-red-900/10 border border-red-500/20 p-5 mt-5">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle size={16} className="text-red-400" />
                <h3 className="text-red-400 font-semibold">Pending Document Deletions</h3>
              </div>
              <div className="space-y-2">
                {(documents || []).filter((d: any) => d.status === 'pending_deletion').map((doc: any) => (
                  <div key={doc.id} className="flex items-center justify-between p-3 bg-[#020617] border border-red-500/10 hover:border-red-500/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <FileText size={14} className="text-red-400/50" />
                      <div>
                        <p className="text-white text-sm font-medium">{doc.name}</p>
                        <p className="text-white/40 text-xs">
                          {doc.size} • Uploaded by {doc.uploadedBy || 'PM'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateDocument && updateDocument(doc.id, { status: 'active' })} className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white/70 text-[10px] uppercase tracking-wider rounded transition-colors">
                        Restore
                      </button>
                      <button onClick={() => deleteDocument && deleteDocument(doc.id)} className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 text-[10px] uppercase tracking-wider rounded transition-colors flex items-center gap-1">
                        <Check size={12} /> Confirm Hard Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick stats strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[{
          label: 'Total Studio Revenue',
          value: '₹13.2 Cr',
          note: 'Active projects'
        }, {
          label: 'Avg Project Duration',
          value: '8.4 mo',
          note: 'Across all types'
        }, {
          label: 'Approval Response Time',
          value: '1.4 days',
          note: 'Client avg'
        }, {
          label: 'Client Satisfaction',
          value: '4.9 / 5',
          note: '320 reviews'
        }].map(s => <div key={s.label} className="bg-[#0f172a] border border-amber-500/10 p-4">
                <p className="text-white text-xl font-light" >{s.value}</p>
                <p className="text-white/40 text-xs mt-0.5" >{s.label}</p>
                <p className="text-white/20 text-[10px] mt-0.5" >{s.note}</p>
              </div>)}
          </div>
        </div>}

      {/* ── PROJECTS ── */}
      {activeTab === 'projects' && <div className="space-y-4">
          {selectedProject && <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
              <div className="bg-[#0f172a] border border-amber-500/10 w-full max-w-xl">
                <div className="flex justify-between items-center p-5 border-b border-amber-500/10">
                  <div>
                    <p className="text-[#f59e0b] text-[10px] tracking-[0.15em] uppercase mb-0.5" >{selectedProject.phase}</p>
                    <h3 className="text-white font-semibold" >{selectedProject.name}</h3>
                  </div>
                  <button onClick={() => setSelectedProject(null)} className="text-white/30 hover:text-white/60"><X size={18} /></button>
                </div>
                <div className="p-5 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {[{
                label: 'Client',
                value: adminUsers.find(u => u.id === selectedProject.clientId)?.name || selectedProject.client
              }, {
                label: 'Lead Designer',
                value: adminUsers.find(u => u.id === selectedProject.managerId)?.name || selectedProject.manager
              }, {
                label: 'Budget',
                value: selectedProject.budget
              }, {
                label: 'Completion',
                value: `${selectedProject.completion}%`
              }, {
                label: 'Start Date',
                value: selectedProject.startDate
              }, {
                label: 'End Date',
                value: selectedProject.endDate
              }].map(item => <div key={item.label}>
                        <p className="text-[10px] text-white/30 tracking-[0.1em] uppercase mb-0.5" >{item.label}</p>
                        <p className="text-white text-sm" >{item.value}</p>
                      </div>)}
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-white/40" >Progress</span>
                      <span className="text-[#f59e0b]">{selectedProject.completion}%</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-[#f59e0b] rounded-full" style={{
                  width: `${selectedProject.completion}%`
                }} />
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] text-white/30 tracking-[0.1em] uppercase mb-2" >Health Status</p>
                    <div className="flex gap-2">
                      {(['green', 'amber', 'red'] as const).map(h => <button key={h} onClick={() => {
                  updateProjectHealth(selectedProject.id, h);
                  setSelectedProject(p => p ? {
                    ...p,
                    health: h
                  } : null);
                }} className={`flex-1 py-2 text-xs border transition-colors flex items-center justify-center gap-2 ${selectedProject.health === h ? 'border-[#f59e0b]/40 bg-[#f59e0b]/10' : 'border-amber-500/10 hover:border-amber-500/25'}`}>
                          <div className={`w-2 h-2 rounded-full ${healthColors[h]}`} />
                          <span className="text-white/60" >{healthLabels[h]}</span>
                        </button>)}
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-amber-500/10">
                    <p className="text-[10px] text-white/30 tracking-[0.1em] uppercase mb-3" >Project Documents</p>
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                      {documents.filter(doc => doc.projectId === selectedProject.id).length > 0 ? documents.filter(doc => doc.projectId === selectedProject.id).map(doc => (
                        <div key={doc.id} className="flex items-center justify-between p-3 bg-[#020617] border border-amber-500/10 hover:border-amber-500/20 transition-colors group">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-[#f59e0b]/10 flex items-center justify-center shrink-0">
                              <FileText size={14} className="text-[#f59e0b]" />
                            </div>
                            <div>
                              <p className="text-white text-xs" >{doc.name}</p>
                              <p className="text-white/30 text-[10px] mt-0.5" >{doc.type} • {doc.size} • Added {doc.date}</p>
                            </div>
                          </div>
                          <button onClick={() => toast.success('Downloading...')} className="text-white/25 hover:text-[#f59e0b] transition-colors opacity-0 group-hover:opacity-100">
                            <Download size={14} />
                          </button>
                        </div>
                      )) : (
                        <div className="text-center py-6 border border-dashed border-amber-500/10">
                          <FileText size={20} className="text-white/10 mx-auto mb-2" />
                          <p className="text-white/30 text-xs" >No documents uploaded yet</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>}

          {newProjectOpen && <div className="bg-[#0f172a] border border-[#f59e0b]/30 p-5">
              <h3 className="text-white font-semibold mb-4" >Create New Project</h3>
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-[10px] text-white/35 tracking-[0.12em] uppercase block mb-2" >Project Name</label>
                  <input value={newProjectForm.name} onChange={e => setNewProjectForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. The Jade Villa" className="w-full bg-[#020617] border border-slate-800 text-white px-4 py-2.5 text-sm focus:outline-none focus:border-[#f59e0b]/40 transition-colors placeholder:text-white/20"  />
                </div>
                <div>
                  <label className="text-[10px] text-white/35 tracking-[0.12em] uppercase block mb-2" >Assign Client</label>
                  <select value={newProjectForm.clientId} onChange={e => setNewProjectForm(p => ({ ...p, clientId: e.target.value }))} className="w-full bg-[#020617] border border-slate-800 text-white px-4 py-2.5 text-sm focus:outline-none focus:border-[#f59e0b]/40 transition-colors" >
                    <option value="">Select a Client</option>
                    {adminUsers.filter(u => u.role === 'Client').map(u => (
                      <option key={u.id} value={u.id}>{u.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-white/35 tracking-[0.12em] uppercase block mb-2" >Assign Project Manager</label>
                  <select value={newProjectForm.managerId} onChange={e => setNewProjectForm(p => ({ ...p, managerId: e.target.value }))} className="w-full bg-[#020617] border border-slate-800 text-white px-4 py-2.5 text-sm focus:outline-none focus:border-[#f59e0b]/40 transition-colors" >
                    <option value="">Select a Project Manager</option>
                    {adminUsers.filter(u => u.role === 'Project Manager').map(u => (
                      <option key={u.id} value={u.id}>{u.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-[10px] text-white/35 tracking-[0.12em] uppercase" >Budget</label>
                    <span className="text-xs text-[#f59e0b] font-medium" >
                      {newProjectForm.budget || '₹10,00,000'}
                    </span>
                  </div>
                  <input type="range" min="100000" max="50000000" step="100000" value={parseInt((newProjectForm.budget || '').replace(/\D/g, '')) || 1000000} onChange={e => setNewProjectForm(p => ({ ...p, budget: new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(parseInt(e.target.value)) }))} className="w-full accent-[#f59e0b] h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer mt-2 mb-3" />
                </div>
                <div>
                  <label className="text-[10px] text-white/35 tracking-[0.12em] uppercase block mb-2" >Expected End Date</label>
                  <input type="date" value={newProjectForm.endDate} onChange={e => setNewProjectForm(p => ({ ...p, endDate: e.target.value }))} onClick={(e) => { try { (e.target as HTMLInputElement).showPicker(); } catch(err){} }} className="w-full bg-[#020617] border border-slate-800 text-white px-4 py-2.5 text-sm focus:outline-none focus:border-[#f59e0b]/40 transition-colors placeholder:text-white/20 [color-scheme:dark]"  />
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={addProject} className="bg-[#f59e0b] text-[#020617] px-6 py-2.5 text-xs font-semibold hover:bg-[#fbbf24] transition-colors shadow-sm" >Create Project</button>
                <button onClick={() => setNewProjectOpen(false)} className="px-6 py-2.5 text-xs border border-slate-800 text-white/40 hover:text-white/70 transition-colors" >Cancel</button>
              </div>
            </div>}

          <div className="bg-[#0f172a] border border-amber-500/10 p-5">
            <div className="flex flex-wrap gap-3 justify-between items-center mb-5">
              <h2 className="text-white font-semibold" >All Projects</h2>
              <div className="flex gap-2 flex-wrap">
                <div className="flex items-center gap-2 bg-[#020617] border border-amber-500/10 px-3 py-2">
                  <Search size={12} className="text-white/30" />
                  <input value={projectSearch} onChange={e => setProjectSearch(e.target.value)} placeholder="Search..." className="bg-transparent text-white text-xs w-28 focus:outline-none placeholder:text-white/20"  />
                </div>
                {(['all', 'green', 'amber', 'red'] as const).map(f => <button key={f} onClick={() => setProjectFilter(f)} className={`px-3 py-2 text-[10px] uppercase border transition-colors ${projectFilter === f ? 'bg-[#f59e0b] border-[#f59e0b] text-[#020617] font-bold' : 'border-amber-500/10 text-white/30 hover:border-amber-500/25'}`} >
                    {f === 'all' ? 'All' : healthLabels[f]}
                  </button>)}
                <button onClick={() => setNewProjectOpen(!newProjectOpen)} className="bg-[#f59e0b] text-[#020617] px-4 py-2 text-xs font-semibold flex items-center gap-2 hover:bg-[#fbbf24] transition-colors shadow-sm" >
                  <PlusCircle size={13} /><span>New</span>
                </button>
              </div>
            </div>
            <div className="space-y-2">
              {filteredProjects.map(p => <div key={p.id} onClick={() => setSelectedProject(p)} className="flex items-center justify-between p-4 bg-[#020617] border border-amber-500/10 hover:border-[#f59e0b]/20 cursor-pointer transition-colors group">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${healthColors[p.health]}`} />
                    <div className="min-w-0">
                      <p className="text-white font-medium text-sm" >{p.name}</p>
                      <p className="text-white/30 text-xs" >{[
                  (adminUsers.find(u => u.id === p.clientId)?.name || p.client) ? `Client: ${adminUsers.find(u => u.id === p.clientId)?.name || p.client}` : null,
                  (adminUsers.find(u => u.id === p.managerId)?.name || p.manager) ? `Lead: ${adminUsers.find(u => u.id === p.managerId)?.name || p.manager}` : null
                ].filter(Boolean).join(' · ')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-5 shrink-0">
                    <div className="text-right hidden sm:block">
                      <p className="text-white/50 text-xs" >{p.phase}</p>
                      <p className="text-[#f59e0b] text-xs">{p.budget}</p>
                    </div>
                    <div className="text-right hidden md:block">
                      <p className="text-white/50 text-xs">{p.completion}%</p>
                      <div className="w-16 h-1 bg-white/5 rounded-full mt-1 overflow-hidden">
                        <div className="h-full bg-[#f59e0b]/60 rounded-full" style={{
                    width: `${p.completion}%`
                  }} />
                      </div>
                    </div>
                    <ChevronRight size={14} className="text-white/20 group-hover:text-[#f59e0b] transition-colors" />
                  </div>
                </div>)}
              {filteredProjects.length === 0 && <div className="text-center py-10">
                  <p className="text-white/30 text-sm" >No projects match your search</p>
                </div>}
            </div>
          </div>
        </div>}

      {/* ── USERS ── */}
      {activeTab === 'users' && <div className="space-y-4">
          {selectedUser && <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
              <div className="bg-[#0f172a] border border-amber-500/10 w-full max-w-md">
                <div className="flex justify-between items-center p-5 border-b border-amber-500/10">
                  <h3 className="text-white font-semibold" >User Profile</h3>
                  <button onClick={() => setSelectedUser(null)} className="text-white/30 hover:text-white/60"><X size={18} /></button>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-14 h-14 bg-[#f59e0b]/15 rounded-full flex items-center justify-center text-[#f59e0b] text-lg font-semibold">
                      {selectedUser.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-white font-semibold" >{selectedUser.name}</p>
                      <p className="text-white/40 text-sm" >{selectedUser.role}</p>
                      <span className={`text-[10px] font-semibold uppercase ${statusColors[selectedUser.status]}`} >{selectedUser.status}</span>
                    </div>
                  </div>
                  <div className="space-y-3 mb-5">
                    {[{
                icon: Mail,
                label: selectedUser.email
              }, {
                icon: Phone,
                label: selectedUser.phone
              }, {
                icon: Calendar,
                label: `Joined ${selectedUser.joined}`
              }, {
                icon: FileText,
                label: `${selectedUser.projects} project${selectedUser.projects !== 1 ? 's' : ''}`
              }].map(item => <div key={item.label} className="flex items-center gap-3">
                        <item.icon size={13} className="text-[#f59e0b] shrink-0" />
                        <p className="text-white/60 text-sm" >{item.label}</p>
                      </div>)}
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => toggleUserStatus(selectedUser.id)} className="flex-1 py-2.5 border border-amber-500/10 text-white/50 text-xs hover:border-amber-500/30 hover:text-white/80 transition-colors" >
                      {selectedUser.status === 'active' ? 'Deactivate' : 'Activate'}
                    </button>
                    <button onClick={() => removeUser(selectedUser.id)} className="flex-1 py-2.5 bg-red-900/20 border border-red-800/30 text-red-400 text-xs hover:bg-red-900/30 transition-colors" >
                      Remove User
                    </button>
                  </div>
                </div>
              </div>
            </div>}

          {inviteOpen && <div className="bg-[#0f172a] border border-[#f59e0b]/30 p-5">
              <h3 className="text-white font-semibold mb-4" >Invite New User</h3>
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                {[{
            key: 'name',
            label: 'Full Name',
            placeholder: 'e.g. Ravi Kumar',
            type: 'text'
          }, {
            key: 'email',
            label: 'Email Address',
            placeholder: 'ravi@email.com',
            type: 'email'
          }, {
            key: 'phone',
            label: 'Phone',
            placeholder: '+91 00000 00000',
            type: 'tel'
          }].map(field => <div key={field.key}>
                    <label className="text-[10px] text-white/35 tracking-[0.12em] uppercase block mb-2" >{field.label}</label>
                    <input type={field.type} value={(inviteForm as Record<string, string>)[field.key]} onChange={e => setInviteForm(p => ({
              ...p,
              [field.key]: e.target.value
            }))} placeholder={field.placeholder} className="w-full bg-[#020617] border border-slate-800 text-white px-4 py-2.5 text-sm focus:outline-none focus:border-[#f59e0b]/40 transition-colors placeholder:text-white/20"  />
                  </div>)}
                <div>
                  <label className="text-[10px] text-white/35 tracking-[0.12em] uppercase block mb-2" >Role</label>
                  <select value={inviteForm.role} onChange={e => setInviteForm(p => ({
              ...p,
              role: e.target.value
            }))} className="w-full bg-[#020617] border border-slate-800 text-white px-4 py-2.5 text-sm focus:outline-none focus:border-[#f59e0b]/40 transition-colors" >
                    {['Client', 'Designer', 'Project Manager', 'Architect'].map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={submitInvite} className="bg-[#f59e0b] text-[#020617] px-6 py-2.5 text-xs font-semibold hover:bg-[#fbbf24] transition-colors shadow-sm" >Send Invite</button>
                <button onClick={() => setInviteOpen(false)} className="px-6 py-2.5 text-xs border border-slate-800 text-white/40 hover:text-white/70 transition-colors" >Cancel</button>
              </div>
            </div>}

          <div className="bg-[#0f172a] border border-amber-500/10 p-5">
            <div className="flex flex-wrap gap-3 justify-between items-center mb-5">
              <h2 className="text-white font-semibold" >Users ({filteredUsers.length})</h2>
              <div className="flex gap-2 flex-wrap">
                <div className="flex items-center gap-2 bg-[#020617] border border-amber-500/10 px-3 py-2">
                  <Search size={12} className="text-white/30" />
                  <input value={userSearch} onChange={e => setUserSearch(e.target.value)} placeholder="Search users..." className="bg-transparent text-white text-xs w-32 focus:outline-none placeholder:text-white/20"  />
                </div>
                <div className="flex gap-1 flex-wrap">
                  {userRoles.map(r => <button key={r} onClick={() => setUserRoleFilter(r)} className={`px-3 py-2 text-[10px] uppercase border transition-colors ${userRoleFilter === r ? 'bg-[#f59e0b] border-[#f59e0b] text-[#020617] font-bold' : 'border-amber-500/10 text-white/30 hover:border-amber-500/25'}`} >{r}</button>)}
                </div>
                <button onClick={() => setInviteOpen(!inviteOpen)} className="bg-[#f59e0b] text-[#020617] px-4 py-2 text-xs font-semibold flex items-center gap-2 hover:bg-[#fbbf24] transition-colors shadow-sm" >
                  <UserPlus size={13} /><span>Invite</span>
                </button>
              </div>
            </div>
            <div className="space-y-2">
              {filteredUsers.map(u => <div key={u.id} onClick={() => setSelectedUser(u)} className="flex items-center justify-between p-4 bg-[#020617] border border-amber-500/10 hover:border-amber-500/20 cursor-pointer transition-colors group">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 bg-[#f59e0b]/10 rounded-full flex items-center justify-center text-[#f59e0b] text-xs font-semibold shrink-0">
                      {u.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="min-w-0">
                      <p className="text-white text-sm font-medium" >{u.name}</p>
                      <p className="text-white/30 text-xs" >{u.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-5 shrink-0">
                    <span className="text-white/40 text-xs hidden sm:block" >{u.role}</span>
                    <span className={`text-xs font-medium ${statusColors[u.status]}`} >{u.status}</span>
                    <button onClick={e => {
                e.stopPropagation();
                toggleUserStatus(u.id);
              }} className="text-white/20 hover:text-white/50 transition-colors p-1">
                      {u.status === 'active' ? <Lock size={13} /> : <Unlock size={13} />}
                    </button>
                  </div>
                </div>)}
              {filteredUsers.length === 0 && <div className="text-center py-10">
                  <p className="text-white/30 text-sm" >No users match your search</p>
                </div>}
            </div>
          </div>
        </div>}

      {/* ── REPORTS ── */}
      {activeTab === 'reports' && <div className="space-y-5">
          <div className="grid sm:grid-cols-3 gap-4">
            {[{
          label: 'Projects On Track',
          value: `${Math.round(projects.filter(p => p.health === 'green').length / projects.length * 100)}%`,
          color: 'text-emerald-400'
        }, {
          label: 'Avg Approval Time',
          value: '1.4 days',
          color: 'text-[#f59e0b]'
        }, {
          label: 'Client Satisfaction',
          value: '4.9 / 5',
          color: 'text-blue-400'
        }].map(s => <div key={s.label} className="bg-[#0f172a] border border-amber-500/10 p-5">
                <p className={`text-3xl font-light ${s.color}`} >{s.value}</p>
                <p className="text-white/40 text-xs mt-1" >{s.label}</p>
              </div>)}
          </div>

          {/* Project Health Chart */}
          <div className="bg-[#0f172a] border border-amber-500/10 p-5">
            <h3 className="text-white font-semibold mb-5" >Project Health Overview</h3>
            <div className="space-y-4">
              {projects.map(p => <div key={p.id}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${healthColors[p.health]}`} />
                      <p className="text-white/70 text-sm" >{p.name}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-white/30 text-xs" >{p.client}</span>
                      <span className="text-[#f59e0b] text-xs font-semibold w-8 text-right">{p.completion}%</span>
                    </div>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-700 ${p.health === 'green' ? 'bg-emerald-400' : p.health === 'amber' ? 'bg-yellow-400' : 'bg-red-400'}`} style={{
                width: `${p.completion}%`
              }} />
                  </div>
                </div>)}
            </div>
          </div>

          {/* Budget Overview */}
          <div className="bg-[#0f172a] border border-amber-500/10 p-5">
            <h3 className="text-white font-semibold mb-5" >Budget Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {projects.map(p => <div key={p.id} className="bg-[#020617] border border-amber-500/10 p-4">
                  <p className="text-[#f59e0b] text-xs tracking-wider mb-1" >{p.phase}</p>
                  <p className="text-white text-sm font-medium mb-0.5" >{p.name}</p>
                  <p className="text-white/40 text-xs" >{p.client}</p>
                  <p className="text-white text-lg font-light mt-2" >{p.budget}</p>
                </div>)}
            </div>
          </div>

          {/* Audit Trail */}
          <div className="bg-[#0f172a] border border-amber-500/10 p-5">
            <h3 className="text-white font-semibold mb-5" >Audit Trail</h3>
            <div className="space-y-3">
              {auditEvents.map(ev => {
            const Icon = auditTypeIcons[ev.type] ?? Activity;
            return <div key={ev.id} className="flex items-center gap-4 p-3 bg-[#020617] border border-amber-500/10">
                    <div className="w-7 h-7 bg-[#f59e0b]/10 flex items-center justify-center shrink-0">
                      <Icon size={12} className="text-[#f59e0b]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white/70 text-sm" >{ev.action}</p>
                      <p className="text-white/30 text-xs" >{ev.user}</p>
                    </div>
                    <span className="text-white/25 text-xs shrink-0" >{ev.time}</span>
                  </div>;
          })}
            </div>
          </div>
        </div>}

      {/* ── ESTIMATOR ── */}
      {activeTab === 'estimator' && <MaterialEstimator />}
      {activeTab === 'procurement' && <AdminProcurementView projects={projects} />}
      {activeTab === 'billing' && <AdminBillingView invoices={invoices} createInvoice={createInvoice} adminUsers={adminUsers} projects={projects} />}

      {/* ── SETTINGS ── */}
      {activeTab === 'settings' && <div className="space-y-5">
          <div className="bg-[#0f172a] border border-amber-500/10 p-5">
            <h2 className="text-white font-semibold mb-5" >Studio Settings</h2>
            <div className="grid sm:grid-cols-2 gap-5 max-w-2xl">
              {[{
            key: 'studioName',
            label: 'Studio Name',
            placeholder: 'Aura : A Design Studio Workspace',
            icon: Star
          }, {
            key: 'email',
            label: 'Contact Email',
            placeholder: 'hello@auradesign.studio',
            icon: Mail
          }, {
            key: 'phone',
            label: 'Contact Phone',
            placeholder: '+91 00 0000 0000',
            icon: Phone
          }, {
            key: 'address',
            label: 'Studio Address',
            placeholder: 'Full address',
            icon: MapPin
          }].map(field => <div key={field.key}>
                  <label className="text-[10px] text-white/35 tracking-[0.12em] uppercase block mb-2" >{field.label}</label>
                  <div className="relative">
                    <field.icon size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20" />
                    <input value={(settingsForm as Record<string, string>)[field.key]} onChange={e => setSettingsForm(p => ({
                ...p,
                [field.key]: e.target.value
              }))} placeholder={field.placeholder} className="w-full bg-[#020617] border border-slate-800 text-white pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#f59e0b]/40 transition-colors placeholder:text-white/20"  />
                  </div>
                </div>)}
            </div>
            <div className="mt-6 flex items-center gap-4">
              <button onClick={saveSettings} className="bg-[#f59e0b] text-[#020617] px-8 py-3 text-xs tracking-[0.12em] uppercase font-semibold hover:bg-[#fbbf24] transition-colors flex items-center gap-2 shadow-md shadow-amber-500/20" >
                <Save size={13} /><span>Save Changes</span>
              </button>
              {settingsSaved && <div className="flex items-center gap-2 text-emerald-400 text-sm">
                  <CheckCircle2 size={15} /><span >Changes saved!</span>
                </div>}
            </div>
          </div>

          <div className="bg-[#0f172a] border border-amber-500/10 p-5">
            <h3 className="text-white font-semibold mb-4" >Platform Access</h3>
            <div className="space-y-3 max-w-lg">
              {[{
            label: 'Client Portal',
            desc: 'Allow clients to access their dashboards',
            enabled: true
          }, {
            label: 'File Uploads',
            desc: 'Enable file uploads from Project Managers',
            enabled: true
          }, {
            label: 'Invoice Payments',
            desc: 'Allow online invoice payments',
            enabled: false
          }, {
            label: 'Email Notifications',
            desc: 'Send email alerts for approvals and updates',
            enabled: true
          }].map(item => <div key={item.label} className="flex items-center justify-between p-4 bg-[#020617] border border-amber-500/10">
                  <div>
                    <p className="text-white text-sm" >{item.label}</p>
                    <p className="text-white/30 text-xs mt-0.5" >{item.desc}</p>
                  </div>
                  <div className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${item.enabled ? 'bg-[#f59e0b]' : 'bg-white/10'}`}>
                    <div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all ${item.enabled ? 'right-0.5' : 'left-0.5'}`} />
                  </div>
                </div>)}
            </div>
          </div>

          <div className="bg-[#0f172a] border border-amber-500/10 p-5">
            <h3 className="text-white font-semibold mb-2" >Security</h3>
            <p className="text-white/30 text-sm mb-4" >Manage password policies and session settings.</p>
            <div className="flex gap-3 flex-wrap">
              <button className="px-5 py-2.5 border border-amber-500/10 text-white/50 text-xs hover:border-amber-500/30 hover:text-white/70 transition-colors flex items-center gap-2" >
                <Shield size={13} /><span>Change Password</span>
              </button>
              <button className="px-5 py-2.5 border border-amber-500/10 text-white/50 text-xs hover:border-amber-500/30 hover:text-white/70 transition-colors flex items-center gap-2" >
                <Activity size={13} /><span>View Login History</span>
              </button>
            </div>
          </div>
        </div>}
        
      {/* ─────────────────── MESSAGES ─────────────────── */}
      {activeTab === 'messages' && (
        <div className="flex flex-col h-full min-h-[500px]" style={{ height: 'calc(100vh - 120px)' }}>
          <MessageHub 
            currentUser={currentUser} 
            allUsers={users || []}
          />
        </div>
      )}
      {activeTab === 'profile-settings' && <ProfileSettings userName="Admin" />}
      {activeTab === 'security-details' && <SecurityDetails />}
      {activeTab === 'help-support' && <HelpSupport />}

    </HubShell>;
};











