

import React, { useState } from 'react';
import { apiService } from '../../services/apiService';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import { downloadAsPdf } from '../../utils/pdfGenerator';
import { DownloadIcon } from '../../components/icons/IconComponents';
import { useAuth } from '../../hooks/useAuth';
import UpgradeModal from '../../components/UpgradeModal';

const ContractAnalysisPage: React.FC = () => {
  const [contractAddress, setContractAddress] = useState('');
  const [analysisResult, setAnalysisResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isUpgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [featureForUpgrade, setFeatureForUpgrade] = useState('');
  const { checkAndIncrementUsage } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contractAddress) return;

    const usageResult = await checkAndIncrementUsage('blockchainTools');
    if (!usageResult.allowed) {
        setFeatureForUpgrade(usageResult.featureName || 'Blockchain Tools');
        setUpgradeModalOpen(true);
        return;
    }
    
    setIsLoading(true);
    setAnalysisResult('');
    
    const result = await apiService.analyzeContract(contractAddress);
    setAnalysisResult(result);
    setIsLoading(false);
  };
  
  // A simple markdown-to-HTML parser for demonstration
  const renderMarkdown = (text: string) => {
    return text
      .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold my-4">$1</h1>')
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold my-3">$1</h2>')
      .replace(/\*\*(.*)\*\*/g, '<strong>$1</strong>')
      .replace(/`(.*?)`/g, '<code class="bg-gray-200 text-red-600 font-mono px-1 rounded">$1</code>')
      .replace(/\n/g, '<br />');
  };

  return (
    <>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-brand-dark">Smart Contract Howey Analysis</h1>
            <p className="mt-2 text-gray-600">
              Enter an Ethereum-style smart contract address to generate a preliminary IRAC analysis for potential securities law implications.
            </p>
          </div>

          <Card className="mt-8 p-6">
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
              <Input
                id="contract-address"
                placeholder="0x..."
                value={contractAddress}
                onChange={(e) => setContractAddress(e.target.value)}
                className="flex-grow"
                required
              />
              <Button type="submit" isLoading={isLoading} className="sm:w-auto w-full">
                Analyze Contract
              </Button>
            </form>
          </Card>

          {(isLoading || analysisResult) && (
            <div className="mt-8">
              <Card className="p-2">
                <div className="flex justify-between items-center p-4 border-b">
                   <h2 className="text-xl font-bold text-brand-dark">Analysis Report</h2>
                   {analysisResult && !isLoading && (
                      <Button onClick={() => downloadAsPdf('analysis-report', `howey-analysis-${contractAddress.slice(0, 6)}`)} variant="ghost" size="sm">
                         <DownloadIcon className="h-5 w-5 mr-2" />
                         Download PDF
                      </Button>
                   )}
                </div>
                <div id="analysis-report" className="p-6 prose max-w-none">
                  {isLoading ? (
                    <div className="flex justify-center items-center py-12">
                      <div className="text-center">
                        <svg className="animate-spin h-8 w-8 text-brand-primary mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <p className="mt-4 text-gray-600">Generating IRAC analysis... This may take a moment.</p>
                      </div>
                    </div>
                  ) : (
                    <div dangerouslySetInnerHTML={{ __html: renderMarkdown(analysisResult) }} />
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

export default ContractAnalysisPage;