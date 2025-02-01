import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
  CircularProgress,
  Card,
  CardContent,
} from '@mui/material';
import { userService } from '../../api/services/userService';
import { UserStats } from '../../types/user';

const UserProfilePage: React.FC = () => {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    full_name: '',
    company: '',
    job_title: '',
    linkedin_profile: '',
    preferred_tone: '',
    notification_preferences: {
      email_notifications: true,
      credit_alerts: true,
    },
  });

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const [profileData, statsData] = await Promise.all([
          userService.getUserProfile(),
          userService.getUserStats(),
        ]);
        setFormData({
          full_name: profileData.full_name || '',
          company: profileData.company || '',
          job_title: profileData.job_title || '',
          linkedin_profile: profileData.linkedin_profile || '',
          preferred_tone: profileData.preferred_tone || '',
          notification_preferences: profileData.notification_preferences || {
            email_notifications: true,
            credit_alerts: true,
          },
        });
        setStats(statsData);
      } catch (err) {
        setError('Failed to load user profile');
        console.error('Error loading profile:', err);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      notification_preferences: {
        ...prev.notification_preferences,
        [name]: checked,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      await userService.updateUserProfile(formData);
      setSuccess('Profile updated successfully');
    } catch (err) {
      setError('Failed to update profile');
      console.error('Error updating profile:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        User Profile
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* User Stats Card */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Account Statistics
              </Typography>
              <Divider sx={{ my: 2 }} />
              {stats && (
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Posts Generated: {stats.total_posts_generated}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Credits Used: {stats.total_credits_used}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Remaining Credits: {stats.remaining_credits}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Member Since: {new Date(stats.account_created).toLocaleDateString()}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Profile Form */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Company"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Job Title"
                    name="job_title"
                    value={formData.job_title}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="LinkedIn Profile URL"
                    name="linkedin_profile"
                    value={formData.linkedin_profile}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Preferred Tone"
                    name="preferred_tone"
                    value={formData.preferred_tone}
                    onChange={handleInputChange}
                    helperText="This will be used as the default tone for your posts"
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                    Notification Preferences
                  </Typography>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={
                          formData.notification_preferences.email_notifications
                        }
                        onChange={handleNotificationChange}
                        name="email_notifications"
                      />
                    }
                    label="Email Notifications"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={
                          formData.notification_preferences.credit_alerts
                        }
                        onChange={handleNotificationChange}
                        name="credit_alerts"
                      />
                    }
                    label="Credit Balance Alerts"
                  />
                </Grid>

                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={saving}
                    sx={{ mt: 2 }}
                  >
                    {saving ? <CircularProgress size={24} /> : 'Save Changes'}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default UserProfilePage; 