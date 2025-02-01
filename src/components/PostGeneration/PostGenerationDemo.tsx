import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Alert } from '@mui/material';
import { PostGenerationForm } from './PostGenerationForm';
import { PostGenerationFormData } from './types';
import { postService } from '../../api/services/postService';
import { AxiosError } from 'axios';

export const PostGenerationDemo: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedPost, setGeneratedPost] = useState<string | null>(null);
  const [credits, setCredits] = useState<number | null>(null);

  // Check authentication and fetch credits on mount
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      setError('Please log in to continue');
      window.location.href = '/login';
      return;
    }

    const fetchCredits = async () => {
      try {
        const response = await postService.getUserCredits();
        setCredits(response.credits);
      } catch (err) {
        const axiosError = err as AxiosError<any>;
        if (axiosError.response?.status === 401) {
          setError('Your session has expired. Please log in again.');
          localStorage.removeItem('auth_token');
          window.location.href = '/login';
          return;
        }
        console.error('Failed to fetch credits:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch credits');
      }
    };
    fetchCredits();
  }, []);

  const handleSubmit = async (data: PostGenerationFormData) => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      setError('Please log in to generate posts');
      window.location.href = '/login';
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedPost(null);

    try {
      const response = await postService.generatePost(data);
      setGeneratedPost(response.post_content);
      setCredits(response.credits_remaining);
    } catch (err) {
      const axiosError = err as AxiosError<any>;
      if (axiosError.response?.status === 401) {
        setError('Your session has expired. Please log in again.');
        localStorage.removeItem('auth_token');
        window.location.href = '/login';
        return;
      }
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      console.error('Post generation failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom align="center">
        LinkedIn Post Generator
      </Typography>

      {credits !== null && !error && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Credits Remaining: {credits}
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <PostGenerationForm onSubmit={handleSubmit} isLoading={isLoading} error={error} />

      {generatedPost && !error && (
        <Paper sx={{ mt: 3, p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Generated Post
          </Typography>
          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
            {generatedPost}
          </Typography>
        </Paper>
      )}
    </Box>
  );
};
