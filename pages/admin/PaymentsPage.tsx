
import React from 'react';
import Card from '../../components/ui/Card';
import { AlertTriangleIcon } from '../../components/icons/IconComponents';
import Button from '../../components/ui/Button';

const PaymentsPage: React.FC = () => {
  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold text-brand-dark">Payments & Subscriptions</h1>
        <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Super Admin Only</span>
      </div>
      <Card className="p-6">
        <div className="flex items-center gap-3 text-blue-800 bg-blue-50 p-4 rounded-lg">
            <AlertTriangleIcon className="h-8 w-8 flex-shrink-0 text-blue-500" />
            <p><strong>Payment Provider: PayPal</strong><br/>This interface is for informational purposes. All subscription management, including viewing subscribers, revenue, and handling disputes, must be done through your PayPal Business account.</p>
        </div>
        <div className="mt-6 text-center">
            <a href="https://www.paypal.com/businessprofile/mytools/subscription" target="_blank" rel="noopener noreferrer">
                <Button variant="primary">
                    Manage Subscriptions on PayPal
                </Button>
            </a>
            <p className="text-gray-500 mt-2 text-sm">This will take you to your PayPal business account.</p>
        </div>
      </Card>
    </div>
  );
};

export default PaymentsPage;
