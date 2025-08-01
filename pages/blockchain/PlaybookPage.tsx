

import React, { useState } from 'react';
import { apiService } from '../../services/apiService';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { downloadAsPdf } from '../../utils/pdfGenerator';
import { DownloadIcon } from '../../components/icons/IconComponents';
import { useAuth } from '../../hooks/useAuth';
import UpgradeModal from '../../components/UpgradeModal';

const projectTypes = ["DeFi Protocol", "NFT Marketplace", "Layer 1 Blockchain", "Web3 Gaming Platform", "DAO"];
const jurisdictions = ["United States", "European Union", "Singapore", "Switzerland", "Cayman Islands", "United Arab Emirates"];

const PlaybookPage: React.FC = () => {
  const [projectType, setProjectType] = useState(projectTypes[0]);
  const [jurisdiction, setJurisdiction] = useState(jurisdictions[0]);
  const [playbook, setPlaybook] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isUpgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [featureForUpgrade, setFeatureForUpgrade] = useState('');
  const { checkAndIncrementUsage } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const usageResult = await checkAndIncrementUsage('blockchainTools');
    if (!usageResult.allowed) {
        setFeatureForUpgrade(usageResult.featureName || 'Blockchain Tools');
        setUpgradeModalOpen(true);
        return;
    }

    setIsLoading(true);
    setPlaybook('');
    
    const result = await apiService.generatePlaybook(projectType, jurisdiction);
    setPlaybook(result);
    setIsLoading(false);
  };
  
  const renderMarkdown = (text: string) => {
    return text
      .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold my-4">$1</h1>')
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mt-4 mb-2">$1</h2>')
      .replace(/^- (.*$)/gim, '<li class="ml-4 mb-1">$1</li>')
      .replace(/\*\*(.*)\*\*/g, '<strong>$1</strong>')
      .replace(/`(.*?)`/g, '<code class="bg-gray-200 text-red-600 font-mono px-1 rounded">$1</code>')
      .replace(/\n/g, '<br />');
  };

  return (
    <>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-brand-dark">Compliance Playbook Generator</h1>
            <p className="mt-2 text-gray-600">
              Select your project type and target jurisdiction to generate a high-level compliance playbook.
            </p>
          </div>

          <Card className="mt-8 p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="project-type" className="block text-sm font-medium text-gray-700">Project Type</label>
                  <select id="project-type" value={projectType} onChange={(e) => setProjectType(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm rounded-md">
                    {projectTypes.map(type => <option key={type}>{type}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="jurisdiction" className="block text-sm font-medium text-gray-700">Jurisdiction</label>
                  <select id="jurisdiction" value={jurisdiction} onChange={(e) => setJurisdiction(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm rounded-md">
                    {jurisdictions.map(j => <option key={j}>{j}</option>)}
                  </select>
                </div>
              </div>
              <Button type="submit" isLoading={isLoading} className="w-full">
                Generate Playbook
              </Button>
            </form>
          </Card>

          {(isLoading || playbook) && (
            <div className="mt-8">
              <Card className="p-2">
                  <div className="flex justify-between items-center p-4 border-b">
                   <h2 className="text-xl font-bold text-brand-dark">Compliance Playbook</h2>
                   {playbook && !isLoading && (
                      <Button onClick={() => downloadAsPdf('playbook-content', `compliance-playbook`)} variant="ghost" size="sm">
                         <DownloadIcon className="h-5 w-5 mr-2" />
                         Download PDF
                      </Button>
                   )}
                </div>
                <div id="playbook-content" className="p-6 prose max-w-none">
                  {isLoading ? (
                    <div className="text-center py-12">
                      <p className="text-gray-600">Generating your customized playbook...</p>
                    </div>
                  ) : (
                    <div dangerouslySetInnerHTML={{ __html: renderMarkdown(playbook) }} />
                  )}
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
      <UpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setUpgradeModalOpen(false)}
        featureName={featureForUpgrade}
      />
    </>
  );
};

export default PlaybookPage;