

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole, SubscriptionPlan } from '../types';
import { MOCK_USERS, DAILY_LIMITS } from '../constants';
import { apiService } from '../services/apiService';

export interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  allUsers: User[];
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string; requires2FA?: boolean; user?: User | null; }>;
  logout: () => void;
  signup: (email: string, password: string, recaptchaToken: string) => Promise<{ success: boolean; message?: string; }>;
  updateUser: (userId: string, updates: Partial<User>) => void;
  verify2FA: (userId: string, code: string) => Promise<boolean>;
  setup2FA: (userId: string, code: string) => Promise<boolean>;
  checkAndIncrementUsage: (tool: 'generalQueries' | 'blockchainTools') => Promise<{ allowed: boolean; featureName?: string }>;
  verifyEmail: (token: string) => Promise<{ success: boolean; message?: string; }>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// Helper to manage our mock user database in localStorage
const userDb = {
  getUsers: (): User[] => {
    try {
      const usersJson = localStorage.getItem('elby_users_db');
      if (usersJson) {
        return JSON.parse(usersJson);
      } else {
        // Seed the DB if it doesn't exist
        localStorage.setItem('elby_users_db', JSON.stringify(MOCK_USERS));
        return MOCK_USERS;
      }
    } catch (e) {
      // On error, reset to default
      localStorage.setItem('elby_users_db', JSON.stringify(MOCK_USERS));
      return MOCK_USERS;
    }
  },
  saveUsers: (users: User[]) => {
    localStorage.setItem('elby_users_db', JSON.stringify(users));
  }
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [allUsers, setAllUsers] = useState<User[]>([]);

  useEffect(() => {
    setAllUsers(userDb.getUsers());
    
    try {
      const storedUser = sessionStorage.getItem('elby_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from session storage", error);
      sessionStorage.removeItem('elby_user');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; message?: string; requires2FA?: boolean; user?: User | null; }> => {
    setLoading(true);
    const currentUsers = userDb.getUsers();
    const foundUser = currentUsers.find(u => u.email === email);
    
    if (!foundUser) {
        setLoading(false);
        return { success: false, message: 'Invalid credentials.' };
    }

    if (!foundUser.isActive) {
        setLoading(false);
        return { success: false, message: 'Account not activated. Please check your email to verify your account.' };
    }

    // NOTE: Password is not checked in this mock implementation
    if (foundUser.has2FA) {
      setLoading(false);
      return { success: true, requires2FA: true, user: foundUser };
    }
    setUser(foundUser);
    sessionStorage.setItem('elby_user', JSON.stringify(foundUser));
    setLoading(false);
    return { success: true, user: foundUser };
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('elby_user');
  };

  const signup = async (email: string, password: string, recaptchaToken: string): Promise<{ success: boolean; message?: string; }> => {
    // In a real application, this token would be sent to a backend for verification
    // with the RECAPTCHA_SECRET_KEY. For this demo, we simulate a simple check.
    if (!recaptchaToken) {
      return { success: false, message: 'reCAPTCHA verification failed. Please try again.' };
    }
    console.log("Simulating reCAPTCHA verification for token:", recaptchaToken.substring(0,30) + '...');

    setLoading(true);
    const currentUsers = userDb.getUsers();
    
    if (currentUsers.find(u => u.email === email)) {
      setLoading(false);
      return { success: false, message: 'User with this email already exists.' };
    }

    const hasSuperAdmin = currentUsers.some(u => u.role === UserRole.SUPER_ADMIN);
    const isFirstUser = !hasSuperAdmin;
    const verificationToken = isFirstUser ? undefined : `${Date.now()}-${Math.random()}`;

    const newUser: User = {
      id: `user-${Date.now()}`,
      email,
      role: isFirstUser ? UserRole.SUPER_ADMIN : UserRole.USER,
      plan: isFirstUser ? SubscriptionPlan.FULL_ACCESS : SubscriptionPlan.FREE,
      createdAt: new Date().toISOString(),
      isActive: isFirstUser, // First user is active, others need verification
      has2FA: false,
      usage: { generalQueries: 0, blockchainTools: 0, lastReset: new Date().toISOString() },
      verificationToken,
    };
    
    const updatedUsers = [...currentUsers, newUser];
    userDb.saveUsers(updatedUsers);
    setAllUsers(updatedUsers);
    
    if (isFirstUser) {
        // Log in the new super admin immediately
        setUser(newUser);
        sessionStorage.setItem('elby_user', JSON.stringify(newUser));
    } else {
        // For other users, log the verification link for this mock implementation
        console.log(`Verification link for ${email}: /#/verify-email?token=${verificationToken}`);
    }
    
    setLoading(false);
    return { success: true };
  };
  
  const updateUser = (userId: string, updates: Partial<User>) => {
    const currentUsers = userDb.getUsers();
    const updatedUsers = currentUsers.map(u => 
        u.id === userId ? { ...u, ...updates } : u
    );
    userDb.saveUsers(updatedUsers);
    setAllUsers(updatedUsers);

    // If the currently logged-in user is the one being updated, refresh their state
    if(user?.id === userId) {
        const updatedCurrentUser = updatedUsers.find(u => u.id === userId);
        if(updatedCurrentUser) {
            setUser(updatedCurrentUser);
            sessionStorage.setItem('elby_user', JSON.stringify(updatedCurrentUser));
        }
    }
  };
  
  const verifyEmail = async (token: string): Promise<{ success: boolean; message?: string }> => {
    setLoading(true);
    const currentUsers = userDb.getUsers();
    const userToVerify = currentUsers.find(u => u.verificationToken === token);

    if (!userToVerify) {
        setLoading(false);
        return { success: false, message: 'Invalid or expired verification token.' };
    }

    const updatedUser = { ...userToVerify, isActive: true, verificationToken: undefined };
    const updatedUsers = currentUsers.map(u => u.id === updatedUser.id ? updatedUser : u);
    userDb.saveUsers(updatedUsers);
    setAllUsers(updatedUsers);

    // Log the user in
    setUser(updatedUser);
    sessionStorage.setItem('elby_user', JSON.stringify(updatedUser));
    
    setLoading(false);
    return { success: true };
  };

  const verify2FA = async (userId: string, code: string): Promise<boolean> => {
    const userToVerify = userDb.getUsers().find(u => u.id === userId);
    if (!userToVerify) return false;

    const { success } = await apiService.privacyIDEA.verifyToken(userToVerify.email, code);

    if (success) {
      setUser(userToVerify);
      sessionStorage.setItem('elby_user', JSON.stringify(userToVerify));
      return true;
    }
    return false;
  };

  const setup2FA = async (userId: string, code: string): Promise<boolean> => {
    const userToSetup = userDb.getUsers().find(u => u.id === userId);
    if (!userToSetup) return false;

    // Simulate verifying the code against the newly setup token
    const { success } = await apiService.privacyIDEA.enrollUser(userToSetup.email, code);
    
    if(success) {
        updateUser(userId, { has2FA: true });
        return true;
    }
    return false;
  };
  
  const checkAndIncrementUsage = async (tool: 'generalQueries' | 'blockchainTools'): Promise<{ allowed: boolean; featureName?: string; }> => {
    if (!user) return { allowed: false };

    // Create a mutable copy for this function's scope to avoid direct state mutation
    let currentUserForCheck = JSON.parse(JSON.stringify(user));
    
    const now = new Date();
    const lastReset = new Date(currentUserForCheck.usage.lastReset);
    const hoursSinceLastReset = (now.getTime() - lastReset.getTime()) / (1000 * 60 * 60);
    
    if (hoursSinceLastReset >= 24) {
        currentUserForCheck.usage = {
            generalQueries: 0,
            blockchainTools: 0,
            lastReset: now.toISOString(),
        };
    }

    const limits = DAILY_LIMITS[currentUserForCheck.plan];
    const currentUsage = currentUserForCheck.usage[tool];

    if (currentUsage >= limits[tool]) {
        const featureName = tool === 'generalQueries' ? 'General AI Queries' : 'Blockchain Tools';
        return { allowed: false, featureName };
    }

    // If allowed, increment and update the user state.
    currentUserForCheck.usage[tool] += 1;
    updateUser(currentUserForCheck.id, { usage: currentUserForCheck.usage });
    
    return { allowed: true };
  };


  const value = {
    isAuthenticated: !!user,
    user,
    allUsers,
    loading,
    login,
    logout,
    signup,
    updateUser,
    verify2FA,
    setup2FA,
    checkAndIncrementUsage,
    verifyEmail,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
