

import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ContentProvider } from './context/ContentContext';
import { ReCaptchaProvider } from './context/ReCaptchaContext';
import { ROUTES } from './constants';
import { UserRole } from './types';

import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/auth/ProtectedRoute';

import HomePage from './pages/HomePage';
import PricingPage from './pages/PricingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ChatPage from './pages/ChatPage';
import NotFoundPage from './pages/NotFoundPage';
import DocumentationPage from './pages/DocumentationPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import VerifyEmailPage from './pages/VerifyEmailPage';

import BlockchainHomePage from './pages/blockchain/BlockchainHomePage';
import ContractAnalysisPage from './pages/blockchain/ContractAnalysisPage';
import PlaybookPage from './pages/blockchain/PlaybookPage';
import RadarPage from './pages/blockchain/RadarPage';

import AdminLayout from './components/layout/AdminLayout';
import UserManagementPage from './pages/admin/UserManagementPage';
import ContentManagementPage from './pages/admin/ContentManagementPage';
import PaymentsPage from './pages/admin/PaymentsPage';
import SystemHealthPage from './pages/admin/SystemHealthPage';

function App() {
  return (
    <AuthProvider>
      <ContentProvider>
        <ReCaptchaProvider>
          <HashRouter>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-grow">
                <Routes>
                  {/* Public Routes */}
                  <Route path={ROUTES.HOME} element={<HomePage />} />
                  <Route path={ROUTES.PRICING} element={<PricingPage />} />
                  <Route path={ROUTES.LOGIN} element={<LoginPage />} />
                  <Route path={ROUTES.SIGNUP} element={<SignupPage />} />
                  <Route path={ROUTES.VERIFY_EMAIL} element={<VerifyEmailPage />} />
                  <Route path={ROUTES.DOCS} element={<DocumentationPage />} />
                  <Route path={ROUTES.TOS} element={<TermsOfServicePage />} />

                  {/* Protected Routes */}
                  <Route path={ROUTES.CHAT} element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
                  <Route path={`${ROUTES.CHAT}/:sessionId`} element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
                  
                  <Route path={ROUTES.BLOCKCHAIN} element={<ProtectedRoute><BlockchainHomePage /></ProtectedRoute>} />
                  <Route path={ROUTES.CONTRACT_ANALYSIS} element={<ProtectedRoute><ContractAnalysisPage /></ProtectedRoute>} />
                  <Route path={ROUTES.PLAYBOOK} element={<ProtectedRoute><PlaybookPage /></ProtectedRoute>} />
                  <Route path={ROUTES.RADAR} element={<ProtectedRoute><RadarPage /></ProtectedRoute>} />

                  {/* Admin Routes */}
                  <Route 
                    path={ROUTES.ADMIN} 
                    element={
                      <ProtectedRoute allowedRoles={[UserRole.SUB_ADMIN, UserRole.SUPER_ADMIN]}>
                        <AdminLayout />
                      </ProtectedRoute>
                    }
                  >
                    <Route index element={<UserManagementPage />} />
                    <Route path="users" element={<UserManagementPage />} />
                    <Route path="content" element={<ContentManagementPage />} />
                    <Route path="health" element={
                      <ProtectedRoute allowedRoles={[UserRole.SUPER_ADMIN]}>
                        <SystemHealthPage />
                      </ProtectedRoute>
                    } />
                    <Route path="payments" element={
                      <ProtectedRoute allowedRoles={[UserRole.SUPER_ADMIN]}>
                        <PaymentsPage />
                      </ProtectedRoute>
                    } />
                  </Route>

                  {/* Not Found */}
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </HashRouter>
        </ReCaptchaProvider>
      </ContentProvider>
    </AuthProvider>
  );
}

export default App;
