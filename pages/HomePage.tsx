
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { ROUTES } from '../constants';
import InteractiveDemo from '../components/home/InteractiveDemo';
import { useContent } from '../hooks/useContent';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { content } = useContent();

  const renderHeroTitle = () => {
    if (!content?.homepageHeroTitle) return null;
    const parts = content.homepageHeroTitle.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <span key={index} className="text-brand-primary">{part.slice(2, -2)}</span>;
      }
      return <React.Fragment key={index}>{part}</React.Fragment>;
    });
  };


  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Hero Section */}
      <section className="text-center py-12">
        <h1 className="text-4xl md:text-6xl font-extrabold text-brand-dark tracking-tight">
          {renderHeroTitle()}
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
          {content?.homepageHeroSubtitle}
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" onClick={() => navigate(ROUTES.SIGNUP)}>
              Start Your Free Account
            </Button>
            <Button size="lg" variant="ghost" onClick={() => navigate(ROUTES.PRICING)}>
                View Plans
            </Button>
        </div>
         <p className="mt-4 text-sm text-gray-500">
            Get 5 general AI queries & 3 blockchain tool uses daily — no credit card required.
        </p>
      </section>

      {/* Feature Cards Section */}
      <section className="mt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <Card onClick={() => navigate(ROUTES.PRICING)} className="p-8">
            <h3 className="text-2xl font-bold text-brand-dark">General Legal AI</h3>
            <p className="mt-2 text-gray-600">
              Engage with our AI assistant for legal research, document summarization, and case analysis. Perfect for everyday legal tasks and gaining quick understanding of complex topics.
            </p>
            <div className="mt-4 text-brand-primary font-semibold">Learn More &rarr;</div>
          </Card>
          <Card onClick={() => navigate(ROUTES.PRICING)} className="p-8 border-2 border-brand-primary">
            <h3 className="text-2xl font-bold text-brand-dark">Blockchain Legal Module</h3>
            <p className="mt-2 text-gray-600">
              A specialized toolkit for the Web3 space. Analyze smart contracts for securities law risks, generate compliance playbooks for your jurisdiction, and stay ahead of regulatory changes.
            </p>
            <div className="mt-4 text-brand-primary font-semibold">Explore Web3 Tools &rarr;</div>
          </Card>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section className="mt-24 py-16 bg-brand-light rounded-xl">
        <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-brand-dark">
                Experience Elby AI in Action
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-md text-gray-600">
                Ask a question below to get a real-time response from our AI. (Demo is limited to two questions)
            </p>
        </div>
        <InteractiveDemo />
      </section>
    </div>
  );
};

export default HomePage;