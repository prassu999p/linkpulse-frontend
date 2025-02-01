import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PostGenerationDemo } from '../PostGenerationDemo';
import { act } from 'react-dom/test-utils';

jest.useFakeTimers();

describe('PostGenerationDemo', () => {
  beforeEach(() => {
    jest.clearAllTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the demo component correctly', async () => {
    await act(async () => {
      render(<PostGenerationDemo />);
    });

    expect(screen.getByText('Post Generation Demo')).toBeInTheDocument();
    expect(screen.getByLabelText(/topic/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/tone/i)).toBeInTheDocument();
  });

  it('shows loading state and then displays submission', async () => {
    await act(async () => {
      render(<PostGenerationDemo />);
    });

    // Mock Math.random to return 0.5 (no error case)
    const mockMath = Object.create(global.Math);
    mockMath.random = () => 0.5;
    global.Math = mockMath;

    // Fill and submit the form
    const topicInput = screen.getByLabelText(/topic/i);
    await act(async () => {
      await userEvent.type(topicInput, 'Test Topic');
    });

    const toneSelect = screen.getByLabelText(/tone/i);
    await act(async () => {
      await userEvent.click(toneSelect);
    });

    await waitFor(() => {
      expect(screen.getByText('Casual')).toBeInTheDocument();
    });

    const casualOption = screen.getByText('Casual');
    await act(async () => {
      await userEvent.click(casualOption);
    });

    const submitButton = screen.getByRole('button', { name: /generate post/i });
    await act(async () => {
      await userEvent.click(submitButton);
      // Fast-forward timer immediately after click
      jest.advanceTimersByTime(1500);
    });

    // Check loading state
    expect(screen.getByText('Generating...')).toBeInTheDocument();

    // Wait for loading to complete and check submission display
    await waitFor(() => {
      expect(screen.queryByText('Generating...')).not.toBeInTheDocument();
      expect(screen.getByText('Last Submission:')).toBeInTheDocument();
      expect(screen.getByText('Topic: Test Topic')).toBeInTheDocument();
      expect(screen.getByText('Tone: casual')).toBeInTheDocument();
    });

    // Restore original Math
    global.Math = Object.create(global.Math);
  });

  it('handles errors correctly', async () => {
    await act(async () => {
      render(<PostGenerationDemo />);
    });

    // Mock Math.random to return 0.1 (error case)
    const mockMath = Object.create(global.Math);
    mockMath.random = () => 0.1;
    global.Math = mockMath;

    // Fill and submit the form
    const topicInput = screen.getByLabelText(/topic/i);
    await act(async () => {
      await userEvent.type(topicInput, 'Test Topic');
    });

    const submitButton = screen.getByRole('button', { name: /generate post/i });
    await act(async () => {
      await userEvent.click(submitButton);
      // Fast-forward timer immediately after click
      jest.advanceTimersByTime(1500);
    });

    // Check for error message
    await waitFor(() => {
      expect(screen.getByText(/Random error occurred!/i)).toBeInTheDocument();
    });

    // Restore original Math
    global.Math = Object.create(global.Math);
  });
});
