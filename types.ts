

export enum UserRole {
  USER = 'user',
  SUB_ADMIN = 'sub-admin',
  SUPER_ADMIN = 'super-admin',
}

export enum SubscriptionPlan {
  FREE = 'Free',
  GENERAL = 'General',
  FULL_ACCESS = 'Full Access',
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  plan: SubscriptionPlan;
  createdAt: string;
  isActive: boolean;
  has2FA: boolean;
  usage: {
    generalQueries: number;
    blockchainTools: number;
    lastReset: string; 
  };
  verificationToken?: string;
}

export enum ChatPersona {
  ASSISTANT = 'Elby Assistant',
  REGULATOR = 'Chain Assistant',
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: string;
  attachment?: {
    name: string;
    type: 'pdf' | 'png' | 'jpg';
  }
}

export interface ChatSession {
  id:string;
  title: string;
  messages: ChatMessage[];
  persona: ChatPersona;
  createdAt: string;
}

export interface RegulatoryUpdate {
  id: number;
  title: string;
  date: string;
  source: string;
  summary: string;
  tags: string[];
}

export interface HealthMetric {
  name: string;
  status: 'ok' | 'warn' | 'error';
  value: string;
}

export interface SiteContent {
  homepageHeroTitle: string;
  homepageHeroSubtitle: string;
}