import React, { useState } from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Typography,
  Paper,
  Alert,
  SelectChangeEvent,
} from '@mui/material';
import { PostGenerationFormProps, PostGenerationFormData, ToneOption } from './types';

const TONE_OPTIONS: { value: ToneOption; label: string }[] = [
  { value: 'professional', label: 'Professional' },
  { value: 'casual', label: 'Casual' },
  { value: 'friendly', label: 'Friendly' },
  { value: 'humorous', label: 'Humorous' },
];

export const PostGenerationForm: React.FC<PostGenerationFormProps> = ({
  onSubmit,
  isLoading = false,
  error = null,
}) => {
  const [formData, setFormData] = useState<PostGenerationFormData>({
    topic: '',
    tone: 'professional',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleToneChange = (e: SelectChangeEvent<ToneOption>) => {
    setFormData((prev) => ({
      ...prev,
      tone: e.target.value as ToneOption,
    }));
  };

  return (
    <Paper elevation={3}>
      <Box component="form" onSubmit={handleSubmit} p={3}>
        <Typography variant="h6" gutterBottom>
          Generate LinkedIn Post
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TextField
          fullWidth
          label="Topic"
          name="topic"
          value={formData.topic}
          onChange={handleTextChange}
          margin="normal"
          required
          multiline
          rows={3}
          placeholder="Enter your post topic or idea..."
          disabled={isLoading}
        />

        <FormControl fullWidth margin="normal">
          <InputLabel id="tone-select-label">Tone</InputLabel>
          <Select<ToneOption>
            labelId="tone-select-label"
            name="tone"
            value={formData.tone}
            onChange={handleToneChange}
            label="Tone"
            disabled={isLoading}
          >
            {TONE_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box mt={2}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={isLoading || !formData.topic.trim()}
          >
            {isLoading ? 'Generating...' : 'Generate Post'}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};
