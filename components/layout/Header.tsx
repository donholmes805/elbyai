

import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { APP_NAME, ROUTES } from '../../constants';
import { SubscriptionPlan } from '../../types';
import Button from '../ui/Button';
import { LogoIcon, ChevronDownIcon, UserIcon, LogoutIcon, AdminIcon, ShieldCheckIcon } from '../icons/IconComponents';
import TwoFactorAuthModal from '../auth/TwoFactorAuthModal';

const Header: React.FC = () => {
  const { isAuthenticated, user, logout, setup2FA } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [is2faSetupModalOpen, set2faSetupModalOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate(ROUTES.HOME);
  };

  const handle2faSetupVerify = async (code: string): Promise<boolean> => {
    if (!user) return false;
    const success = await setup2FA(user.id, code);
    if (success) {
        set2faSetupModalOpen(false);
        // User state will be updated via AuthContext, so the UI will refresh automatically.
    }
    return success;
  };

  const handleEnable2faClick = () => {
    set2faSetupModalOpen(true);
    setDropdownOpen(false);
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to={ROUTES.HOME} className="flex items-center gap-2 text-brand-primary">
              <LogoIcon className="h-8 w-8" />
              <span className="text-2xl font-bold">{APP_NAME}</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link to={ROUTES.PRICING} className="text-sm font-medium text-gray-600 hover:text-brand-primary">
                Pricing
              </Link>
              {isAuthenticated && user && (user.role === 'sub-admin' || user.role === 'super-admin') && (
                <Link to={ROUTES.ADMIN} className="text-sm font-medium text-gray-600 hover:text-brand-primary">
                  Admin Dashboard
                </Link>
              )}
              {isAuthenticated && user ? (
                <div className="relative" ref={dropdownRef}>
                  <button onClick={() => setDropdownOpen(!isDropdownOpen)} className="flex items-center gap-2 rounded-full p-1 bg-gray-100 hover:bg-gray-200">
                    <span className="text-sm font-medium text-gray-800">{user.email}</span>
                    <ChevronDownIcon className={`h-4 w-4 text-gray-600 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div className="py-1">
                        <div className="px-4 py-2 border-b">
                          <p className="text-sm text-gray-700">Signed in as</p>
                          <p className="text-sm font-medium text-gray-900 truncate">{user.email}</p>
                          <p className="text-xs text-gray-500 bg-blue-100 text-blue-800 rounded-full px-2 py-0.5 inline-block mt-1">{user.plan} Plan</p>
                        </div>
                        {user && (user.plan === SubscriptionPlan.GENERAL || user.plan === SubscriptionPlan.FULL_ACCESS) && (
                            <a 
                              href="https://www.paypal.com/myaccount/autopay/" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <AdminIcon className="h-5 w-5" />
                              <span>Manage Subscription</span>
                            </a>
                        )}
                        {!user.has2FA && (
                            <button onClick={handleEnable2faClick} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                <ShieldCheckIcon className="h-5 w-5" />
                                <span>Enable 2FA</span>
                            </button>
                        )}
                        <button onClick={handleLogout} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                          <LogoutIcon className="h-5 w-5" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => navigate(ROUTES.LOGIN)}>Sign In</Button>
                  <Button variant="primary" size="sm" onClick={() => navigate(ROUTES.SIGNUP)}>Sign Up</Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      <TwoFactorAuthModal
        isOpen={is2faSetupModalOpen}
        onClose={() => set2faSetupModalOpen(false)}
        onVerify={handle2faSetupVerify}
        mode="setup"
      />
    </>
  );
};

export default Header;