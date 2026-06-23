import React, { useState, useEffect } from 'react';
import { Nav } from './Nav';
import { Footer } from './Footer';
import { HomePage, AboutPage, ServicesPage, PortfolioPage, CaseStudiesPage, ProcessPage, TestimonialsPage, FaqsPage, ContactPage, BookPage, PricingPage } from './PublicPages';
import { HubLoginPage, HubSignupPage, HubCustomerPage, HubManagerPage, HubAdminPage } from './HubPages';
import { PitchDeckPage } from './PitchDeckPage';
import { PublicAiDesignPage } from './PublicPages';
type Page = 'home' | 'about' | 'features' | 'portfolio' | 'case-studies' | 'process' | 'testimonials' | 'faqs' | 'contact' | 'book' | 'hub-login' | 'hub-signup' | 'hub-customer' | 'hub-manager' | 'hub-admin' | 'pitch-deck' | 'ai-design' | 'pricing';
const hubPages: Page[] = ['hub-login', 'hub-signup', 'hub-customer', 'hub-manager', 'hub-admin'];
const publicPageComponents: Record<string, React.FC<{
  onNavigate: (page: Page) => void;
}>> = {
  home: HomePage,
  about: AboutPage,
  features: ServicesPage,
  portfolio: PortfolioPage,
  'case-studies': CaseStudiesPage,
  process: ProcessPage,
  testimonials: TestimonialsPage,
  faqs: FaqsPage,
  contact: ContactPage,
  book: BookPage,
  'pitch-deck': PitchDeckPage,
  'ai-design': PublicAiDesignPage,
  pricing: PricingPage
};
export const DesignStudioHomepage: React.FC = () => {
  // Initialize state from hash if it exists, otherwise default to 'home'
  const getInitialPage = (): Page => {
    const hash = window.location.hash.replace('#', '');
    return (hash as Page) || 'home';
  };

  const [currentPage, setCurrentPage] = useState<Page>(getInitialPage);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      setCurrentPage((hash as Page) || 'home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (page: Page) => {
    if (page === currentPage) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    window.location.hash = page;
  };
  const isHub = hubPages.includes(currentPage);
  if (currentPage === 'hub-login') return <HubLoginPage onNavigate={navigate} />;
  if (currentPage === 'hub-signup') return <HubSignupPage onNavigate={navigate} />;
  if (currentPage === 'hub-customer') return <HubCustomerPage onNavigate={navigate} />;
  if (currentPage === 'hub-manager') return <HubManagerPage onNavigate={navigate} />;
  if (currentPage === 'hub-admin') return <HubAdminPage onNavigate={navigate} />;
  const PageComponent = publicPageComponents[currentPage] ?? HomePage;
  return <div className="min-h-screen bg-[#020617]">
      <Nav currentPage={currentPage} onNavigate={navigate} />
      <PageComponent onNavigate={navigate} />
      <Footer onNavigate={navigate} />
    </div>;
};
