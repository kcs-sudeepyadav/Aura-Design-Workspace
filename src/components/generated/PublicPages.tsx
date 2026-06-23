import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { ArrowRight, CheckCircle2, Star, ChevronDown, ChevronUp, Phone, Mail, MapPin, Calendar, Clock, Eye, Layers, Home, Building, PenTool, Camera, Truck, Box, HardHat, Cpu, Play, Wand2, Layout } from 'lucide-react';
type Page = 'home' | 'about' | 'features' | 'portfolio' | 'case-studies' | 'process' | 'testimonials' | 'faqs' | 'contact' | 'book' | 'hub-login' | 'hub-signup' | 'hub-customer' | 'hub-manager' | 'hub-admin' | 'pitch-deck' | 'ai-design' | 'pricing';
interface PageProps {
  onNavigate: (page: Page) => void;
}
const fadeUp = {
  initial: {
    opacity: 0,
    y: 28
  },
  animate: {
    opacity: 1,
    y: 0
  },
  transition: {
    duration: 0.6
  }
};
const sectionClass = 'py-24 md:py-32 px-5 sm:px-8 lg:px-12 max-w-7xl mx-auto';

/* ─────────────────── PUBLIC AI DESIGN ASSISTANT ─────────────────── */
import { DesignAssistant } from './DesignAssistant';

export const PublicAiDesignPage: React.FC<PageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen pt-32 pb-24 px-5 sm:px-8 lg:px-12 max-w-7xl mx-auto">
      <div className="mb-12 text-center max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-light mb-6" >
          Free <span className="italic text-amber-500">AI Design Assistant</span> Trial
        </h1>
        <p className="text-slate-400">
          Experience our exclusive Dual-Model AI before committing. Generate one stunning concept completely free.
        </p>
      </div>
      <DesignAssistant isPublic={true} onNavigate={onNavigate as any} />
    </div>
  );
};

/* ─────────────────── HOME ─────────────────── */

const heroStats: {
  value: string;
  label: string;
}[] = [{
  value: '15+',
  label: 'Hours Saved/Week'
}, {
  value: '40%',
  label: 'Faster Approvals'
}, {
  value: '98%',
  label: 'Client Satisfaction'
}];
const featuredServices: {
  icon: React.ElementType;
  title: string;
  desc: string;
}[] = [{
  icon: Layout,
  title: 'Centralized Client Hub',
  desc: 'Replace chaotic WhatsApp threads and messy email chains with a single source of truth.'
}, {
  icon: Eye,
  title: 'White-labeled Experience',
  desc: 'Your brand, your colors. Give your clients a premium app-like experience.'
}, {
  icon: CheckCircle2,
  title: 'One-Click Approvals',
  desc: 'Get digital sign-offs on materials, budgets, and 3D renders instantly.'
}, {
  icon: Wand2,
  title: 'AI Design Assistant',
  desc: 'Let clients explore AI-generated variations within constraints you control.'
}, {
  icon: Box,
  title: 'Automated Estimator',
  desc: 'Turn floor plans and vendor quotes into trackable invoices.'
}, {
  icon: Phone,
  title: 'Secure Messaging',
  desc: 'Keep all project communication documented and accessible.'
}];
const homeTestimonials: {
  quote: string;
  name: string;
  project: string;
}[] = [{
  quote: 'Aura revolutionized how our studio handles client communication. Approvals that used to take days now happen in minutes.',
  name: 'Ananya Mehta',
  project: 'Principal Architect, Studio AM'
}, {
  quote: 'The white-labeled hub makes us look like a massive tech-forward agency. Our clients are incredibly impressed.',
  name: 'Rohan Kapoor',
  project: 'Founder, RK Designs'
}, {
  quote: 'Using the estimator and invoice generation saves my project managers dozens of administrative hours every month.',
  name: 'Sara Johansson',
  project: 'Design Director, SJ Interiors'
}];
const processSteps: {
  n: string;
  title: string;
  desc: string;
}[] = [{
  n: '01',
  title: 'Onboard Your Studio',
  desc: 'Set up your custom branding, invite your design team, and create your first project workspace in minutes.'
}, {
  n: '02',
  title: 'Invite Your Clients',
  desc: 'Give your high-net-worth clients secure access to their beautiful, white-labeled project dashboard.'
}, {
  n: '03',
  title: 'Scale Operations',
  desc: 'Accelerate design approvals, automate invoices, and take on more projects with zero administrative chaos.'
}];
export const HomePage: React.FC<PageProps> = ({
  onNavigate
}) => <div className="bg-[#020617] text-white">
    {/* Hero */}
    <section className="relative min-h-screen flex flex-col justify-end pb-20 px-5 sm:px-8 lg:px-12 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-[#020617]" />
      <img src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1800&q=85" alt="Luxury interior by Aura : A Design Studio Workspace" className="absolute inset-0 w-full h-full object-cover opacity-40" />
      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <motion.div {...fadeUp}>
          <p className="text-[#f59e0b] text-xs tracking-[0.25em] uppercase mb-6" >
            A Design Studio Workspace
          </p>
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light leading-[1.05] tracking-tight mb-8 max-w-4xl" style={{ fontFamily: "'Times New Roman', serif" }}>
            The ultimate client portal for <em className="italic text-[#f59e0b]">design firms.</em>
          </h1>
          <p className="text-white/50 text-lg max-w-xl mb-10 leading-relaxed" style={{
          letterSpacing: '0.03em'
        }}>
            Centralize communication, speed up approvals, and deliver a premium, white-labeled experience to your high-net-worth clients.
          </p>
          <div className="flex flex-wrap gap-4">
            <button onClick={() => onNavigate('hub-signup')} className="bg-[#f59e0b] text-[#020617] px-8 py-4 text-sm tracking-[0.1em] uppercase font-semibold hover:bg-[#fbbf24] transition-colors flex items-center gap-2 shadow-lg shadow-amber-500/20" >
              <span>Start Free Trial</span><ArrowRight size={16} />
            </button>
            <button onClick={() => onNavigate('contact')} className="border border-amber-500/20 text-white px-8 py-4 text-sm tracking-[0.1em] uppercase hover:border-amber-500/50 hover:text-[#f59e0b] transition-colors" >
              Request Demo
            </button>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="mt-16 flex flex-wrap gap-10 border-t border-amber-500/10 pt-10">
          {heroStats.map(s => <div key={s.label}>
              <p className="text-3xl font-light text-[#f59e0b]" >{s.value}</p>
              <p className="text-xs text-white/40 tracking-[0.1em] uppercase mt-1" >{s.label}</p>
            </div>)}
        </div>
      </div>
    </section>

    {/* Trust strip */}
    <section className="py-10 border-y border-amber-500/10 bg-[#0f172a]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 flex flex-wrap justify-center items-center gap-10 md:gap-16">
        {['ARK & CO', 'PARAGON', 'LUXUS', 'MERIDIAN', 'OBSIDIAN'].map(name => <span key={name} className="text-white/20 font-semibold tracking-widest text-sm" >{name}</span>)}
      </div>
    </section>

    {/* AI Design Assistant Promo */}
    <section className="py-24 px-5 sm:px-8 lg:px-12 border-b border-amber-500/10 bg-[#020617] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
        <div className="max-w-xl">
          <p className="text-[#f59e0b] text-xs tracking-[0.2em] uppercase mb-4" >
            White-labeled AI
          </p>
          <h2 className="text-4xl md:text-5xl font-light mb-6" >
            Empower your clients to <em className="italic text-[#f59e0b]">explore concepts.</em>
          </h2>
          <p className="text-white/40 leading-relaxed mb-8" >
            Integrate our Dual-Model AI Design Assistant directly into your client portal. Let clients generate style variations within constraints you control, without burning your architectural hours.
          </p>
          <button onClick={() => onNavigate('ai-design')} className="bg-[#f59e0b] text-[#020617] px-8 py-4 font-semibold text-sm hover:bg-[#f59e0b]/90 transition-colors flex items-center gap-3" >
            <span>Try AI Design Assistant Free</span><Wand2 size={16} />
          </button>
        </div>
        <div className="flex-1 w-full relative">
          <div className="aspect-[4/3] bg-slate-900 border border-amber-500/20 overflow-hidden relative group">
            <img src="https://images.unsplash.com/photo-1600607686527-6fb886090705?w=800&q=80" alt="AI Design example" className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-luminosity group-hover:mix-blend-normal group-hover:scale-105 transition-all duration-1000" />
            <div className="absolute inset-0 bg-gradient-to-tr from-[#020617] via-transparent to-transparent opacity-80" />
          </div>
        </div>
      </div>
    </section>

    {/* Platform Features */}
    <section className={sectionClass}>
      <div className="mb-14">
        <p className="text-[#f59e0b] text-xs tracking-[0.2em] uppercase mb-4" >Platform Features</p>
        <h2 className="text-4xl md:text-5xl font-light" >Why Choose Aura</h2>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-amber-500/10">
        {featuredServices.map(({
        icon: Icon,
        title,
        desc
      }) => <div key={title} className="bg-[#020617] p-8 group hover:bg-[#0f172a] transition-colors cursor-pointer" onClick={() => onNavigate('features')}>
            <Icon size={22} className="text-[#f59e0b] mb-5" />
            <h3 className="text-white font-medium mb-2" >{title}</h3>
            <p className="text-white/40 text-sm leading-relaxed" style={{
          letterSpacing: '0.03em'
        }}>{desc}</p>
            <ArrowRight size={16} className="text-[#f59e0b] mt-5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>)}
      </div>
    </section>


    {/* Portfolio preview */}
    <section className="pb-24 px-5 sm:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-10">
          <h2 className="text-4xl md:text-5xl font-light" >
            <em className="italic">Customer</em> Success
          </h2>
          <button onClick={() => onNavigate('case-studies')} className="text-[#f59e0b] text-xs tracking-[0.15em] uppercase flex items-center gap-2 hover:gap-3 transition-all" >
            <span>All Stories</span><ArrowRight size={14} />
          </button>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="relative aspect-[4/3] bg-black/40 border border-white/5 overflow-hidden group cursor-pointer" onClick={() => onNavigate('case-studies')}>
            <img src="https://images.unsplash.com/photo-1600210492493-0946911123ea?w=900&q=80" alt="Studio 14 Architects" className="absolute inset-0 w-full h-full object-cover opacity-60 blur-[2px] group-hover:blur-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000 ease-out" />
            
            {/* Decorative Corners */}
            <div className="absolute top-0 right-0 w-16 h-16 border-t border-r border-[#f59e0b]/0 group-hover:border-[#f59e0b]/50 transition-colors duration-700 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-16 h-16 border-b border-l border-[#f59e0b]/0 group-hover:border-[#f59e0b]/50 transition-colors duration-700 pointer-events-none" />
            
            <div className="absolute bottom-0 left-0 right-0 p-8 pt-24 pb-12 bg-gradient-to-t from-black via-black/80 to-transparent translate-y-4 group-hover:translate-y-0 transition-transform duration-700 ease-out flex flex-col justify-end">
              <p className="text-[#f59e0b] text-xs tracking-[0.12em] uppercase mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100" >
                Growing Agency
              </p>
              <h3 className="text-2xl sm:text-3xl font-light text-white group-hover:text-[#f59e0b] transition-colors duration-500 mb-6" >
                Studio 14 Architects
              </h3>
              <div className="flex items-center gap-2 text-white/70 group-hover:text-white transition-all duration-500 ease-out group-hover:translate-x-2">
                <span className="text-xs uppercase tracking-[0.1em] font-semibold" >Read Story</span>
                <ArrowRight size={14} />
              </div>
            </div>
          </div>
          <div className="grid gap-4">
            <div className="relative aspect-video bg-black/40 border border-white/5 overflow-hidden group cursor-pointer" onClick={() => onNavigate('case-studies')}>
              <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=900&q=80" alt="Ark & Co Design" className="absolute inset-0 w-full h-full object-cover opacity-60 blur-[2px] group-hover:blur-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000 ease-out" />
              
              {/* Decorative Corners */}
              <div className="absolute top-0 right-0 w-10 h-10 border-t border-r border-[#f59e0b]/0 group-hover:border-[#f59e0b]/50 transition-colors duration-700 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-10 h-10 border-b border-l border-[#f59e0b]/0 group-hover:border-[#f59e0b]/50 transition-colors duration-700 pointer-events-none" />
              
              <div className="absolute bottom-0 left-0 right-0 p-6 pt-16 pb-10 bg-gradient-to-t from-black via-black/80 to-transparent translate-y-4 group-hover:translate-y-0 transition-transform duration-700 ease-out flex flex-col justify-end">
                <p className="text-[#f59e0b] text-[10px] tracking-[0.12em] uppercase mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100" >
                  Solo Studio
                </p>
                <h3 className="text-xl font-light text-white group-hover:text-[#f59e0b] transition-colors duration-500 mb-3" >
                  Ark & Co Design
                </h3>
                <div className="flex items-center gap-1.5 text-white/70 group-hover:text-white transition-all duration-500 ease-out group-hover:translate-x-1.5">
                  <span className="text-[10px] uppercase tracking-[0.1em] font-semibold" >Read Story</span>
                  <ArrowRight size={12} />
                </div>
              </div>
            </div>
            <div className="relative aspect-video bg-black/40 border border-white/5 overflow-hidden group cursor-pointer" onClick={() => onNavigate('case-studies')}>
              <img src="https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=900&q=80" alt="Meridian Global" className="absolute inset-0 w-full h-full object-cover opacity-60 blur-[2px] group-hover:blur-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000 ease-out" />
              
              {/* Decorative Corners */}
              <div className="absolute top-0 right-0 w-10 h-10 border-t border-r border-[#f59e0b]/0 group-hover:border-[#f59e0b]/50 transition-colors duration-700 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-10 h-10 border-b border-l border-[#f59e0b]/0 group-hover:border-[#f59e0b]/50 transition-colors duration-700 pointer-events-none" />
              
              <div className="absolute bottom-0 left-0 right-0 p-6 pt-16 pb-10 bg-gradient-to-t from-black via-black/80 to-transparent translate-y-4 group-hover:translate-y-0 transition-transform duration-700 ease-out flex flex-col justify-end">
                <p className="text-[#f59e0b] text-[10px] tracking-[0.12em] uppercase mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100" >
                  Enterprise
                </p>
                <h3 className="text-xl font-light text-white group-hover:text-[#f59e0b] transition-colors duration-500 mb-3" >
                  Meridian Global
                </h3>
                <div className="flex items-center gap-1.5 text-white/70 group-hover:text-white transition-all duration-500 ease-out group-hover:translate-x-1.5">
                  <span className="text-[10px] uppercase tracking-[0.1em] font-semibold" >Read Story</span>
                  <ArrowRight size={12} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Process teaser */}
    <section className="bg-[#0f172a] py-24 px-5 sm:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-14">
          <p className="text-[#f59e0b] text-xs tracking-[0.2em] uppercase mb-4" >How It Works</p>
          <h2 className="text-4xl md:text-5xl font-light" >
            From sign-up to <em className="italic text-[#f59e0b]">seamless operations</em>
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-px bg-amber-500/10">
          {processSteps.map(({
          n,
          title,
          desc
        }) => <div key={n} className="bg-[#0f172a] p-8">
              <p className="text-[#f59e0b] text-4xl font-light mb-6" >{n}</p>
              <h3 className="text-white font-medium mb-3" >{title}</h3>
              <p className="text-white/40 text-sm leading-relaxed" style={{
            letterSpacing: '0.03em'
          }}>{desc}</p>
            </div>)}
        </div>
        <div className="mt-10">
          <button onClick={() => onNavigate('process')} className="text-[#f59e0b] text-xs tracking-[0.15em] uppercase flex items-center gap-2 hover:gap-3 transition-all" >
            <span>See Full Process</span><ArrowRight size={14} />
          </button>
        </div>
      </div>
    </section>

    {/* Testimonials */}
    <section className={sectionClass}>
      <div className="mb-14">
        <p className="text-[#f59e0b] text-xs tracking-[0.2em] uppercase mb-4" >Client Voices</p>
        <h2 className="text-4xl md:text-5xl font-light" >What they say</h2>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {homeTestimonials.map(({
        quote,
        name,
        project
      }) => <div key={name} className="bg-[#0f172a] p-8 border border-amber-500/10">
            <div className="flex gap-1 mb-5">
              {[1, 2, 3, 4, 5].map(i => <Star key={i} size={13} fill="#f59e0b" className="text-[#f59e0b]" />)}
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-6 italic" >"{quote}"</p>
            <p className="text-white text-sm font-medium" >{name}</p>
            <p className="text-white/30 text-xs mt-1" style={{
          letterSpacing: '0.04em'
        }}>{project}</p>
          </div>)}
      </div>
    </section>

    {/* Hub preview */}
    <section className="bg-[#f59e0b]/5 border-y border-[#f59e0b]/10 py-20 px-5 sm:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-[#f59e0b] text-xs tracking-[0.2em] uppercase mb-4" >Collaboration Hub</p>
          <h2 className="text-3xl md:text-4xl font-light mb-5" >
            Your project, always<br /><em className="italic">transparent.</em>
          </h2>
          <p className="text-white/40 text-sm leading-relaxed mb-8 max-w-md" style={{
          letterSpacing: '0.03em'
        }}>
            Access real-time updates, approve selections, review documents, and message your team — all in your private secure portal.
          </p>
          <button onClick={() => onNavigate('hub-login')} className="bg-[#f59e0b] text-[#020617] px-7 py-3.5 text-xs tracking-[0.1em] uppercase font-semibold hover:bg-[#fbbf24] transition-colors flex items-center gap-2 shadow-lg shadow-amber-500/20" >
            <span>Access Client Hub</span><ArrowRight size={15} />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {['Project Timeline', 'Approvals', 'Documents', 'Messages'].map(label => <div key={label} className="bg-[#0f172a] p-5 border border-amber-500/10 rounded">
              <div className="w-8 h-1 bg-[#f59e0b] mb-4" />
              <p className="text-white text-sm font-medium" >{label}</p>
              <p className="text-white/30 text-xs mt-1" >Real-time access</p>
            </div>)}
        </div>
      </div>
    </section>

    {/* Final CTA */}
    <section className="py-28 px-5 sm:px-8 lg:px-12 text-center">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-light mb-5" >
          Ready to begin your <em className="italic text-[#f59e0b]">transformation?</em>
        </h2>
        <p className="text-white/40 mb-10 leading-relaxed" style={{
        letterSpacing: '0.03em'
      }}>
          Tell us your vision and we will handle the rest.
        </p>
        <button onClick={() => onNavigate('book')} className="bg-[#f59e0b] text-[#020617] px-10 py-4 text-sm tracking-[0.1em] uppercase font-semibold hover:bg-[#fbbf24] transition-colors shadow-lg shadow-amber-500/20" >
          Book a Free Consultation
        </button>
      </div>
    </section>
  </div>;

/* ─────────────────── ABOUT ─────────────────── */

const values: {
  title: string;
  desc: string;
}[] = [{
  title: 'Efficiency First',
  desc: 'Automating the mundane so you can focus on billable design hours.'
}, {
  title: 'Bank-Grade Security',
  desc: 'Your client data, IP, and financials are protected by enterprise-grade encryption.'
}, {
  title: 'White-Labeled',
  desc: 'Your brand takes center stage. We operate silently in the background.'
}, {
  title: 'Client Experience',
  desc: 'Delivering a premium, frictionless journey for high-net-worth clients.'
}];
const teamMembers: {
  name: string;
  role: string;
  img: string;
}[] = [{
  name: 'Priya Sharma',
  role: 'Founder & CEO (Ex-Agency Owner)',
  img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80'
}, {
  name: 'Aryan Bose',
  role: 'Head of Engineering',
  img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80'
}, {
  name: 'Leila Nouri',
  role: 'Head of Product',
  img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80'
}];
export const AboutPage: React.FC<PageProps> = ({
  onNavigate
}) => <div className="bg-[#020617] text-white pt-[72px]">
    {/* Hero */}
    <section className="relative py-28 px-5 sm:px-8 lg:px-12 overflow-hidden">
      <img src="https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=1600&q=80" alt="Aura : A Design Studio Workspace workspace" className="absolute inset-0 w-full h-full object-cover opacity-10" />
      <div className="relative max-w-7xl mx-auto">
        <motion.div {...fadeUp}>
          <p className="text-[#f59e0b] text-xs tracking-[0.2em] uppercase mb-5" >Our Story</p>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-light leading-tight mb-6 max-w-3xl" >
            Software built by<br /><em className="italic text-[#f59e0b]">designers.</em>
          </h1>
          <p className="text-white/50 text-lg max-w-2xl leading-relaxed" style={{
          letterSpacing: '0.03em'
        }}>
            Aura was born from a singular frustration: managing luxury design projects through messy email threads and scattered WhatsApp messages. We built the platform we wished we had.
          </p>
        </motion.div>
      </div>
    </section>

    {/* Story */}
    <section className="relative py-32 px-5 sm:px-8 lg:px-12 overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#f59e0b]/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto grid md:grid-cols-[1.2fr_1fr] gap-16 lg:gap-24 items-center">
        {/* Left: Text */}
        <motion.div {...fadeUp}>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-none bg-[#f59e0b]/10 text-[#f59e0b] border border-[#f59e0b]/20 text-xs tracking-[0.15em] uppercase mb-8" >
            <Star size={14} className="opacity-80" /> The Founder's Journey
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light leading-tight mb-8" >
            From frustration to <br/><em className="italic bg-clip-text text-transparent bg-gradient-to-r from-[#f59e0b] to-amber-200">innovation.</em>
          </h2>
          
          <div className="space-y-6">
            <p className="text-white/80 text-lg leading-relaxed" style={{
              letterSpacing: '0.02em'
            }}>
              Priya Sharma ran a successful interior design agency for 12 years. But as the agency scaled, the administrative burden became crushing. Client approvals were delayed, invoices were missed, and the premium client experience started to slip.
            </p>
            <p className="text-white/50 leading-relaxed" style={{
              letterSpacing: '0.03em'
            }}>
              Instead of hiring more admin staff, she assembled a team of engineers to build Aura — a centralized, white-labeled client portal designed specifically for the workflows of architecture and design firms.
            </p>
            <p className="text-white/50 leading-relaxed" style={{
              letterSpacing: '0.03em'
            }}>
              Today, Aura powers hundreds of design studios worldwide, helping them reclaim their time and deliver a truly five-star experience to their clients.
            </p>
          </div>
          
          <div className="mt-10 pt-8 border-t border-white/5">
            <p className="text-2xl text-white/40 italic" >Priya Sharma</p>
            <p className="text-xs text-[#f59e0b] tracking-[0.2em] uppercase mt-2" >Founder & CEO</p>
          </div>
        </motion.div>

        {/* Right: Image Composition */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, x: 20 }}
          whileInView={{ opacity: 1, scale: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          {/* Main Image Container */}
          <div className="relative aspect-[4/5] rounded-none overflow-hidden group shadow-2xl shadow-black border border-white/10">
            <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent z-10 opacity-60" />
            <img 
              src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80" 
              alt="Studio in action" 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
            />
          </div>

          {/* Floating Glass Card */}
          <div className="absolute -bottom-8 -left-8 md:-bottom-12 md:-left-12 z-20 backdrop-blur-xl bg-[#0f172a]/80 p-6 rounded-none border border-white/10 shadow-2xl max-w-[240px]">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 rounded-none bg-[#f59e0b]/20 flex items-center justify-center border border-[#f59e0b]/30">
                <CheckCircle2 className="text-[#f59e0b]" size={24} />
              </div>
              <div>
                <div className="text-2xl font-light text-white" >12+</div>
                <div className="text-[10px] text-white/50 uppercase tracking-widest" >Years Experience</div>
              </div>
            </div>
            <p className="text-xs text-white/60 leading-relaxed" >Built specifically for the workflows of modern luxury design studios.</p>
          </div>
        </motion.div>
      </div>
    </section>

    {/* Values */}
    <section className="bg-[#0f172a] py-24 px-5 sm:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <p className="text-[#f59e0b] text-xs tracking-[0.2em] uppercase mb-4" >What drives us</p>
        <h2 className="text-4xl font-light mb-14" >Core Values</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-amber-500/10">
          {values.map(({
          title,
          desc
        }) => <div key={title} className="bg-[#0f172a] p-8">
              <div className="w-8 h-0.5 bg-[#f59e0b] mb-5" />
              <h3 className="text-white font-medium mb-3" >{title}</h3>
              <p className="text-white/40 text-sm leading-relaxed" style={{
            letterSpacing: '0.03em'
          }}>{desc}</p>
            </div>)}
        </div>
      </div>
    </section>

    {/* Team */}
    <section className={sectionClass}>
      <motion.div initial="initial" whileInView="animate" viewport={{ once: true }} variants={{ animate: { transition: { staggerChildren: 0.15 } } }}>
        <motion.p variants={fadeUp} className="text-[#f59e0b] text-xs tracking-[0.2em] uppercase mb-4" >The People</motion.p>
        <motion.h2 variants={fadeUp} className="text-4xl font-light mb-14" >Leadership</motion.h2>
        <div className="grid sm:grid-cols-3 gap-8">
          {teamMembers.map(({
            name,
            role,
            img
          }) => (
            <motion.div key={name} variants={fadeUp} className="group cursor-pointer">
              <div className="aspect-[3/4] bg-[#0f172a] overflow-hidden mb-5 rounded-sm">
                <img src={img} alt={name} className="w-full h-full object-cover opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700" />
              </div>
              <h3 className="text-white font-medium transition-colors group-hover:text-[#f59e0b]" >{name}</h3>
              <p className="text-white/40 text-sm mt-1" style={{
                letterSpacing: '0.03em'
              }}>{role}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>

    {/* CTA */}
    <section className="py-20 px-5 sm:px-8 lg:px-12 text-center bg-[#0f172a]">
      <h2 className="text-3xl font-light mb-6" >Ready to scale your agency?</h2>
      <button onClick={() => onNavigate('hub-signup')} className="bg-[#f59e0b] text-[#020617] px-9 py-4 text-sm tracking-[0.1em] uppercase font-semibold hover:bg-[#fbbf24] transition-colors shadow-lg shadow-amber-500/20" >
        Start Free Trial
      </button>
    </section>
  </div>;

/* ─────────────────── SERVICES ─────────────────── */

const services: {
  icon: React.ElementType;
  title: string;
  desc: string;
  outcomes: string[];
}[] = [{
  icon: Layout,
  title: 'White-Labeled Client Portal',
  desc: 'Your brand, your domain. A premium digital experience for your clients.',
  outcomes: ['Custom brand colors & logos', 'Custom domain mapping', 'Mobile-optimized dashboard', 'Secure client login']
}, {
  icon: CheckCircle2,
  title: 'Automated Approvals',
  desc: 'Never lose track of a client sign-off in an email thread again.',
  outcomes: ['One-click client approvals', 'Version control tracking', 'Digital signatures', 'Approval history logs']
}, {
  icon: Box,
  title: 'Smart Estimator & Invoicing',
  desc: 'Generate professional BOQs and invoices directly from your design specs.',
  outcomes: ['Automated BOQ generation', 'Margin & markup control', 'Integrated payment gateways', 'Automated reminders']
}, {
  icon: Mail,
  title: 'Integrated Messaging Hub',
  desc: 'Keep all project communication centralized, searchable, and secure.',
  outcomes: ['Direct client messaging', 'Internal team chat', 'Read receipts', 'File attachments']
}, {
  icon: Calendar,
  title: 'Milestone Tracking',
  desc: 'Keep clients informed and your team aligned with live project timelines.',
  outcomes: ['Gantt chart views', 'Client-facing progress bars', 'Task assignments', 'Automated status updates']
}, {
  icon: Layers,
  title: 'Asset & File Management',
  desc: 'Securely store and share CAD files, 3D renders, and heavy moodboards.',
  outcomes: ['Unlimited cloud storage', 'File access controls', 'In-browser 3D viewing', 'Folder organization']
}, {
  icon: Truck,
  title: 'Vendor Procurement',
  desc: 'Manage your supply chain and track purchase orders effortlessly.',
  outcomes: ['Vendor database', 'Automated PO generation', 'Delivery tracking', 'Quality control logs']
}, {
  icon: Wand2,
  title: 'AI Design Assistant',
  desc: "Empower clients to explore safe AI variations without burning your hours.",
  outcomes: ['Dual-model AI integration', 'Constraint-based styling', 'Instant 4K renders', 'Inspiration generation']
}];
export const ServicesPage: React.FC<PageProps> = ({
  onNavigate
}) => <div className="bg-[#020617] text-white pt-[72px]">
    <section className="py-24 px-5 sm:px-8 lg:px-12 bg-[#0f172a]">
      <div className="max-w-7xl mx-auto">
        <p className="text-[#f59e0b] text-xs tracking-[0.2em] uppercase mb-5" >Platform Capabilities</p>
        <h1 className="text-5xl md:text-6xl font-light mb-6 max-w-2xl" >
          Features built for <em className="italic text-[#f59e0b]">scale</em>
        </h1>
        <p className="text-white/40 text-lg max-w-xl leading-relaxed" style={{
        letterSpacing: '0.03em'
      }}>
          Everything an ambitious design agency needs to deliver a world-class client experience.
        </p>
      </div>
    </section>

    <section className="py-16 px-5 sm:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map(({
        icon: Icon,
        title,
        desc,
        outcomes
      }) => <div key={title} className="bg-[#0f172a] border border-slate-800 p-8 group hover:border-[#f59e0b]/30 transition-colors">
            <Icon size={22} className="text-[#f59e0b] mb-5" />
            <h2 className="text-white font-medium text-lg mb-3" >{title}</h2>
            <p className="text-white/40 text-sm leading-relaxed mb-6" style={{
          letterSpacing: '0.03em'
        }}>{desc}</p>
            <ul className="space-y-2">
              {outcomes.map(o => <li key={o} className="flex items-center gap-2 text-xs text-white/30">
                  <CheckCircle2 size={12} className="text-[#f59e0b] shrink-0" />
                  <span style={{
              letterSpacing: '0.03em'
            }}>{o}</span>
                </li>)}
            </ul>
          </div>)}
      </div>
    </section>

    <section className="py-20 px-5 sm:px-8 lg:px-12 text-center">
      <div className="max-w-xl mx-auto">
        <h2 className="text-3xl font-light mb-4" >Ready to modernize your studio?</h2>
        <p className="text-white/40 mb-8 text-sm leading-relaxed" style={{
        letterSpacing: '0.03em'
      }}>
          Join hundreds of design agencies reclaiming their time with Aura.
        </p>
        <button onClick={() => onNavigate('hub-signup')} className="bg-[#f59e0b] text-[#020617] px-9 py-4 text-sm tracking-[0.1em] uppercase font-semibold hover:bg-[#fbbf24] transition-colors shadow-lg shadow-amber-500/20" >
          Start Free Trial
        </button>
      </div>
    </section>
  </div>;

/* ─────────────────── PORTFOLIO ─────────────────── */

const portfolioProjects: {
  title: string;
  cat: string;
  location: string;
  img: string;
  tag: string;
}[] = [{
  title: 'Studio 14 Architects',
  cat: 'Growing Agency',
  location: 'Scaled to 25+ projects',
  img: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&q=80',
  tag: 'growing'
}, {
  title: 'Ark & Co Design',
  cat: 'Solo Studio',
  location: 'Reclaimed 15 hrs/week',
  img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
  tag: 'solo'
}, {
  title: 'Meridian Global',
  cat: 'Enterprise',
  location: 'Deployed across 4 offices',
  img: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&q=80',
  tag: 'enterprise'
}, {
  title: 'The Onyx Group',
  cat: 'Growing Agency',
  location: '40% faster approvals',
  img: 'https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=800&q=80',
  tag: 'growing'
}, {
  title: 'Luxus Interiors',
  cat: 'Solo Studio',
  location: 'Zero lost invoices',
  img: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80',
  tag: 'solo'
}, {
  title: 'Paragon Spaces',
  cat: 'Growing Agency',
  location: 'Doubled revenue in 1yr',
  img: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80',
  tag: 'growing'
}];
const filterTabs: {
  label: string;
  value: string;
}[] = [{
  label: 'All',
  value: 'all'
}, {
  label: 'Solo Studio',
  value: 'solo'
}, {
  label: 'Growing Agency',
  value: 'growing'
}, {
  label: 'Enterprise',
  value: 'enterprise'
}];
export const PortfolioPage: React.FC<PageProps> = ({
  onNavigate
}) => {
  const [active, setActive] = useState('all');
  const filtered = active === 'all' ? portfolioProjects : portfolioProjects.filter(p => p.tag === active);

  return (
    <div className="bg-[#020617] text-white pt-[72px]">
      <section className="py-20 px-5 sm:px-8 lg:px-12 bg-[#0f172a]">
        <div className="max-w-7xl mx-auto">
          <p className="text-[#f59e0b] text-xs tracking-[0.2em] uppercase mb-5" >
            Success Stories
          </p>
          <h1 className="text-5xl md:text-6xl font-light mb-8" >
            The Agency Wall
          </h1>
          <div className="flex flex-wrap gap-3">
            {filterTabs.map(({ label, value }) => (
              <button 
                key={value} 
                onClick={() => setActive(value)} 
                className={`px-5 py-2 text-xs tracking-[0.1em] uppercase border transition-colors ${active === value ? 'bg-[#f59e0b] text-[#020617] border-[#f59e0b] font-semibold' : 'border-amber-500/15 text-white/50 hover:border-amber-500/40 hover:text-white'}`} 
                
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </section>
      
      <section className="py-10 px-5 sm:px-8 lg:px-12 min-h-screen">
        <motion.div layout className="max-w-7xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map(({ title, cat, location, img }) => (
              <motion.div
                key={title}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="group relative cursor-pointer overflow-hidden bg-black/40 border border-white/5 h-[650px]"
                onClick={() => onNavigate('case-studies')}
              >
                {/* Background Image */}
                <img 
                  src={img} 
                  alt={title} 
                  className="absolute inset-0 w-full h-full object-cover opacity-60 blur-[2px] group-hover:blur-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000 ease-out" 
                />
                
                {/* Decorative Corners */}
                <div className="absolute top-0 right-0 w-16 h-16 border-t border-r border-[#f59e0b]/0 group-hover:border-[#f59e0b]/50 transition-colors duration-700 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-16 h-16 border-b border-l border-[#f59e0b]/0 group-hover:border-[#f59e0b]/50 transition-colors duration-700 pointer-events-none" />
                
                {/* Overlay Content wrapper */}
                <div className="absolute bottom-0 left-0 right-0 p-8 pt-24 pb-12 bg-gradient-to-t from-black via-black/80 to-transparent translate-y-8 group-hover:translate-y-0 transition-transform duration-700 ease-out flex flex-col justify-end">
                  <p className="text-[#f59e0b] text-xs tracking-[0.12em] uppercase mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100" >
                    {cat} • {location}
                  </p>
                  <h3 className="text-2xl sm:text-3xl font-light text-white group-hover:text-[#f59e0b] transition-colors duration-500 mb-6" >
                    {title}
                  </h3>
                  <div className="flex items-center gap-2 text-white/70 group-hover:text-white transition-all duration-500 group-hover:translate-x-2">
                    <span className="text-xs uppercase tracking-[0.1em] font-semibold" >View Project</span>
                    <ArrowRight size={14} />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>

      <section className="py-20 text-center">
        <button onClick={() => onNavigate('hub-signup')} className="bg-[#f59e0b] text-[#020617] px-9 py-4 text-sm tracking-[0.1em] uppercase font-semibold hover:bg-[#fbbf24] transition-colors shadow-lg shadow-amber-500/20" >
          Become a Success Story
        </button>
      </section>
    </div>
  );
};

/* ─────────────────── CASE STUDIES ─────────────────── */

const caseStudies: {
  title: string;
  location: string;
  img: string;
  challenge: string;
  solution: string;
  result: string;
  duration: string;
}[] = [{
  title: 'Studio 14 Architects',
  location: '12-Person Firm · Commercial Design',
  img: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=900&q=80',
  challenge: 'Managing 20+ active projects via email threads led to dropped approvals, scope creep, and overwhelmed project managers.',
  solution: 'Deployed Aura across the entire team. Clients were onboarded to white-labeled portals where all CAD files and approvals lived in one place.',
  result: 'Reduced administrative time by 15 hours/week per PM. Eliminated scope creep entirely thanks to digital sign-offs.',
  duration: 'Onboarded in 3 days'
}, {
  title: 'Ark & Co',
  location: 'Solo Designer · Luxury Residential',
  img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=900&q=80',
  challenge: 'Struggled to look like a "big agency" to high-net-worth clients while handling all design and administrative tasks alone.',
  solution: 'Used Aura\'s custom domain mapping and AI Design Assistant to deliver a premium, tech-forward experience that wowed clients.',
  result: 'Closed 3x larger contracts. Clients explicitly cited the professional client dashboard as a reason they chose Ark & Co.',
  duration: 'Onboarded in 1 day'
}, {
  title: 'Meridian Global',
  location: 'Enterprise · 50+ Staff',
  img: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=900&q=80',
  challenge: 'Disjointed communication across 4 regional offices and a lack of standardized invoicing led to cash flow delays.',
  solution: 'Integrated Aura\'s smart estimator and milestone tracking across all offices, creating a single source of truth for finance and design teams.',
  result: 'Accelerated invoice payments by 22 days on average. Improved cross-office collaboration and resource allocation.',
  duration: 'Deployed in 2 weeks'
}];
export const CaseStudiesPage: React.FC<PageProps> = ({
  onNavigate
}) => <div className="bg-[#020617] text-white pt-[72px]">
    <section className="py-20 px-5 sm:px-8 lg:px-12 bg-[#0f172a]">
      <div className="max-w-7xl mx-auto">
        <p className="text-[#f59e0b] text-xs tracking-[0.2em] uppercase mb-5" >Proof of Impact</p>
        <h1 className="text-5xl md:text-6xl font-light" >Case Studies</h1>
      </div>
    </section>
    <section className="py-16 px-5 sm:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto space-y-20">
        {caseStudies.map(({
        title,
        location,
        img,
        challenge,
        solution,
        result,
        duration
      }, idx) => <div key={title} className={`grid md:grid-cols-2 gap-12 items-center ${idx % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
            <div className={idx % 2 === 1 ? 'md:order-2' : ''}>
              <div className="aspect-[4/3] bg-[#0f172a] overflow-hidden">
                <img src={img} alt={title} className="w-full h-full object-cover opacity-80" />
              </div>
            </div>
            <div className={idx % 2 === 1 ? 'md:order-1' : ''}>
              <p className="text-[#f59e0b] text-xs tracking-[0.15em] uppercase mb-3" >{location} · {duration}</p>
              <h2 className="text-3xl font-light mb-6" >{title}</h2>
              <div className="space-y-5">
                <div>
                  <p className="text-white text-xs tracking-[0.1em] uppercase font-semibold mb-2" >Challenge</p>
                  <p className="text-white/50 text-sm leading-relaxed" style={{
                letterSpacing: '0.03em'
              }}>{challenge}</p>
                </div>
                <div>
                  <p className="text-white text-xs tracking-[0.1em] uppercase font-semibold mb-2" >Our Approach</p>
                  <p className="text-white/50 text-sm leading-relaxed" style={{
                letterSpacing: '0.03em'
              }}>{solution}</p>
                </div>
                <div>
                  <p className="text-white text-xs tracking-[0.1em] uppercase font-semibold mb-2" >Result</p>
                  <p className="text-white/50 text-sm leading-relaxed" style={{
                letterSpacing: '0.03em'
              }}>{result}</p>
                </div>
              </div>
              <button onClick={() => onNavigate('hub-signup')} className="mt-8 text-[#f59e0b] text-xs tracking-[0.15em] uppercase flex items-center gap-2 hover:gap-3 transition-all" >
                <span>Transform Your Agency</span><ArrowRight size={14} />
              </button>
            </div>
          </div>)}
      </div>
    </section>
  </div>;

/* ─────────────────── PROCESS ─────────────────── */

const fullProcess: {
  n: string;
  title: string;
  desc: string;
  client: string;
  studio: string;
}[] = [{
  n: '01',
  title: 'Workspace Setup',
  desc: 'Configure your agency\'s brand identity and set up your core operational templates.',
  client: 'Upload logo, set brand colors, configure custom domain',
  studio: 'Aura instantly provisions your secure, white-labeled portal environment'
}, {
  n: '02',
  title: 'Import Active Projects',
  desc: 'Move out of chaotic email threads and into organized digital workspaces.',
  client: 'Create project folders, upload CAD files, set milestones',
  studio: 'Aura generates smart approval workflows and timeline Gantt charts'
}, {
  n: '03',
  title: 'Onboard Your Team',
  desc: 'Bring your designers, project managers, and finance team into the system.',
  client: 'Invite staff members and set granular role-based access permissions',
  studio: 'Aura creates dedicated secure logins and tracks audit logs'
}, {
  n: '04',
  title: 'Invite Your Clients',
  desc: 'Give your high-net-worth clients the premium digital experience they expect.',
  client: 'Send white-labeled invite links to homeowners or corporate clients',
  studio: 'Aura provides clients with a beautiful, read-only (or approval-only) dashboard'
}, {
  n: '05',
  title: 'Automate Operations',
  desc: 'Start running your agency on autopilot.',
  client: 'Request 3D render approvals, generate invoices, track vendor POs',
  studio: 'Aura automates follow-ups, tracks digital signatures, and syncs payments'
}, {
  n: '06',
  title: 'Scale & Grow',
  desc: 'Take on more projects without increasing your administrative headcount.',
  client: 'Analyze agency performance, win larger bids with a superior pitch',
  studio: 'Aura scales securely in the cloud to support unlimited growth'
}];
export const ProcessPage: React.FC<PageProps> = ({
  onNavigate
}) => <div className="bg-[#020617] text-white pt-[72px]">
    <section className="py-24 px-5 sm:px-8 lg:px-12 bg-[#0f172a]">
      <div className="max-w-7xl mx-auto">
        <p className="text-[#f59e0b] text-xs tracking-[0.2em] uppercase mb-5" >Onboarding Flow</p>
        <h1 className="text-5xl md:text-6xl font-light mb-6 max-w-2xl" >
          A clear path from <em className="italic text-[#f59e0b]">sign-up to scale</em>
        </h1>
        <p className="text-white/40 max-w-xl leading-relaxed" style={{
        letterSpacing: '0.03em'
      }}>
          Transitioning your agency's operations to Aura is seamless. Here is exactly what to expect at every stage.
        </p>
      </div>
    </section>
    <section className="py-16 px-5 sm:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="space-y-0">
          {fullProcess.map(({
          n,
          title,
          desc,
          client,
          studio
        }, i) => <div key={n} className={`grid md:grid-cols-[80px_1fr_1fr] gap-0 border-b border-amber-500/10 py-10 ${i === 0 ? 'border-t border-amber-500/10' : ''}`}>
              <div className="text-[#f59e0b] text-3xl font-light mb-4 md:mb-0" >{n}</div>
              <div className="pr-8">
                <h2 className="text-white font-medium text-lg mb-3" >{title}</h2>
                <p className="text-white/40 text-sm leading-relaxed" style={{
              letterSpacing: '0.03em'
            }}>{desc}</p>
              </div>
              <div className="mt-6 md:mt-0 pl-0 md:pl-8 md:border-l md:border-amber-500/10 space-y-4">
                <div>
                  <p className="text-[#f59e0b] text-xs tracking-[0.1em] uppercase mb-1" >Your Action</p>
                  <p className="text-white/40 text-sm" style={{
                letterSpacing: '0.03em'
              }}>{client}</p>
                </div>
                <div>
                  <p className="text-white text-xs tracking-[0.1em] uppercase mb-1" >Aura's Automation</p>
                  <p className="text-white/40 text-sm" style={{
                letterSpacing: '0.03em'
              }}>{studio}</p>
                </div>
              </div>
            </div>)}
        </div>
        <div className="mt-14 text-center">
          <button onClick={() => onNavigate('hub-signup')} className="bg-[#f59e0b] text-[#020617] px-9 py-4 text-sm tracking-[0.1em] uppercase font-semibold hover:bg-[#fbbf24] transition-colors shadow-lg shadow-amber-500/20" >
            Start Your Onboarding
          </button>
        </div>
      </div>
    </section>
  </div>;

/* ─────────────────── TESTIMONIALS ─────────────────── */

const allTestimonials: {
  quote: string;
  name: string;
  project: string;
  rating: number;
}[] = [{
  quote: 'Aura\'s client hub is the only reason we were able to scale from 5 to 25 concurrent projects without losing our minds.',
  name: 'Ananya Mehta',
  project: 'Principal, Ark & Co',
  rating: 5
}, {
  quote: 'We used to lose so much money on scope creep. The digital approval workflows fixed that instantly.',
  name: 'Rohan Kapoor',
  project: 'Founder, Studio 14',
  rating: 5
}, {
  quote: 'Our high-net-worth clients literally gasp when we send them their custom portal invite. It elevates our brand so much.',
  name: 'Sara Johansson',
  project: 'Director, Meridian',
  rating: 5
}, {
  quote: 'The AI Design Assistant alone pays for the subscription. Clients can explore ideas safely without burning our billable hours.',
  name: 'Meera Nair',
  project: 'Partner, Luxus Interiors',
  rating: 5
}, {
  quote: 'Invoicing used to be a nightmare of spreadsheets. Aura generates our BOQs automatically. Incredible.',
  name: 'Dev Anand',
  project: 'Finance Lead, Paragon',
  rating: 5
}, {
  quote: 'The best investment we made this year. It replaces about 4 different software tools we were duct-taping together.',
  name: 'Aisha Patel',
  project: 'Operations Head, Obsidian',
  rating: 5
}];
export const TestimonialsPage: React.FC<PageProps> = ({
  onNavigate
}) => <div className="bg-[#020617] text-white pt-[72px]">
    <section className="py-24 px-5 sm:px-8 lg:px-12 bg-[#0f172a]">
      <div className="max-w-7xl mx-auto">
        <p className="text-[#f59e0b] text-xs tracking-[0.2em] uppercase mb-5" >Industry Voices</p>
        <h1 className="text-5xl md:text-6xl font-light mb-4" >What agencies say</h1>
        <div className="flex gap-1 items-center mt-4">
          {[1, 2, 3, 4, 5].map(i => <Star key={i} size={18} fill="#f59e0b" className="text-[#f59e0b]" />)}
          <span className="text-white/40 text-sm ml-3" >4.9 / 5 across 500+ design firms</span>
        </div>
      </div>
    </section>
    <section className="py-16 px-5 sm:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {allTestimonials.map(({
        quote,
        name,
        project,
        rating
      }) => <div key={name} className="bg-[#0f172a] border border-amber-500/10 p-8">
            <div className="flex gap-1 mb-5">
              {Array.from({
            length: rating
          }).map((_, i) => <Star key={i} size={13} fill="#f59e0b" className="text-[#f59e0b]" />)}
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-6 italic" >"{quote}"</p>
            <p className="text-white text-sm font-medium" >{name}</p>
            <p className="text-white/30 text-xs mt-1" style={{
          letterSpacing: '0.04em'
        }}>{project}</p>
          </div>)}
      </div>
    </section>
    <section className="py-10 border-y border-amber-500/10">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 flex flex-wrap justify-center gap-10 md:gap-16">
        {['ARK & CO', 'PARAGON', 'LUXUS', 'MERIDIAN', 'OBSIDIAN'].map(name => <span key={name} className="text-white/20 font-semibold tracking-widest text-sm" >{name}</span>)}
      </div>
    </section>
    <section className="py-20 text-center">
      <button onClick={() => onNavigate('hub-signup')} className="bg-[#f59e0b] text-[#020617] px-9 py-4 text-sm tracking-[0.1em] uppercase font-semibold hover:bg-[#fbbf24] transition-colors shadow-lg shadow-amber-500/20" >
        Start Your Free Trial
      </button>
    </section>
  </div>;

/* ─────────────────── FAQs ─────────────────── */

const faqs: {
  q: string;
  a: string;
}[] = [{
  q: 'Is my client data and IP secure?',
  a: 'Yes. Aura uses bank-grade 256-bit AES encryption. Your CAD files, financial data, and client communications are strictly confidential and hosted on secure AWS servers.'
}, {
  q: 'Can I use my own agency\'s domain name?',
  a: 'Absolutely. On our Pro and Enterprise tiers, you can map your client portal to a custom domain (e.g., portal.youragency.com) so clients never see the Aura URL.'
}, {
  q: 'Is there a limit to how many clients I can invite?',
  a: 'No. All our paid plans include unlimited client accounts. You only pay for the internal team members (designers, PMs) who use the platform.'
}, {
  q: 'How does the billing work?',
  a: 'We offer monthly and annual subscriptions billed in Indian Rupees (₹). Annual plans receive a 20% discount. There are no hidden setup fees.'
}, {
  q: 'Does Aura integrate with my accounting software?',
  a: 'Aura integrates seamlessly with Tally, QuickBooks, and Zoho Books. Invoices generated in Aura will automatically sync to your accounting suite.'
}, {
  q: 'Do you offer a white-label mobile app?',
  a: 'The Aura platform is highly responsive and behaves like an app on mobile browsers. A dedicated, white-labeled iOS/Android app is available for Enterprise customers upon request.'
}, {
  q: 'How does the AI Design Assistant work?',
  a: 'It allows your clients to upload photos of their spaces and apply safe, constraint-based styles. It uses a dual-model architecture to ensure the AI only generates buildable, realistic variations that won\'t compromise your firm\'s reputation.'
}, {
  q: 'What happens if I decide to cancel my subscription?',
  a: 'You can cancel at any time. We provide a 30-day grace period during which you can download an archive of all your files, communications, and invoices before the data is permanently deleted.'
}];
export const FaqsPage: React.FC<PageProps> = ({
  onNavigate
}) => {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  return <div className="bg-[#020617] text-white pt-[72px]">
      <section className="py-24 px-5 sm:px-8 lg:px-12 bg-[#0f172a]">
        <div className="max-w-7xl mx-auto">
          <p className="text-[#f59e0b] text-xs tracking-[0.2em] uppercase mb-5" >Questions</p>
          <h1 className="text-5xl md:text-6xl font-light" >Frequently Asked</h1>
        </div>
      </section>
      <section className="py-16 px-5 sm:px-8 lg:px-12">
        <div className="max-w-3xl mx-auto">
          {faqs.map(({
          q,
          a
        }, i) => <div key={q} className="border-b border-amber-500/10">
              <button className="w-full flex justify-between items-center py-6 text-left" onClick={() => setOpenIdx(openIdx === i ? null : i)}>
                <span className="text-white font-medium pr-8" >{q}</span>
                {openIdx === i ? <ChevronUp size={18} className="text-[#f59e0b] shrink-0" /> : <ChevronDown size={18} className="text-white/30 shrink-0" />}
              </button>
              {openIdx === i && <div className="pb-6 text-white/50 text-sm leading-relaxed" style={{
            letterSpacing: '0.03em'
          }}>{a}</div>}
            </div>)}
        </div>
      </section>
      <section className="py-16 text-center">
        <p className="text-white/40 mb-6 text-sm" >Have more questions?</p>
        <button onClick={() => onNavigate('contact')} className="bg-[#f59e0b] text-[#020617] px-9 py-4 text-sm tracking-[0.1em] uppercase font-semibold hover:bg-[#fbbf24] transition-colors shadow-lg shadow-amber-500/20" >
          Get in Touch
        </button>
      </section>
    </div>;
};

/* ─────────────────── CONTACT ─────────────────── */

export const ContactPage: React.FC<PageProps> = ({
  onNavigate
}) => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    service: '',
    message: ''
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill in all required fields.');
      return;
    }
    toast.success('Message sent successfully!');
    setForm({ name: '', email: '', service: '', message: '' });
  };
  const contactInfoItems = [{
    icon: Phone,
    label: 'Phone',
    value: '+91 22 4891 0000'
  }, {
    icon: Mail,
    label: 'Email',
    value: 'hello@auradesign.studio'
  }, {
    icon: MapPin,
    label: 'Studio',
    value: '12A Mahalaxmi Industrial Estate, Mumbai 400 011'
  }, {
    icon: Clock,
    label: 'Hours',
    value: 'Mon–Sat, 9am–6pm IST'
  }];
  return <div className="bg-[#020617] text-white pt-[72px]">
      <section className="py-24 px-5 sm:px-8 lg:px-12 bg-[#0f172a]">
        <div className="max-w-7xl mx-auto">
          <p className="text-[#f59e0b] text-xs tracking-[0.2em] uppercase mb-5" >Reach Out</p>
          <h1 className="text-5xl md:text-6xl font-light max-w-2xl" >
            Talk to <em className="italic text-[#f59e0b]">Sales</em>
          </h1>
        </div>
      </section>
      <section className="py-16 px-5 sm:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16">
          {/* Form */}
          <div>
            <h2 className="text-2xl font-light mb-8" >Send an Enquiry</h2>
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="text-xs text-white/40 tracking-[0.1em] uppercase block mb-2" >Full Name</label>
                <input type="text" name="name" value={form.name} onChange={handleChange} className="w-full bg-[#0f172a] border border-slate-800 text-white px-4 py-3 text-sm focus:outline-none focus:border-[#f59e0b]/50 transition-colors" placeholder="Your name"  />
              </div>
              <div>
                <label className="text-xs text-white/40 tracking-[0.1em] uppercase block mb-2" >Email</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} className="w-full bg-[#0f172a] border border-slate-800 text-white px-4 py-3 text-sm focus:outline-none focus:border-[#f59e0b]/50 transition-colors" placeholder="your@email.com"  />
              </div>
              <div>
                <label className="text-xs text-white/40 tracking-[0.1em] uppercase block mb-2" >Agency Size</label>
                <select name="service" value={form.service} onChange={handleChange} className="w-full bg-[#0f172a] border border-slate-800 text-white px-4 py-3 text-sm focus:outline-none focus:border-[#f59e0b]/50 transition-colors appearance-none" >
                  <option value="">Select team size</option>
                  <option value="1-5">1-5 Team Members</option>
                  <option value="6-15">6-15 Team Members</option>
                  <option value="16-50">16-50 Team Members</option>
                  <option value="50+">50+ (Enterprise)</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-white/40 tracking-[0.1em] uppercase block mb-2" >Message</label>
                <textarea name="message" value={form.message} onChange={handleChange} rows={5} className="w-full bg-[#0f172a] border border-slate-800 text-white px-4 py-3 text-sm focus:outline-none focus:border-[#f59e0b]/50 transition-colors resize-none" placeholder="Tell us about your project..."  />
              </div>
              <button type="submit" className="w-full bg-[#f59e0b] text-[#020617] py-4 text-sm tracking-[0.1em] uppercase font-semibold hover:bg-[#fbbf24] transition-colors shadow-lg shadow-amber-500/20" >
                Send Message
              </button>
            </form>
          </div>

          {/* Contact info */}
          <div>
            <h2 className="text-2xl font-light mb-8" >Direct Contact</h2>
            <div className="space-y-6 mb-12">
              {contactInfoItems.map(({
              icon: Icon,
              label,
              value
            }) => <div key={label} className="flex gap-4 items-start">
                  <div className="w-10 h-10 bg-[#0f172a] border border-amber-500/10 flex items-center justify-center shrink-0">
                    <Icon size={16} className="text-[#f59e0b]" />
                  </div>
                  <div>
                    <p className="text-xs text-white/30 tracking-[0.1em] uppercase mb-1" >{label}</p>
                    <p className="text-white text-sm" >{value}</p>
                  </div>
                </div>)}
            </div>
            <div className="bg-[#0f172a] border border-amber-500/10 p-6">
              <p className="text-[#f59e0b] text-xs tracking-[0.15em] uppercase mb-3" >Prefer a call?</p>
              <p className="text-white/50 text-sm mb-4 leading-relaxed" style={{
              letterSpacing: '0.03em'
            }}>
                Book a personalized 1-on-1 demo of the Aura platform.
              </p>
              <button onClick={() => onNavigate('book')} className="text-[#f59e0b] text-xs tracking-[0.15em] uppercase flex items-center gap-2 hover:gap-3 transition-all" >
                <span>Request a Demo</span><ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>;
};

/* ─────────────────── BOOK CONSULTATION ─────────────────── */

const timeSlots: {
  id: string;
  time: string;
}[] = [{
  id: 'slot-1',
  time: '9:00 AM'
}, {
  id: 'slot-2',
  time: '10:00 AM'
}, {
  id: 'slot-3',
  time: '11:00 AM'
}, {
  id: 'slot-4',
  time: '2:00 PM'
}, {
  id: 'slot-5',
  time: '3:00 PM'
}, {
  id: 'slot-6',
  time: '4:00 PM'
}];
const bookFormFields: {
  name: string;
  label: string;
  type: string;
  placeholder: string;
}[] = [{
  name: 'name',
  label: 'Full Name',
  type: 'text',
  placeholder: 'Your name'
}, {
  name: 'email',
  label: 'Email',
  type: 'email',
  placeholder: 'your@email.com'
}, {
  name: 'phone',
  label: 'Phone',
  type: 'tel',
  placeholder: '+91 00000 00000'
}];
export const BookPage: React.FC<PageProps> = ({
  onNavigate
}) => {
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    budget: ''
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) {
      toast.error('Please select a time slot.');
      return;
    }
    if (!form.name || !form.email) {
      toast.error('Please provide your name and email.');
      return;
    }
    toast.success('Consultation booked successfully!');
    setSelectedSlot(null);
    setForm({ name: '', email: '', phone: '', service: '', budget: '' });
  };
  return <div className="bg-[#020617] text-white pt-[72px]">
      <section className="py-24 px-5 sm:px-8 lg:px-12 bg-[#0f172a]">
        <div className="max-w-7xl mx-auto">
          <p className="text-[#f59e0b] text-xs tracking-[0.2em] uppercase mb-5" >Personalized Walkthrough</p>
          <h1 className="text-5xl md:text-6xl font-light" >Request a Demo</h1>
          <p className="text-white/40 mt-4 max-w-xl leading-relaxed" style={{
          letterSpacing: '0.03em'
        }}>
            See how Aura can streamline your agency's operations in a 1-on-1 session.
          </p>
        </div>
      </section>
      <section className="py-16 px-5 sm:px-8 lg:px-12">
        <div className="max-w-4xl mx-auto">
          <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="grid sm:grid-cols-2 gap-5">
              {bookFormFields.map(({
              name,
              label,
              type,
              placeholder
            }) => <div key={name}>
                  <label className="text-xs text-white/40 tracking-[0.1em] uppercase block mb-2" >{label}</label>
                  <input type={type} name={name} value={(form as Record<string, string>)[name]} onChange={handleChange} placeholder={placeholder} className="w-full bg-[#0f172a] border border-slate-800 text-white px-4 py-3 text-sm focus:outline-none focus:border-[#f59e0b]/50 transition-colors"  />
                </div>)}
              <div>
                <label className="text-xs text-white/40 tracking-[0.1em] uppercase block mb-2" >Agency Size</label>
                <select name="service" value={form.service} onChange={handleChange} className="w-full bg-[#0f172a] border border-slate-800 text-white px-4 py-3 text-sm focus:outline-none focus:border-[#f59e0b]/50 transition-colors" >
                  <option value="">Select team size</option>
                  <option value="1-5">1-5 Team Members</option>
                  <option value="6-15">6-15 Team Members</option>
                  <option value="16-50">16-50 Team Members</option>
                  <option value="50+">50+ (Enterprise)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs text-white/40 tracking-[0.1em] uppercase block mb-4" >Preferred Time Slot</label>
              <div className="flex flex-wrap gap-3">
                {timeSlots.map(({
                id,
                time
              }) => <button key={id} type="button" onClick={() => setSelectedSlot(id)} className={`px-5 py-2.5 text-sm border transition-colors ${selectedSlot === id ? 'bg-[#f59e0b] border-[#f59e0b] text-[#020617] font-semibold' : 'border-amber-500/15 text-white/50 hover:border-amber-500/40 hover:text-white'}`} >
                    {time}
                  </button>)}
              </div>
            </div>

            <button type="submit" className="bg-[#f59e0b] text-[#020617] px-10 py-4 text-sm tracking-[0.1em] uppercase font-semibold hover:bg-[#fbbf24] transition-colors flex items-center gap-2 shadow-lg shadow-amber-500/20" >
              <Calendar size={16} />
              <span>Confirm Booking</span>
            </button>
          </form>
        </div>
      </section>
    </div>;
};

/* ─────────────────── PRICING ─────────────────── */

const pricingPlans: {
  name: string;
  price: string;
  period: string;
  desc: string;
  features: string[];
  highlight?: boolean;
  cta: string;
}[] = [{
  name: 'Starter Studio',
  price: '₹2,999',
  period: '/month',
  desc: 'Perfect for solo designers and small teams getting started.',
  features: ['Up to 5 Active Projects', 'Unlimited Client Accounts', 'Automated Approvals', 'Standard Support'],
  cta: 'Start Free Trial'
}, {
  name: 'Growing Agency',
  price: '₹7,499',
  period: '/month',
  desc: 'Everything an ambitious design agency needs to scale.',
  features: ['Unlimited Projects', 'Custom Domain Mapping', 'White-Labeled Portal', 'AI Design Assistant', 'Priority Support'],
  highlight: true,
  cta: 'Start Free Trial'
}, {
  name: 'Enterprise',
  price: 'Custom',
  period: '',
  desc: 'For massive firms needing dedicated infrastructure.',
  features: ['Dedicated AWS Instance', 'Custom Feature Development', 'Dedicated Success Manager', 'On-Premise Deployment Options'],
  cta: 'Talk to Sales'
}];

export const PricingPage: React.FC<PageProps> = ({
  onNavigate
}) => {
  return (
    <div className="bg-[#020617] text-white pt-[72px] min-h-screen">
      <section className="py-24 px-5 sm:px-8 lg:px-12 bg-[#0f172a]">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-[#f59e0b] text-xs tracking-[0.2em] uppercase mb-5" >
            Transparent Pricing
          </p>
          <h1 className="text-5xl md:text-6xl font-light mb-6" >
            Plans that scale with your <em className="italic text-[#f59e0b]">agency.</em>
          </h1>
          <p className="text-white/40 max-w-xl mx-auto leading-relaxed" style={{ letterSpacing: '0.03em' }}>
            No hidden fees. No setup costs. Just clear, predictable pricing billed in INR.
          </p>
        </div>
      </section>
      
      <section className="py-20 px-5 sm:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
          {pricingPlans.map(plan => (
            <div key={plan.name} className={`p-8 border ${plan.highlight ? 'border-[#f59e0b] bg-[#0f172a]/80 shadow-[0_0_30px_rgba(245,158,11,0.1)]' : 'border-amber-500/10 bg-[#0f172a]/40'} flex flex-col`}>
              {plan.highlight && (
                <div className="bg-[#f59e0b] text-[#020617] text-[10px] uppercase tracking-widest font-semibold py-1 px-3 self-start mb-6" >
                  Most Popular
                </div>
              )}
              <h3 className="text-2xl font-light mb-2 text-white" >
                {plan.name}
              </h3>
              <p className="text-white/40 text-sm mb-6 h-10" >
                {plan.desc}
              </p>
              <div className="mb-8">
                <span className="text-4xl font-light text-[#f59e0b]" >{plan.price}</span>
                <span className="text-white/40 text-sm ml-1">{plan.period}</span>
              </div>
              <ul className="space-y-4 mb-10 flex-1">
                {plan.features.map(f => (
                  <li key={f} className="flex items-start gap-3 text-sm text-white/70">
                    <CheckCircle2 size={16} className="text-[#f59e0b] shrink-0 mt-0.5" />
                    <span >{f}</span>
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => onNavigate(plan.cta === 'Talk to Sales' ? 'contact' : 'hub-signup')} 
                className={`w-full py-4 text-sm tracking-[0.1em] uppercase font-semibold transition-colors ${plan.highlight ? 'bg-[#f59e0b] text-[#020617] hover:bg-[#fbbf24]' : 'bg-[#0f172a] border border-amber-500/20 text-white hover:border-amber-500/50 hover:text-[#f59e0b]'}`} 
                
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </section>
      
      <section className="py-16 text-center border-t border-amber-500/10">
        <p className="text-white/40 mb-6 text-sm" >
          Have a unique requirement?
        </p>
        <button onClick={() => onNavigate('contact')} className="text-[#f59e0b] text-xs tracking-[0.15em] uppercase flex items-center justify-center gap-2 hover:gap-3 transition-all mx-auto" >
          <span>Contact Sales</span><ArrowRight size={14} />
        </button>
      </section>
    </div>
  );
};
