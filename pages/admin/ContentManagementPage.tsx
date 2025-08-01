
import React, { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useContent } from '../../hooks/useContent';

const ContentManagementPage: React.FC = () => {
  const { content, updateContent } = useContent();
  const [formData, setFormData] = useState(content);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    // If the content in the context changes (e.g., loaded initially), update the form data.
    setFormData(content);
  }, [content]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setIsSaving(true);
    setShowSuccess(false);
    
    updateContent(formData);
    
    setTimeout(() => {
        setIsSaving(false);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000); // Hide success message after 2s
    }, 500); // Simulate network delay
  };

  const hasChanges = JSON.stringify(content) !== JSON.stringify(formData);

  return (
    <div>
      <h1 className="text-3xl font-bold text-brand-dark mb-6">Content Management</h1>
      <Card className="p-6">
        <div className="space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-brand-dark border-b pb-2 mb-4">Homepage Hero Section</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="homepageHeroTitle" className="block text-sm font-medium text-gray-700">
                  Hero Title
                </label>
                <input
                  type="text"
                  name="homepageHeroTitle"
                  id="homepageHeroTitle"
                  value={formData.homepageHeroTitle}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm"
                />
                <p className="mt-1 text-xs text-gray-500">
                    Wrap a word in double asterisks (e.g., **word**) to highlight it with the brand color.
                </p>
              </div>
              <div>
                <label htmlFor="homepageHeroSubtitle" className="block text-sm font-medium text-gray-700">
                  Hero Subtitle
                </label>
                <textarea
                  name="homepageHeroSubtitle"
                  id="homepageHeroSubtitle"
                  rows={4}
                  value={formData.homepageHeroSubtitle}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm"
                />
              </div>
            </div>
          </section>
          
          <div className="flex justify-end items-center gap-4">
            {showSuccess && <span className="text-green-600 text-sm">Changes saved successfully!</span>}
            <Button onClick={handleSave} isLoading={isSaving} disabled={!hasChanges}>
              Save Changes
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ContentManagementPage;
