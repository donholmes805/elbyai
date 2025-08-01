
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // The API key provided by the execution environment.
      readonly API_KEY: string;
      // Env var for the PayPal business email.
      readonly VITE_PAYPAL_BUSINESS_EMAIL?: string;
      // Env var for the reCAPTCHA site key.
      readonly VITE_RECAPTCHA_SITE_KEY?: string;
    }
  }
}

// This export statement is required to make this file a module
// and allow augmenting the global namespace.
export {};
