

import React from 'react';
import { Link } from 'react-router-dom';
import { APP_NAME, ROUTES } from '../../constants';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 text-center text-gray-500">
        <p className="text-sm max-w-3xl mx-auto">
          <strong>Disclaimer:</strong> {APP_NAME} is an AI-powered assistant. The information provided is for research and informational purposes only and does not constitute legal advice. You should consult with a qualified legal professional for advice tailored to your specific situation.
        </p>
        <p className="text-xs mt-4">
          Supported file types for analysis: PDF, PNG, JPG. All conversations and analyses can be exported to PDF.
        </p>
         <div className="flex justify-center gap-4 mt-6 text-sm">
            <Link to={ROUTES.DOCS} className="text-brand-primary hover:underline">Documentation</Link>
            <span className="text-gray-400">|</span>
            <Link to={ROUTES.TOS} className="text-brand-primary hover:underline">Terms of Service</Link>
        </div>
        <p className="text-sm mt-4">
           Elby AI by <a href="https://fitotechnology.com" target="_blank" rel="noopener noreferrer" className="text-brand-primary hover:underline">Fito Technology, LLC</a> 2025 &copy; Copyright. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;