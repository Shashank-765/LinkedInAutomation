
export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  USER = 'USER'
}

export enum PostStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  SCHEDULED = 'SCHEDULED',
  POSTED = 'POSTED',
  FAILED = 'FAILED'
}

export enum AdLocation {
  HOME = 'HOME',
  DASHBOARD = 'DASHBOARD'
}

export interface Ad {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  linkUrl: string;
  location: AdLocation;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface PlanLimits {
  maxAiGenerationsPerMonth: number;
  maxAiImagesPerMonth: number;
  maxScheduledPostsPerDay: number;
  bulkScheduling: boolean;
  autoPilot: boolean;
  imageGeneration: boolean;
  teamMemberLimit: number;
}

export interface LinkedInProfile {
  urn: string;
  firstName: string;
  lastName: string;
  profilePicture: string;
  accessToken?: string;
}

export interface CalendarEvent {
  date: string;
  topic: string;
  isGlobal?: boolean;
}

export interface AutoPilotConfig {
  enabled: boolean;
  industryKeywords: string;
  calendarEvents: CalendarEvent[];
  lastAutoPostDate?: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  planId: any;
  status: 'active' | 'suspended';
  companyName: string;
  industry: string;
  postTypePreference: string;
  linkedInConnected: boolean;
  linkedInProfile?: LinkedInProfile;
  autoPilotConfig?: AutoPilotConfig;
  usage: {
    aiGenerationsThisMonth: number;
    aiImagesThisMonth: number;
    scheduledToday: number;
    lastResetDate?: string;
  };
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  subscriptionStatus?: string;
  createdAt: string;
}

export interface LinkedInMetrics {
  likes: number;
  comments: number;
  shares: number;
  impressions: number;
}

export interface Post {
  _id: string;
  userId: string;
  topic: string;
  content: string;
  images: string[];
  imageSource: 'AI' | 'UPLOAD' | 'NONE';
  status: PostStatus;
  scheduledAt?: string;
  postedAt?: string;
  createdAt: string;
  isAutoPilot?: boolean;
  linkedInPostId?: string;
  metrics?: LinkedInMetrics;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}
