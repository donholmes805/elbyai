import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '../constants';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const VerifyEmailPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { verifyEmail } = useAuth();
  
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [message, setMessage] = useState('Verifying your account...');

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setStatus('error');
      setMessage('No verification token provided. The link may be incomplete.');
      return;
    }

    const performVerification = async () => {
      const result = await verifyEmail(token);
      if (result.success) {
        setStatus('success');
        setMessage('Account activated successfully! Redirecting you to the app...');
        setTimeout(() => {
          navigate(ROUTES.CHAT, { replace: true });
        }, 2500);
      } else {
        setStatus('error');
        setMessage(result.message || 'Failed to verify account. The link may be invalid or expired.');
      }
    };

    performVerification();
  }, [verifyEmail, navigate, searchParams]);

  const getStatusColor = () => {
    switch(status) {
        case 'success': return 'text-green-600';
        case 'error': return 'text-red-600';
        default: return 'text-gray-600';
    }
  }

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4">
      <Card className="p-8 text-center max-w-md w-full">
        <h2 className="text-2xl font-bold text-brand-dark">Account Verification</h2>
        {status === 'verifying' && (
             <svg className="animate-spin h-8 w-8 text-brand-primary mx-auto my-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
        )}
        <p className={`mt-4 text-lg ${getStatusColor()}`}>{message}</p>
        {status === 'error' && (
             <Link to={ROUTES.HOME} className="mt-6 inline-block">
                <Button>Go Back Home</Button>
            </Link>
        )}
      </Card>
    </div>
  );
};

export default VerifyEmailPage;
