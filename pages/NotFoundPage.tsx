
import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import { ROUTES } from '../constants';

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center px-4">
      <h1 className="text-6xl font-bold text-brand-primary">404</h1>
      <h2 className="mt-4 text-2xl font-semibold text-brand-dark">Page Not Found</h2>
      <p className="mt-2 text-gray-600">Sorry, the page you are looking for does not exist.</p>
      <Link to={ROUTES.HOME} className="mt-8">
        <Button>Go Back Home</Button>
      </Link>
    </div>
  );
};

export default NotFoundPage;
