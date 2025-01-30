import React, { useState } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { PostGenerationForm } from './PostGenerationForm';
import { PostGenerationFormData } from './types';

export const PostGenerationDemo: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [lastSubmission, setLastSubmission] = useState<PostGenerationFormData | null>(null);

    const handleSubmit = async (data: PostGenerationFormData) => {
        setIsLoading(true);
        setError(null);
        
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            setLastSubmission(data);
            
            // Simulate random error (20% chance)
            if (Math.random() < 0.2) {
                throw new Error('Random error occurred! This is just for testing.');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
            <Typography variant="h4" gutterBottom align="center">
                Post Generation Demo
            </Typography>
            
            <PostGenerationForm
                onSubmit={handleSubmit}
                isLoading={isLoading}
                error={error}
            />

            {lastSubmission && !error && (
                <Paper sx={{ mt: 3, p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        Last Submission:
                    </Typography>
                    <Typography>
                        Topic: {lastSubmission.topic}
                    </Typography>
                    <Typography>
                        Tone: {lastSubmission.tone}
                    </Typography>
                </Paper>
            )}
        </Box>
    );
}; 