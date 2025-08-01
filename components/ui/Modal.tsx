
import React, { Fragment } from 'react';
import { XIcon } from '../icons/IconComponents';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'sm:max-w-sm',
    md: 'sm:max-w-md',
    lg: 'sm:max-w-lg',
    xl: 'sm:max-w-xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className={`relative bg-white rounded-lg shadow-xl transform transition-all sm:my-8 sm:w-full ${sizeClasses[size]}`}>
        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 rounded-t-lg">
          <div className="sm:flex sm:items-start">
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
              <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                {title}
              </h3>
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="absolute top-0 right-0 mt-4 mr-4 text-gray-400 hover:text-gray-600"
        >
          <XIcon className="h-6 w-6" />
        </button>
        <div className="px-4 py-2 sm:px-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
