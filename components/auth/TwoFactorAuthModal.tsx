

import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';

interface TwoFactorAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: (code: string) => Promise<boolean>;
  mode?: 'setup' | 'verify';
}

const TwoFactorAuthModal: React.FC<TwoFactorAuthModalProps> = ({ isOpen, onClose, onVerify, mode = 'verify' }) => {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  // Step 1: Scan QR (only for setup). Step 2: Enter code.
  const [step, setStep] = useState(mode === 'setup' ? 1 : 2);

  // Reset component state when it's opened or the mode changes
  useEffect(() => {
    if (isOpen) {
      setStep(mode === 'setup' ? 1 : 2);
      setCode('');
      setError('');
      setIsLoading(false);
    }
  }, [isOpen, mode]);

  const handleVerify = async () => {
    setIsLoading(true);
    setError('');
    const success = await onVerify(code);
    if (!success) {
      setError('Invalid code. Please try again.');
    }
    setIsLoading(false);
  };
  
  const handleContinue = () => {
    setStep(2);
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleVerify();
    }
  }
  
  const title = step === 1 && mode === 'setup' 
    ? "Set Up Two-Factor Authentication" 
    : "Enter Verification Code";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="p-4 flex flex-col items-center gap-4">
        {step === 1 && mode === 'setup' ? (
          <>
            <p className="text-center text-gray-600">Scan the QR code with your authenticator app (e.g., Google Authenticator, Authy).</p>
            <div className="w-48 h-48 bg-gray-100 flex items-center justify-center text-center p-4 rounded-lg my-2">
              <p className="text-sm text-gray-500">In a real application, a unique QR code would be displayed here for you to scan.</p>
            </div>
            <p className="text-center text-gray-600">After scanning, click Continue and enter the generated 6-digit code to verify.</p>
            <Button onClick={handleContinue} variant="primary" className="w-full">Continue</Button>
          </>
        ) : (
          <>
            <p className="text-center text-gray-600">Enter the 6-digit code from your authenticator app.</p>
            <Input
              id="2fa-code"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="123456"
              maxLength={6}
              className="text-center tracking-widest text-lg"
              onKeyPress={handleKeyPress}
              autoFocus
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button onClick={handleVerify} isLoading={isLoading} className="w-full">
              Verify
            </Button>
          </>
        )}
      </div>
    </Modal>
  );
};

export default TwoFactorAuthModal;