import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
type Page = 'home' | 'about' | 'features' | 'portfolio' | 'case-studies' | 'process' | 'testimonials' | 'faqs' | 'contact' | 'book' | 'hub-login' | 'hub-signup' | 'hub-customer' | 'hub-manager' | 'hub-admin' | 'pitch-deck' | 'ai-design' | 'pricing';
interface NavProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}
const navLinks: {
  label: string;
  page: Page;
}[] = [{
  label: 'Features',
  page: 'features'
}, {
  label: 'AI Design Assistant',
  page: 'ai-design'
}, {
  label: 'Success Stories',
  page: 'portfolio'
}, {
  label: 'Case Studies',
  page: 'case-studies'
}, {
  label: 'Pricing',
  page: 'pricing'
}, {
  label: 'About Us',
  page: 'about'
}, {
  label: 'Contact',
  page: 'contact'
}];
export const Nav: React.FC<NavProps> = ({
  currentPage,
  onNavigate
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);
  const isHub = currentPage.startsWith('hub-');
  return <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled || menuOpen ? 'bg-[#020617]/95 backdrop-blur-xl shadow-2xl shadow-black/40' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12" style={{
      width: "1280px",
      maxWidth: "1280px",
      marginLeft: "auto",
      marginRight: "auto",
      display: "flex",
      paddingLeft: "0px",
      paddingRight: "0px"
    }}>
        <div className="flex items-center justify-between h-[72px]" style={{
        width: "1280px",
        maxWidth: "1280px",
        justifyContent: "",
        alignItems: ""
      }}>
          {/* Logo */}
          <button onClick={() => onNavigate('home')} className="flex items-center gap-3 group">
            <div className="w-9 h-9 bg-[#f59e0b] rounded-sm flex items-center justify-center shadow-lg shadow-amber-500/20">
              <span className="text-[#020617] font-bold text-lg tracking-tighter">A</span>
            </div>
            <span className="text-white font-light text-lg tracking-[0.15em] uppercase" >
              Aura
            </span>
          </button>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map(link => <button key={link.page} onClick={() => onNavigate(link.page)} className={`text-xs tracking-[0.12em] uppercase font-medium transition-all duration-200 relative ${currentPage === link.page ? 'text-[#f59e0b]' : 'text-white/60 hover:text-white'}`} >
                {link.label}
                {currentPage === link.page && <span className="absolute -bottom-1 left-0 right-0 h-px bg-[#f59e0b] rounded-full" />}
              </button>)}
          </div>

          {/* Right Actions */}
          <div className="hidden lg:flex items-center gap-5">
            {isHub ? <button onClick={() => onNavigate('home')} className="text-xs tracking-[0.12em] uppercase text-white/60 hover:text-white transition-colors" >
                Public Site
              </button> : <button onClick={() => onNavigate('hub-login')} className="text-xs tracking-[0.12em] uppercase text-white/60 hover:text-white transition-colors" >
                Login
              </button>}
            <button onClick={() => onNavigate('hub-signup')} className="bg-[#f59e0b] text-[#020617] px-6 py-2.5 text-xs tracking-[0.12em] uppercase font-semibold hover:bg-[#fbbf24] transition-colors shadow-md shadow-amber-500/20" >
              Start Free Trial
            </button>
          </div>

          {/* Mobile hamburger */}
          <button className="lg:hidden text-white p-1" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && <motion.div initial={{
        opacity: 0,
        height: 0
      }} animate={{
        opacity: 1,
        height: 'auto'
      }} exit={{
        opacity: 0,
        height: 0
      }} className="lg:hidden bg-[#020617] border-t border-amber-500/10 overflow-hidden">
            <div className="px-5 py-6 flex flex-col gap-5">
              {navLinks.map(link => <button key={link.page} onClick={() => {
            onNavigate(link.page);
            setMenuOpen(false);
          }} className={`text-left text-sm tracking-[0.1em] uppercase font-medium flex items-center gap-2 ${currentPage === link.page ? 'text-[#f59e0b]' : 'text-white/70'}`} >
                  {currentPage === link.page && <span className="w-4 h-px bg-[#f59e0b]" />}
                  {link.label}
                </button>)}
              <div className="h-px bg-amber-500/10 my-1" />
              <button onClick={() => {
            onNavigate('hub-login');
            setMenuOpen(false);
          }} className="text-left text-sm tracking-[0.1em] uppercase text-white/50" >
                Login
              </button>
              <button onClick={() => onNavigate('hub-signup')} className="w-full mt-8 bg-[#f59e0b] text-[#020617] px-6 py-4 text-xs tracking-[0.15em] uppercase font-semibold hover:bg-[#fbbf24] transition-colors" >
                Start Free Trial
              </button>
            </div>
          </motion.div>}
      </AnimatePresence>
    </nav>;
};
