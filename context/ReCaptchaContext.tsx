import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';

// This uses an environment variable in production, but falls back to Google's
// public test key for local development.
const RECAPTCHA_SITE_KEY = (process && process.env && process.env.VITE_RECAPTCHA_SITE_KEY) || '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';


interface ReCaptchaContextType {
  isReady: boolean;
  executeRecaptcha: (action: string) => Promise<string>;
}

export const ReCaptchaContext = createContext<ReCaptchaContextType | undefined>(undefined);

// Define grecaptcha on the window object
declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

export const ReCaptchaProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // If the script is already loaded, just set the ready state.
    if (window.grecaptcha && window.grecaptcha.ready) {
      window.grecaptcha.ready(() => setIsReady(true));
      return;
    }
    
    // Avoid adding the script multiple times
    if (document.getElementById('recaptcha-script')) return;

    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;
    script.async = true;
    script.defer = true;
    script.id = 'recaptcha-script';
    
    script.onload = () => {
      if (window.grecaptcha && window.grecaptcha.ready) {
        window.grecaptcha.ready(() => {
          setIsReady(true);
        });
      }
    };

    document.head.appendChild(script);
    
    return () => {
      const scriptTag = document.getElementById('recaptcha-script');
      if (scriptTag) {
        document.head.removeChild(scriptTag);
      }
    };
  }, []);
  
  const executeRecaptcha = useCallback(async (action: string): Promise<string> => {
    if (!isReady || !window.grecaptcha) {
      throw new Error('reCAPTCHA not ready');
    }
    return window.grecaptcha.execute(RECAPTCHA_SITE_KEY, { action });
  }, [isReady]);

  const value = { isReady, executeRecaptcha };

  return (
    <ReCaptchaContext.Provider value={value}>
      {children}
    </ReCaptchaContext.Provider>
  );
};