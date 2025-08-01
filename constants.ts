

import { UserRole, SubscriptionPlan, User, SiteContent } from './types';

export const APP_NAME = "Elby AI";

export const ROUTES = {
  HOME: '/',
  PRICING: '/pricing',
  LOGIN: '/login',
  SIGNUP: '/signup',
  VERIFY_EMAIL: '/verify-email',
  DOCS: '/docs',
  TOS: '/tos',
  CHAT: '/chat',
  BLOCKCHAIN: '/blockchain',
  CONTRACT_ANALYSIS: '/blockchain/contract-analysis',
  PLAYBOOK: '/blockchain/playbook',
  RADAR: '/blockchain/radar',
  ADMIN: '/admin',
  ADMIN_USERS: '/admin/users',
  ADMIN_CONTENT: '/admin/content',
  ADMIN_PAYMENTS: '/admin/payments',
  ADMIN_HEALTH: '/admin/health',
};

export const MOCK_USERS: User[] = [
  {
    id: 'user-1',
    email: 'fitotechnologyllc@gmail.com',
    role: UserRole.SUPER_ADMIN,
    plan: SubscriptionPlan.FULL_ACCESS,
    createdAt: '2023-01-15T10:00:00Z',
    isActive: true,
    has2FA: true,
    usage: { generalQueries: 0, blockchainTools: 0, lastReset: new Date().toISOString() },
  },
  {
    id: 'user-2',
    email: 'admin@elby.ai',
    role: UserRole.SUB_ADMIN,
    plan: SubscriptionPlan.FULL_ACCESS,
    createdAt: '2023-02-20T11:30:00Z',
    isActive: true,
    has2FA: false,
    usage: { generalQueries: 0, blockchainTools: 0, lastReset: new Date().toISOString() },
  },
  {
    id: 'user-3',
    email: 'freeuser@elby.ai',
    role: UserRole.USER,
    plan: SubscriptionPlan.FREE,
    createdAt: '2023-03-10T14:00:00Z',
    isActive: true,
    has2FA: false,
    usage: { generalQueries: 2, blockchainTools: 1, lastReset: new Date().toISOString() },
  },
  {
    id: 'user-4',
    email: 'generaluser@elby.ai',
    role: UserRole.USER,
    plan: SubscriptionPlan.GENERAL,
    createdAt: '2023-04-05T09:00:00Z',
    isActive: true,
    has2FA: false,
    usage: { generalQueries: 0, blockchainTools: 0, lastReset: new Date().toISOString() },
  },
  {
    id: 'user-5',
    email: 'inactive@elby.ai',
    role: UserRole.USER,
    plan: SubscriptionPlan.FREE,
    createdAt: '2023-05-01T18:00:00Z',
    isActive: true,
    has2FA: false,
    usage: { generalQueries: 0, blockchainTools: 0, lastReset: new Date().toISOString() },
  }
];

export const DAILY_LIMITS = {
  [SubscriptionPlan.FREE]: {
    generalQueries: 5,
    blockchainTools: 3,
  },
  [SubscriptionPlan.GENERAL]: {
    generalQueries: Infinity,
    blockchainTools: 5,
  },
  [SubscriptionPlan.FULL_ACCESS]: {
    generalQueries: Infinity,
    blockchainTools: Infinity,
  }
};

export const DEFAULT_SITE_CONTENT: SiteContent = {
  homepageHeroTitle: 'Navigate Legal Complexity with **Confidence**.',
  homepageHeroSubtitle: 'Elby AI provides sophisticated tools for legal professionals, powered by cutting-edge artificial intelligence. From general legal queries to deep blockchain analysis, get the insights you need, fast.',
};