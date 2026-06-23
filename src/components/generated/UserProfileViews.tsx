import React, { useState } from 'react';
import { Settings, Shield, AlertCircle, Save, CheckCircle2, ChevronDown, ChevronUp, Mail, Phone, Lock, Eye, EyeOff, Smartphone, Laptop, Globe, Upload } from 'lucide-react';
import { toast } from 'sonner';

export const ProfileSettings = ({ userName = '' }: { userName?: string }) => {
  const [formData, setFormData] = useState({
    firstName: userName.split(' ')[0] || '',
    lastName: userName.split(' ')[1] || '',
    email: 'contact@example.com',
    phone: '+91 98765 43210',
    company: 'Personal'
  });
  
  const [notifs, setNotifs] = useState({
    email: true,
    sms: false,
    marketing: false
  });

  const handleSave = () => {
    toast.success('Profile settings updated successfully');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      <div className="border-b border-amber-500/10 pb-6">
        <h2 className="text-3xl text-white font-light" >Profile Settings</h2>
        <p className="text-white/40 mt-2 text-sm" >Manage your personal information and preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <h3 className="text-white font-medium mb-1" >Personal Information</h3>
          <p className="text-white/30 text-xs leading-relaxed" >Update your photo and personal details.</p>
        </div>
        
        <div className="md:col-span-2 bg-[#0f172a] border border-amber-500/10 p-6 space-y-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-[#f59e0b]/10 border border-[#f59e0b]/30 flex items-center justify-center text-[#f59e0b] text-2xl font-semibold shadow-inner shadow-[#f59e0b]/20">
              {formData.firstName[0]}{formData.lastName[0]}
            </div>
            <div>
              <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 text-sm text-white transition-colors">
                <Upload size={14} /> Upload New Photo
              </button>
              <p className="text-white/30 text-[10px] mt-2 tracking-wide uppercase">JPG, GIF or PNG. Max size of 2MB.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs text-white/50 uppercase tracking-widest font-semibold">First Name</label>
              <input type="text" value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} className="w-full bg-[#020617] border border-amber-500/20 px-4 py-2.5 text-white text-sm focus:border-[#f59e0b]/50 focus:outline-none transition-colors" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-white/50 uppercase tracking-widest font-semibold">Last Name</label>
              <input type="text" value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} className="w-full bg-[#020617] border border-amber-500/20 px-4 py-2.5 text-white text-sm focus:border-[#f59e0b]/50 focus:outline-none transition-colors" />
            </div>
            <div className="space-y-1.5 col-span-2 sm:col-span-1">
              <label className="text-xs text-white/50 uppercase tracking-widest font-semibold">Email Address</label>
              <div className="relative">
                <Mail size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-[#020617] border border-amber-500/20 pl-10 pr-4 py-2.5 text-white text-sm focus:border-[#f59e0b]/50 focus:outline-none transition-colors" />
              </div>
            </div>
            <div className="space-y-1.5 col-span-2 sm:col-span-1">
              <label className="text-xs text-white/50 uppercase tracking-widest font-semibold">Phone Number</label>
              <div className="relative">
                <Phone size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                <input type="text" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full bg-[#020617] border border-amber-500/20 pl-10 pr-4 py-2.5 text-white text-sm focus:border-[#f59e0b]/50 focus:outline-none transition-colors" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6 border-t border-amber-500/10">
        <div className="md:col-span-1">
          <h3 className="text-white font-medium mb-1" >Communications</h3>
          <p className="text-white/30 text-xs leading-relaxed" >Manage how we contact you regarding project updates.</p>
        </div>
        
        <div className="md:col-span-2 bg-[#0f172a] border border-amber-500/10 p-6 space-y-4">
          <label className="flex items-start gap-4 cursor-pointer group">
            <div className="relative flex items-center justify-center pt-0.5">
              <input type="checkbox" checked={notifs.email} onChange={() => setNotifs({...notifs, email: !notifs.email})} className="peer sr-only" />
              <div className="w-5 h-5 border border-white/20 bg-[#020617] peer-checked:bg-[#f59e0b] peer-checked:border-[#f59e0b] transition-all flex items-center justify-center">
                <CheckCircle2 size={12} className="text-[#020617] opacity-0 peer-checked:opacity-100 scale-50 peer-checked:scale-100 transition-all" />
              </div>
            </div>
            <div>
              <p className="text-white text-sm font-medium">Email Notifications</p>
              <p className="text-white/40 text-xs mt-1 leading-relaxed">Receive daily summaries of site logs, invoice alerts, and critical messages via email.</p>
            </div>
          </label>
          <div className="w-full h-px bg-amber-500/10 my-2" />
          <label className="flex items-start gap-4 cursor-pointer group">
            <div className="relative flex items-center justify-center pt-0.5">
              <input type="checkbox" checked={notifs.sms} onChange={() => setNotifs({...notifs, sms: !notifs.sms})} className="peer sr-only" />
              <div className="w-5 h-5 border border-white/20 bg-[#020617] peer-checked:bg-[#f59e0b] peer-checked:border-[#f59e0b] transition-all flex items-center justify-center">
                <CheckCircle2 size={12} className="text-[#020617] opacity-0 peer-checked:opacity-100 scale-50 peer-checked:scale-100 transition-all" />
              </div>
            </div>
            <div>
              <p className="text-white text-sm font-medium">SMS Alerts</p>
              <p className="text-white/40 text-xs mt-1 leading-relaxed">Receive instant text messages for urgent approvals and immediate actions required.</p>
            </div>
          </label>
        </div>
      </div>

      <div className="flex justify-end pt-6 border-t border-amber-500/10">
        <button onClick={handleSave} className="flex items-center gap-2 bg-[#f59e0b] text-[#020617] hover:bg-[#f59e0b]/90 px-8 py-3 text-sm font-bold uppercase tracking-[0.1em] transition-colors shadow-lg shadow-amber-500/20">
          <Save size={16} /> Save Changes
        </button>
      </div>
    </div>
  );
};

export const SecurityDetails = () => {
  const [showPwd, setShowPwd] = useState(false);
  const [twoFactor, setTwoFactor] = useState(true);

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Password updated successfully');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      <div className="border-b border-amber-500/10 pb-6">
        <h2 className="text-3xl text-white font-light" >Security Details</h2>
        <p className="text-white/40 mt-2 text-sm" >Manage your password, authentication, and active sessions.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <h3 className="text-white font-medium mb-1" >Update Password</h3>
          <p className="text-white/30 text-xs leading-relaxed" >Ensure your account is using a long, random password to stay secure.</p>
        </div>
        
        <form onSubmit={handleUpdatePassword} className="md:col-span-2 bg-[#0f172a] border border-amber-500/10 p-6 space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs text-white/50 uppercase tracking-widest font-semibold">Current Password</label>
            <div className="relative">
              <Lock size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
              <input type={showPwd ? 'text' : 'password'} required className="w-full bg-[#020617] border border-amber-500/20 pl-10 pr-12 py-2.5 text-white text-sm focus:border-[#f59e0b]/50 focus:outline-none transition-colors" />
              <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-white/50 uppercase tracking-widest font-semibold">New Password</label>
            <div className="relative">
              <Lock size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
              <input type={showPwd ? 'text' : 'password'} required minLength={8} className="w-full bg-[#020617] border border-amber-500/20 pl-10 pr-12 py-2.5 text-white text-sm focus:border-[#f59e0b]/50 focus:outline-none transition-colors" />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-white/50 uppercase tracking-widest font-semibold">Confirm Password</label>
            <div className="relative">
              <Lock size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
              <input type={showPwd ? 'text' : 'password'} required minLength={8} className="w-full bg-[#020617] border border-amber-500/20 pl-10 pr-12 py-2.5 text-white text-sm focus:border-[#f59e0b]/50 focus:outline-none transition-colors" />
            </div>
          </div>
          
          <div className="pt-2">
            <button type="submit" className="bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-white px-6 py-2 text-sm font-medium transition-all">
              Update Password
            </button>
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6 border-t border-amber-500/10">
        <div className="md:col-span-1">
          <h3 className="text-white font-medium mb-1" >Two-Factor Authentication</h3>
          <p className="text-white/30 text-xs leading-relaxed" >Add an extra layer of security to your portal.</p>
        </div>
        
        <div className="md:col-span-2 bg-[#0f172a] border border-amber-500/10 p-6 flex items-center justify-between">
          <div>
            <p className="text-white text-sm font-medium">Authenticator App</p>
            <p className="text-white/40 text-xs mt-1 leading-relaxed max-w-sm">Use an app like Google Authenticator to generate temporary codes.</p>
          </div>
          <button 
            onClick={() => { setTwoFactor(!twoFactor); toast.success(twoFactor ? '2FA Disabled' : '2FA Enabled'); }}
            className={`relative w-12 h-6 rounded-full transition-colors ${twoFactor ? 'bg-[#f59e0b]' : 'bg-white/10'}`}
          >
            <div className={`absolute top-1 left-1 w-4 h-4 bg-[#020617] rounded-full transition-transform ${twoFactor ? 'translate-x-6' : 'bg-white/50'}`} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6 border-t border-amber-500/10">
        <div className="md:col-span-1">
          <h3 className="text-white font-medium mb-1" >Active Sessions</h3>
          <p className="text-white/30 text-xs leading-relaxed" >Devices that have recently logged into your account.</p>
        </div>
        
        <div className="md:col-span-2 bg-[#0f172a] border border-amber-500/10">
          <div className="p-4 border-b border-amber-500/10 flex items-center gap-4 hover:bg-white/5 transition-colors">
            <div className="w-10 h-10 bg-emerald-900/30 rounded-full flex items-center justify-center text-emerald-400">
              <Laptop size={18} />
            </div>
            <div className="flex-1">
              <p className="text-white text-sm font-medium">Windows 11 • Chrome (Current)</p>
              <p className="text-white/40 text-xs mt-0.5">Mumbai, India • Active now</p>
            </div>
            <button className="text-xs text-white/30 hover:text-white transition-colors uppercase tracking-widest">Details</button>
          </div>
          <div className="p-4 flex items-center gap-4 hover:bg-white/5 transition-colors">
            <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-white/40">
              <Smartphone size={18} />
            </div>
            <div className="flex-1">
              <p className="text-white text-sm font-medium">iPhone 14 Pro • Safari</p>
              <p className="text-white/40 text-xs mt-0.5">Mumbai, India • 2 hours ago</p>
            </div>
            <button onClick={() => toast.success('Session revoked')} className="text-xs text-red-400 hover:text-red-300 transition-colors uppercase tracking-widest">Revoke</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const HelpSupport = () => {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [ticketSent, setTicketSent] = useState(false);

  const faqs = [
    {
      q: "How do I review and approve project milestones?",
      a: "Navigate to the 'Approvals' tab or check your Overview dashboard. You will see items marked as 'Pending Approval'. Click 'Review' to view details, inspect attachments, and either approve or request changes directly."
    },
    {
      q: "When are invoices generated?",
      a: "Invoices are generated dynamically based on the project phase. You will receive an email notification (if enabled in Profile Settings) and a red alert in the 'Payments' tab whenever a new milestone invoice is issued."
    },
    {
      q: "Can I add team members to view my project?",
      a: "Yes! Currently, you can share individual artifacts (like AI Design Assistant variations) with the site manager. If you need dedicated portal access for an associate or family member, please submit a request using the form below."
    },
    {
      q: "What is the typical response time for support?",
      a: "Our core team monitors support tickets from 9 AM to 7 PM IST. Most technical or account-related issues are resolved within 2-4 hours. Design-related queries may be forwarded to your lead architect."
    }
  ];

  const handleTicket = (e: React.FormEvent) => {
    e.preventDefault();
    setTicketSent(true);
    toast.success('Support ticket submitted successfully!');
    setTimeout(() => setTicketSent(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      <div className="border-b border-amber-500/10 pb-6">
        <h2 className="text-3xl text-white font-light" >Help & Support</h2>
        <p className="text-white/40 mt-2 text-sm" >Find answers to common questions or reach out to our team.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <h3 className="text-white font-medium mb-1" >Frequently Asked</h3>
          <p className="text-white/30 text-xs leading-relaxed" >Quick answers to the most common portal questions.</p>
        </div>
        
        <div className="md:col-span-2 space-y-2">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-[#0f172a] border border-amber-500/10 overflow-hidden">
              <button 
                type="button"
                onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
              >
                <span className="text-white text-sm font-medium" >{faq.q}</span>
                {activeFaq === i ? <ChevronUp size={16} className="text-[#f59e0b] shrink-0" /> : <ChevronDown size={16} className="text-white/30 shrink-0" />}
              </button>
              {activeFaq === i && (
                <div className="p-4 pt-0 border-t border-amber-500/10 bg-[#020617]/50 mt-1">
                  <p className="text-white/50 text-sm leading-relaxed mt-3" >{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6 border-t border-amber-500/10">
        <div className="md:col-span-1">
          <h3 className="text-white font-medium mb-1" >Contact Support</h3>
          <p className="text-white/30 text-xs leading-relaxed" >Can't find what you need? Send a ticket directly to the Aura IT Support.</p>
        </div>
        
        <form onSubmit={handleTicket} className="md:col-span-2 bg-[#0f172a] border border-amber-500/10 p-6 space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs text-white/50 uppercase tracking-widest font-semibold">Category</label>
            <select className="w-full bg-[#020617] border border-amber-500/20 px-4 py-2.5 text-white text-sm focus:border-[#f59e0b]/50 focus:outline-none transition-colors appearance-none">
              <option>Technical Issue (Portal)</option>
              <option>Billing & Payments</option>
              <option>Account Settings</option>
              <option>Project Operations</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-white/50 uppercase tracking-widest font-semibold">Subject</label>
            <input type="text" required placeholder="Brief description of your issue" className="w-full bg-[#020617] border border-amber-500/20 px-4 py-2.5 text-white text-sm focus:border-[#f59e0b]/50 focus:outline-none transition-colors placeholder:text-white/20" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-white/50 uppercase tracking-widest font-semibold">Message</label>
            <textarea required rows={4} placeholder="Please provide as much detail as possible..." className="w-full bg-[#020617] border border-amber-500/20 px-4 py-3 text-white text-sm focus:border-[#f59e0b]/50 focus:outline-none transition-colors resize-none placeholder:text-white/20" />
          </div>
          <div className="pt-2">
            <button 
              type="submit" 
              disabled={ticketSent}
              className={`flex items-center gap-2 px-6 py-2.5 text-sm font-medium transition-all ${ticketSent ? 'bg-emerald-600 text-white border border-emerald-500' : 'bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-white'}`}
            >
              {ticketSent ? <><CheckCircle2 size={16} /> Sent Successfully</> : 'Submit Ticket'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
