import { useContext } from 'react';
import { ReCaptchaContext } from '../context/ReCaptchaContext';

export const useReCaptcha = () => {
  const context = useContext(ReCaptchaContext);
  if (!context) {
    throw new Error('useReCaptcha must be used within a ReCaptchaProvider');
  }
  return context;
};
