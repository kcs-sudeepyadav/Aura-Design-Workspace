import React from 'react';
import { Instagram, Linkedin, Twitter } from 'lucide-react';
type Page = 'home' | 'about' | 'features' | 'portfolio' | 'case-studies' | 'process' | 'testimonials' | 'faqs' | 'contact' | 'book' | 'hub-login' | 'hub-signup' | 'hub-customer' | 'hub-manager' | 'hub-admin' | 'pitch-deck' | 'ai-design' | 'pricing';
interface FooterProps {
  onNavigate: (page: Page) => void;
}
const footerCols: {
  title: string;
  links: {
    label: string;
    page: Page;
  }[];
}[] = [{
  title: 'Product',
  links: [{
    label: 'Features',
    page: 'features'
  }, {
    label: 'Pricing',
    page: 'pricing'
  }, {
    label: 'AI Design Assistant',
    page: 'ai-design'
  }, {
    label: 'Agency Login',
    page: 'hub-login'
  }]
}, {
  title: 'Solutions',
  links: [{
    label: 'For Solo Designers',
    page: 'features'
  }, {
    label: 'For Agencies',
    page: 'features'
  }, {
    label: 'For Enterprise',
    page: 'contact'
  }, {
    label: 'White-Labeling',
    page: 'features'
  }]
}, {
  title: 'Resources',
  links: [{
    label: 'Case Studies',
    page: 'case-studies'
  }, {
    label: 'Success Stories',
    page: 'portfolio'
  }, {
    label: 'FAQs',
    page: 'faqs'
  }, {
    label: 'Help Center',
    page: 'faqs'
  }]
}, {
  title: 'Company',
  links: [{
    label: 'About Us',
    page: 'about'
  }, {
    label: 'Contact Sales',
    page: 'contact'
  }, {
    label: 'Book a Demo',
    page: 'book'
  }, {
    label: 'Sign In',
    page: 'hub-login'
  }]
}];
export const Footer: React.FC<FooterProps> = ({
  onNavigate
}) => {
  return <footer className="bg-[#020617] text-white/40 border-t border-amber-500/10">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 pt-16 pb-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-14">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 bg-[#f59e0b] rounded-sm flex items-center justify-center shadow-md shadow-amber-500/20">
                <span className="text-[#020617] font-bold text-base">A</span>
              </div>
              <span className="text-white font-light text-base tracking-[0.15em] uppercase" >
                Aura
              </span>
            </div>
            <p className="text-xs leading-relaxed text-white/30 mb-6" style={{
            letterSpacing: '0.04em'
          }}>
              The ultimate client portal and operations platform for design agencies.
            </p>
            <div className="flex gap-4">
              {[Instagram, Linkedin, Twitter].map((Icon, i) => <button key={i} className="text-white/30 hover:text-[#f59e0b] transition-colors">
                  <Icon size={16} />
                </button>)}
            </div>
          </div>

          {/* Nav columns */}
          {footerCols.map(col => <div key={col.title}>
              <h4 className="text-white text-xs tracking-[0.15em] uppercase font-semibold mb-4" >
                {col.title}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map(link => <li key={link.label}>
                    <button onClick={() => onNavigate(link.page)} className="text-xs text-white/40 hover:text-[#f59e0b] transition-colors" style={{
                letterSpacing: '0.04em'
              }}>
                      {link.label}
                    </button>
                  </li>)}
              </ul>
            </div>)}
        </div>

        <div className="border-t border-amber-500/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-[11px] text-white/25 tracking-wide" >
            &copy; 2026 Aura : A Design Studio Workspace. All rights reserved.
          </p>
          <p className="text-[11px] text-white/25 tracking-wide" >
            Built by designers &mdash; Scaled by technology
          </p>
        </div>
      </div>
    </footer>;
};
