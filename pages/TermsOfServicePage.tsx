
import React from 'react';
import { AlertTriangleIcon } from '../components/icons/IconComponents';

const TermsOfServicePage: React.FC = () => {
  return (
    <div className="bg-white py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-extrabold text-brand-dark text-center">Terms of Service</h1>
          <p className="text-center text-gray-500 mt-2">Last Updated: August 1, 2024</p>

          <div className="my-8 p-4 bg-red-50 border-l-4 border-red-400 rounded-r-lg">
              <div className="flex">
                  <div className="flex-shrink-0">
                      <AlertTriangleIcon className="h-6 w-6 text-red-500" />
                  </div>
                  <div className="ml-3">
                      <p className="text-sm text-red-700">
                          <strong>Legal Notice:</strong> This is a general template for a Terms of Service agreement and is not a substitute for legal advice. You should consult with a qualified attorney to ensure your TOS is compliant and tailored to your specific business needs.
                      </p>
                  </div>
              </div>
          </div>

          <div className="prose prose-lg max-w-none text-gray-700">
            <p>
              Welcome to Elby AI ("we," "us," or "our"). These Terms of Service ("Terms") govern your access to and use of our website, applications, and services (collectively, the "Service"). By accessing or using the Service, you agree to be bound by these Terms.
            </p>

            <h2 className="text-2xl font-bold text-brand-dark mt-8">1. No Legal Advice Disclaimer</h2>
            <p>
              <strong>Elby AI is not a law firm and does not provide legal advice.</strong> The Service provides AI-generated information for informational and educational purposes only. No information provided by the Service should be construed as legal advice, and no attorney-client relationship is created through your use of the Service. You should always consult with a licensed and qualified attorney for advice on your specific legal issues.
            </p>

            <h2 className="text-2xl font-bold text-brand-dark mt-8">2. User Accounts</h2>
            <p>
              To access most features of the Service, you must register for an account. You agree to provide accurate, current, and complete information during the registration process. You are responsible for safeguarding your password and for all activities that occur under your account. You must notify us immediately of any unauthorized use of your account.
            </p>
            
            <h2 className="text-2xl font-bold text-brand-dark mt-8">3. Subscriptions, Payments, and Cancellation</h2>
            <p>
                The Service may be provided on a paid subscription basis. All payments are processed securely through PayPal. By purchasing a subscription, you agree to recurring monthly payments.
            </p>
            <ul>
                <li><strong>Recurring Billing:</strong> Your subscription will automatically renew each month, and your PayPal account will be charged the subscription fee for the next period.</li>
                <li><strong>Cancellation Policy:</strong> You may cancel your recurring subscription at any time through your PayPal account dashboard under "Automatic Payments."</li>
                <li><strong>No Refunds:</strong> Cancellations will take effect at the end of your current billing cycle. You will not be charged for subsequent cycles. We do not offer refunds or credits for partial subscription periods or unused services. All sales are final.</li>
            </ul>

            <h2 className="text-2xl font-bold text-brand-dark mt-8">4. Usage Limits</h2>
             <p>
              Users on the free plan are subject to daily usage limits on certain features as described on our Pricing page. These limits reset every 24 hours. Paid plans offer expanded or unlimited access as detailed in their descriptions.
            </p>

            <h2 className="text-2xl font-bold text-brand-dark mt-8">5. Prohibited Conduct</h2>
            <p>You agree not to use the Service to:</p>
            <ul>
              <li>Violate any applicable law or regulation.</li>
              <li>Infringe the intellectual property or other rights of third parties.</li>
              <li>Transmit any virus, malware, or other harmful computer code.</li>
              <li>Attempt to reverse-engineer, decompile, or otherwise discover the source code of the Service.</li>
              <li>Use the Service to build a competitive product or service.</li>
            </ul>

            <h2 className="text-2xl font-bold text-brand-dark mt-8">6. Intellectual Property</h2>
            <p>
              All rights, title, and interest in and to the Service (excluding content provided by users) are and will remain the exclusive property of Fito Technology, LLC and its licensors. The Service is protected by copyright, trademark, and other laws of both the United States and foreign countries.
            </p>

            <h2 className="text-2xl font-bold text-brand-dark mt-8">7. Termination</h2>
            <p>
              We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
            </p>

            <h2 className="text-2xl font-bold text-brand-dark mt-8">8. Disclaimer of Warranties and Limitation of Liability</h2>
            <p>
              The Service is provided on an "AS IS" and "AS AVAILABLE" basis. We make no warranties, express or implied, regarding the accuracy, reliability, or completeness of the information provided. In no event shall Elby AI be liable for any indirect, incidental, special, consequential, or punitive damages arising out of your use of the Service.
            </p>

            <h2 className="text-2xl font-bold text-brand-dark mt-8">9. Changes to These Terms</h2>
            <p>
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide notice of any changes by posting the new Terms on this page. Your continued use of the Service after any such change constitutes your acceptance of the new Terms.
            </p>

            <h2 className="text-2xl font-bold text-brand-dark mt-8">10. Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us at <a href="mailto:fitotechnologyllc@gmail.com" className="text-brand-primary hover:underline">fitotechnologyllc@gmail.com</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfServicePage;
