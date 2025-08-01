
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import { ROUTES } from '../../constants';
import { ShieldCheckIcon, AdminIcon, LogoIcon } from '../../components/icons/IconComponents';

const tools = [
  {
    title: 'Smart Contract Analysis',
    description: 'Run a preliminary IRAC analysis on any smart contract to identify potential securities law risks based on the Howey Test.',
    link: ROUTES.CONTRACT_ANALYSIS,
    icon: <ShieldCheckIcon className="h-12 w-12 text-brand-primary" />
  },
  {
    title: 'Compliance Playbook',
    description: 'Generate a customized compliance playbook for your blockchain project based on project type and jurisdiction.',
    link: ROUTES.PLAYBOOK,
    icon: <AdminIcon className="h-12 w-12 text-brand-primary" />
  },
  {
    title: 'Regulatory Radar',
    description: 'Stay updated with the latest regulatory news and enforcement actions in the digital asset space.',
    link: ROUTES.RADAR,
    icon: <LogoIcon className="h-12 w-12 text-brand-primary" />
  }
];

const BlockchainHomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-brand-dark">Blockchain Legal Module</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
          Specialized AI tools designed to help navigate the complex regulatory landscape of Web3 and digital assets.
        </p>
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {tools.map((tool) => (
          <Card key={tool.title} onClick={() => navigate(tool.link)} className="p-8 flex flex-col items-center text-center">
            {tool.icon}
            <h3 className="mt-6 text-2xl font-bold text-brand-dark">{tool.title}</h3>
            <p className="mt-2 text-gray-600 flex-grow">{tool.description}</p>
            <span className="mt-6 text-brand-primary font-semibold hover:underline">
              Use Tool &rarr;
            </span>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BlockchainHomePage;
