import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Presentation } from 'lucide-react';

type Page = 'home' | 'about' | 'features' | 'portfolio' | 'case-studies' | 'process' | 'testimonials' | 'faqs' | 'contact' | 'book' | 'hub-login' | 'hub-signup' | 'hub-customer' | 'hub-manager' | 'hub-admin' | 'pitch-deck' | 'ai-design' | 'pricing';

interface PitchDeckPageProps {
  onNavigate?: (page: Page) => void;
}

const slides = [
  {
    title: "Aura : A Design Studio Workspace",
    subtitle: "The Premium 'Agency-in-a-Box' Platform",
    content: "Bridging high-end architectural design with seamless, white-glove client collaboration and robust studio management."
  },
  {
    title: "Problem Statement",
    subtitle: "The Disconnect in Premium Design",
    content: "High-end interior and exterior design firms suffer from a severe disconnect between their premium branding and their clunky, disjointed project management processes.\n\nAffected: Design Firm Owners, High-Net-Worth Clients, Vendors.\n\nWhy it matters: Clients paying a premium expect a flawless experience. Relying on WhatsApp chats, scattered emails, and messy Excel sheets leads to approval delays, budget disputes, and eroded trust."
  },
  {
    title: "Current Challenges",
    subtitle: "The Cost of Fragmentation",
    content: "Pain Points:\n- Clients lose track of the latest design iterations and site updates.\n- Approvals on expensive materials and budgets get lost in chat threads.\n- Invoicing is disconnected from project milestones.\n- Estimating materials is manual and error-prone.\n\nRisks: Miscommunications lead to expensive on-site rework. Hundreds of billable hours are wasted on administrative follow-ups instead of actual design."
  },
  {
    title: "Proposed Solution",
    subtitle: "A Unified, Dual-Purpose Platform",
    content: "Our Idea: A single, seamlessly integrated web platform.\n\nPublic Site: Drives lead generation through stunning, high-performance portfolio galleries and automated booking.\nThe Hub: A secure, role-based dashboard for both Studio Staff and Clients.\n\nKey Features: Real-time milestone tracking, integrated billing, centralized communications, and an AI-powered Material Estimator."
  },
  {
    title: "Role-Based Architecture",
    subtitle: "Empowering Every Stakeholder",
    content: "- Customers: A stress-free, luxurious window into their specific projects. They can track site progress, approve documents, view daily logs, and pay invoices.\n- Admin/Management: A bird's-eye 'Admin Console' to manage active projects, monitor studio revenue (₹ CR), assign leads, and track all pending invoices.\n- Delivery Teams: Centralized task lists, client approval tracking, and seamless chat logs.\n- Vendors: Streamlined procurement tracking."
  },
  {
    title: "Core Modules Built",
    subtitle: "A Feature-Complete Studio OS",
    content: "- Project Tracking: Phase-based milestone tracking from Discovery to Execution.\n- Billing & Invoices: Dynamically assign invoices to specific clients and projects, with real-time 'Total Studio Revenue' tracking.\n- Material Estimator: Cutting-edge AI module to quickly calculate material requirements and costs.\n- User Management: Robust access control separating Admins, Staff, Clients, and Vendors.\n- Communications: Integrated messaging to replace disjointed WhatsApp groups."
  },
  {
    title: "Business Impact",
    subtitle: "Efficiency & Revenue Growth",
    content: "- Save 15+ hours per week per project manager.\n- Reduce effort by 40% in chasing client approvals and payments.\n- Higher conversion rate on leads due to the premium digital experience.\n- Eliminate costly material ordering mistakes via the Estimator module.\n- 'The Hub' itself becomes a major Unique Selling Proposition (USP) to close high-ticket clients."
  },
  {
    title: "Technology Stack",
    subtitle: "Enterprise-Grade Foundation",
    content: "Frontend: React, Tailwind CSS (Custom Dark Mode Aesthetics), Lucide Icons, Framer Motion.\nBackend & Database: Node.js, Prisma ORM, PostgreSQL.\nIntegration Ready: Built to connect with modern payment gateways (Stripe) and AI APIs.\nDesign Language: Consistent, premium UI/UX ensuring the software feels as luxurious as the spaces being designed."
  },
  {
    title: "Future Roadmap & AI",
    subtitle: "Smart Enhancements",
    content: "- Generative AI for Concept Variations: Toggle AI-generated style variations directly in The Hub.\n- Predictive Analytics: Analyze past project timelines and automatically flag potential delays.\n- Document Intelligence: Extract line items and costs from vendor PDFs to update budget trackers automatically.\n- 3D Integrations: In-browser 3D rendering interactions (Three.js) for virtual walk-throughs."
  },
  {
    title: "Conclusion",
    subtitle: "Why Aura Wins",
    content: "Innovation: Consolidates a fragmented workflow into a beautifully branded, single-pane-of-glass experience.\nBusiness Value: Directly solves a high-cost pain point in a high-margin industry.\nVision: Starting as a bespoke agency tool, Aura has the foundation to eventually be white-labeled as the premier SaaS product for boutique architecture firms globally."
  }
];

export const PitchDeckPage: React.FC<PitchDeckPageProps> = ({ onNavigate }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) setCurrentSlide(currentSlide + 1);
  };

  const prevSlide = () => {
    if (currentSlide > 0) setCurrentSlide(currentSlide - 1);
  };

  // Keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide]);

  return (
    <div className="bg-[#020617] text-white min-h-screen pt-[72px] flex flex-col items-center justify-center p-5 sm:p-8">
      <div className="w-full max-w-5xl bg-[#0f172a] border border-amber-500/10 rounded-xl overflow-hidden shadow-2xl shadow-black relative min-h-[600px] flex flex-col">
        
        {/* Header */}
        <div className="px-8 py-5 border-b border-amber-500/10 flex justify-between items-center bg-[#020617]/50">
          <div className="flex items-center gap-3">
            <Presentation className="text-[#f59e0b]" size={24} />
            <span className="font-medium tracking-widest uppercase text-sm" >
              Aura Pitch Deck
            </span>
          </div>
          <span className="text-white/40 text-sm font-medium">
            Slide {currentSlide + 1} of {slides.length}
          </span>
        </div>

        {/* Slide Content */}
        <div className="flex-grow flex items-center justify-center p-8 sm:p-16 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-3xl"
            >
              <h3 className="text-[#f59e0b] text-sm tracking-[0.2em] uppercase mb-4 font-semibold" >
                {slides[currentSlide].subtitle}
              </h3>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light leading-tight mb-8" >
                {slides[currentSlide].title}
              </h2>
              <div className="text-white/70 text-lg leading-relaxed whitespace-pre-line" >
                {slides[currentSlide].content}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="px-8 py-6 border-t border-amber-500/10 bg-[#020617]/50 flex justify-between items-center">
          <button
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className={`flex items-center gap-2 px-6 py-3 text-sm tracking-[0.1em] uppercase transition-colors ${currentSlide === 0 ? 'text-white/20 cursor-not-allowed' : 'text-white hover:text-[#f59e0b]'}`}
            
          >
            <ArrowLeft size={16} /> Previous
          </button>
          
          <div className="flex gap-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${idx === currentSlide ? 'bg-[#f59e0b] w-6' : 'bg-white/20 hover:bg-white/40'}`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={nextSlide}
            disabled={currentSlide === slides.length - 1}
            className={`flex items-center gap-2 px-6 py-3 text-sm tracking-[0.1em] uppercase transition-colors ${currentSlide === slides.length - 1 ? 'text-white/20 cursor-not-allowed' : 'bg-[#f59e0b] text-[#020617] font-semibold hover:bg-[#fbbf24]'}`}
            
          >
            Next <ArrowRight size={16} />
          </button>
        </div>
        
      </div>
    </div>
  );
};
