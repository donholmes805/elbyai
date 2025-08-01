import React from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';
import { SubscriptionPlan } from '../types';

const CheckCircleIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
    </svg>
);


const PricingPage: React.FC = () => {
  const { user } = useAuth();
  const PAYPAL_BUSINESS_EMAIL = (process && process.env && process.env.VITE_PAYPAL_BUSINESS_EMAIL) || 'fitotechnologyllc@gmail.com';

  const plans = [
    {
      name: 'General Legal AI',
      price: { intro: 14.99, standard: 24.99 },
      planEnum: SubscriptionPlan.GENERAL,
      features: [
        'Unlimited General AI Queries',
        'Chat with AI Personas',
        'Save & Export Chat History',
        'Standard Email Support',
        '5 Blockchain Tool Uses/Day'
      ],
      isFeatured: false,
    },
    {
      name: 'Full Access',
      price: { intro: 34.99, standard: 49.99 },
      planEnum: SubscriptionPlan.FULL_ACCESS,
      features: [
        'All features from General plan',
        'Unlimited Blockchain Tool Uses',
        'Smart Contract Howey Analysis',
        'Compliance Playbook Generator',
        'Regulatory Radar Access',
        'Priority Email & Chat Support',
      ],
      isFeatured: true,
    }
  ];
  
  const createPaypalLink = (plan: typeof plans[0]) => {
    const params = new URLSearchParams({
      cmd: '_xclick-subscriptions',
      business: PAYPAL_BUSINESS_EMAIL,
      item_name: plan.name,
      a3: plan.price.standard.toFixed(2), // Recurring price
      p3: '1', // Per 1 ...
      t3: 'M', // ... Month
      src: '1', // Recurring payments
      sra: '1', // Re-attempt on failure
      no_note: '1',
      currency_code: 'USD',
      // You can add return URLs here, e.g.,
      // return: 'https://your-app.com/payment-success',
      // cancel_return: 'https://your-app.com/pricing'
    });
    return `https://www.paypal.com/cgi-bin/webscr?${params.toString()}`;
  }


  return (
    <div className="bg-brand-light py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-brand-dark">The Right Plan for Your Legal Needs</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Choose a plan that scales with your requirements, from essential AI assistance to a comprehensive suite of blockchain legal tools.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan) => (
            <Card key={plan.name} className={`p-8 flex flex-col relative ${plan.isFeatured ? 'border-2 border-brand-primary shadow-2xl' : 'border'}`}>
              {plan.isFeatured && (
                <div className="absolute top-0 -translate-y-1/2 bg-brand-primary text-white text-sm font-semibold px-4 py-1 rounded-full">
                  Featured
                </div>
              )}
              {user?.plan === plan.planEnum && (
                <div className="absolute top-0 right-4 -translate-y-1/2 bg-green-500 text-white text-sm font-semibold px-4 py-1 rounded-full">
                  Current Plan
                </div>
              )}
              <h3 className="text-2xl font-bold text-brand-dark">{plan.name}</h3>
              <div className="mt-4">
                <span className="text-5xl font-extrabold text-brand-dark">${plan.price.intro}</span>
                <span className="text-lg text-gray-500">/mo</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">For the first 3 months. Renews at ${plan.price.standard}/mo.</p>

              <ul className="mt-8 space-y-4 text-gray-600 flex-grow">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <CheckCircleIcon className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <div className="mt-10">
                 <a
                    href={createPaypalLink(plan)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={user?.plan === plan.planEnum ? 'pointer-events-none' : ''}
                    aria-disabled={user?.plan === plan.planEnum}
                 >
                    <Button 
                      variant={plan.isFeatured ? 'primary' : 'secondary'}
                      size="lg"
                      className="w-full"
                      disabled={user?.plan === plan.planEnum}
                    >
                      {user?.plan === plan.planEnum ? 'Current Plan' : 'Subscribe with PayPal'}
                    </Button>
                 </a>
              </div>
            </Card>
          ))}
        </div>
        <p className="text-center text-gray-500 mt-8 text-sm">
            You can cancel your subscription at any time from your PayPal account.
        </p>
      </div>
    </div>
  );
};

export default PricingPage;