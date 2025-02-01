export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  company?: string;
  job_title?: string;
  linkedin_profile?: string;
  preferred_tone?: string;
  notification_preferences?: {
    email_notifications: boolean;
    credit_alerts: boolean;
  };
  created_at: string;
  updated_at: string;
}

export interface UserProfileUpdateRequest {
  full_name?: string;
  company?: string;
  job_title?: string;
  linkedin_profile?: string;
  preferred_tone?: string;
  notification_preferences?: {
    email_notifications: boolean;
    credit_alerts: boolean;
  };
}

export interface UserStats {
  total_posts_generated: number;
  total_credits_used: number;
  remaining_credits: number;
  last_login: string;
  account_created: string;
} 