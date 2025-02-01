import { api } from '../config';
import { UserProfile, UserProfileUpdateRequest, UserStats } from '../../types/user';

class UserService {
  async getUserProfile(): Promise<UserProfile> {
    const response = await api.get('/user/profile');
    return response.data;
  }

  async updateUserProfile(data: UserProfileUpdateRequest): Promise<UserProfile> {
    const response = await api.put('/user/profile', data);
    return response.data;
  }

  async getUserStats(): Promise<UserStats> {
    const response = await api.get('/user/stats');
    return response.data;
  }

  async updateNotificationPreferences(
    preferences: {
      email_notifications: boolean;
      credit_alerts: boolean;
    }
  ): Promise<void> {
    await api.put('/user/notifications', preferences);
  }

  async updatePreferredTone(tone: string): Promise<void> {
    await api.put('/user/preferences/tone', { preferred_tone: tone });
  }
}

export const userService = new UserService(); 