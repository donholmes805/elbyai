

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useReCaptcha } from '../hooks/useReCaptcha';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { ROUTES } from '../constants';

const SignupPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);

  const { signup } = useAuth();
  const { executeRecaptcha, isReady } = useReCaptcha();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }
    
    if (!isReady) {
        setError('Security check is not ready. Please wait a moment and try again.');
        return;
    }

    setIsLoading(true);
    setError('');
    
    try {
        const recaptchaToken = await executeRecaptcha('signup');
        const signupResult = await signup(email, password, recaptchaToken);
        
        if (signupResult.success) {
          setSignupSuccess(true);
        } else {
          setError(signupResult.message || 'An error occurred during signup.');
        }
    } catch (err) {
        console.error("reCAPTCHA or Signup Error:", err);
        setError('Failed security check. Please refresh and try again.');
    } finally {
        setIsLoading(false);
    }
  };

  if (signupSuccess) {
    return (
        <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md">
                <Card className="p-8 space-y-6 text-center">
                     <h2 className="text-center text-3xl font-extrabold text-brand-dark">Check Your Email</h2>
                     <p className="mt-2 text-center text-lg text-gray-600">
                        We've sent a verification link to <strong>{email}</strong>.
                     </p>
                     <p className="text-gray-500 text-sm">
                        Please click the link in the email to activate your account.
                        <br/>
                        (For this demo, the verification link is logged to the browser console for you to copy and use.)
                     </p>
                     <Button onClick={() => navigate(ROUTES.LOGIN)}>Back to Sign In</Button>
                </Card>
            </div>
        </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <Card className="p-8 space-y-6">
          <div>
            <h2 className="text-center text-3xl font-extrabold text-brand-dark">Create your account</h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link to={ROUTES.LOGIN} className="font-medium text-brand-primary hover:text-brand-secondary">
                Sign in
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
            />
            <Input
              id="password"
              label="Password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
             <Input
              id="confirm-password"
              label="Confirm Password"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <div>
              <Button type="submit" className="w-full" isLoading={isLoading} disabled={!isReady}>
                {isReady ? 'Create Account' : 'Security Check Loading...'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default SignupPage;
