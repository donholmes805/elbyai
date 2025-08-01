
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from './ui/Modal';
import Button from './ui/Button';
import { AlertTriangleIcon } from './icons/IconComponents';
import { ROUTES } from '../constants';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureName: string;
}

const UpgradeModal: React.FC<UpgradeModalProps> = ({ isOpen, onClose, featureName }) => {
  const navigate = useNavigate();

  const handleUpgrade = () => {
    onClose();
    navigate(ROUTES.PRICING);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Daily Limit Reached">
      <div className="p-4 flex flex-col items-center text-center gap-4">
        <AlertTriangleIcon className="h-16 w-16 text-yellow-400" />
        <p className="text-lg font-medium text-gray-800">
          You've reached your daily limit for the "{featureName}" feature on the Free Plan.
        </p>
        <p className="text-gray-600">
          To continue using our advanced tools without limits, please upgrade your plan.
        </p>
        <Button onClick={handleUpgrade} variant="primary" size="lg" className="w-full mt-2">
          View Plans
        </Button>
        <Button onClick={onClose} variant="ghost" className="w-full">
          Maybe Later
        </Button>
      </div>
    </Modal>
  );
};

export default UpgradeModal;
