
import React, { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { apiService } from '../../services/apiService';
import { RegulatoryUpdate } from '../../types';

const RadarPage: React.FC = () => {
  const [updates, setUpdates] = useState<RegulatoryUpdate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const newsUpdates = await apiService.getRegulatoryNews();
        setUpdates(newsUpdates);
      } catch (err) {
        setError("Failed to load regulatory news. Please try again later.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNews();
  }, []);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold text-brand-dark">Regulatory Radar</h1>
        <p className="mt-2 text-gray-600">A feed of recent global regulatory developments in the digital asset space, powered by AI.</p>
      </div>

      <div className="mt-12 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main Feed */}
        <div className="md:col-span-2 space-y-6">
          {isLoading ? (
            <Card className="p-6 text-center">
                <p>Fetching latest regulatory news...</p>
            </Card>
          ) : error ? (
            <Card className="p-6 text-center text-red-500">
                <p>{error}</p>
            </Card>
          ) : (
            updates.map(update => (
              <Card key={update.id} className="p-6">
                <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-bold text-brand-dark">{update.title}</h2>
                      <p className="text-sm text-gray-500 mt-1">{update.source} - {update.date}</p>
                    </div>
                    <div className="flex gap-2 flex-wrap justify-end flex-shrink-0 ml-4 max-w-[50%]">
                      {update.tags.map(tag => (
                        <span key={tag} className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">{tag}</span>
                      ))}
                    </div>
                </div>
                <p className="mt-4 text-gray-700">{update.summary}</p>
              </Card>
            ))
          )}
        </div>

        {/* Sidebar */}
        <div className="md:col-span-1">
          <Card className="p-6 sticky top-24">
            <h3 className="text-lg font-bold">Get Email Alerts</h3>
            <p className="mt-2 text-sm text-gray-600">Subscribe to receive these updates directly in your inbox.</p>
            <form className="mt-4 space-y-4">
              <Input id="radar-email" type="email" placeholder="your@email.com" />
              <Button className="w-full" disabled>Subscribe (Not functional)</Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RadarPage;