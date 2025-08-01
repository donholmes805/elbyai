

import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { ROUTES } from '../constants';
import TwoFactorAuthModal from '../components/auth/TwoFactorAuthModal';
import { User } from '../types';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [is2faModalOpen, set2faModalOpen] = useState(false);
  const [pending2faUser, setPending2faUser] = useState<User | null>(null);

  const { login, verify2FA } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || ROUTES.CHAT;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const loginResult = await login(email, password);
    
    if (loginResult.success) {
      if (loginResult.requires2FA && loginResult.user) {
        setPending2faUser(loginResult.user);
        set2faModalOpen(true);
      } else {
        navigate(from, { replace: true });
      }
    } else {
      setError(loginResult.message || 'Invalid email or password.');
    }
    setIsLoading(false);
  };

  const handle2faVerify = async (code: string): Promise<boolean> => {
    if (!pending2faUser) return false;

    const success = await verify2FA(pending2faUser.id, code);
    if (success) {
      set2faModalOpen(false);
      navigate(from, { replace: true });
    }
    return success;
  };


  return (
    <>
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <Card className="p-8 space-y-6">
            <div>
              <h2 className="text-center text-3xl font-extrabold text-brand-dark">Sign in to your account</h2>
              <p className="mt-2 text-center text-sm text-gray-600">
                Or{' '}
                <Link to={ROUTES.SIGNUP} className="font-medium text-brand-primary hover:text-brand-secondary">
                  create a new account
                </Link>
              </p>
            </div>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <Input
                id="email"
                label="Email address"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
              <Input
                id="password"
                label="Password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
              />
              {error && <p className="text-sm text-red-500">{error}</p>}
              <div>
                <Button type="submit" className="w-full" isLoading={isLoading}>
                  Sign In
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
      <TwoFactorAuthModal
        isOpen={is2faModalOpen}
        onClose={() => set2faModalOpen(false)}
        onVerify={handle2faVerify}
        mode="verify"
      />
    </>
  );
};

export default LoginPage;