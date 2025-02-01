import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PostGenerationForm } from '../PostGenerationForm';
import { act } from 'react-dom/test-utils';

describe('PostGenerationForm', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it('renders all form elements correctly', () => {
    render(<PostGenerationForm onSubmit={mockOnSubmit} />);

    expect(screen.getByLabelText(/topic/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/tone/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /generate post/i })).toBeInTheDocument();
  });

  it('handles form submission correctly', async () => {
    render(<PostGenerationForm onSubmit={mockOnSubmit} />);

    const topicInput = screen.getByLabelText(/topic/i);
    await act(async () => {
      await userEvent.type(topicInput, 'Test topic');
    });

    const toneSelect = screen.getByLabelText(/tone/i);
    await act(async () => {
      await userEvent.click(toneSelect);
    });

    const casualOption = screen.getByText('Casual');
    await act(async () => {
      await userEvent.click(casualOption);
    });

    const submitButton = screen.getByRole('button', { name: /generate post/i });
    await act(async () => {
      await userEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        topic: 'Test topic',
        tone: 'casual',
      });
    });
  });

  it('displays error message when provided', () => {
    const errorMessage = 'Test error message';
    render(<PostGenerationForm onSubmit={mockOnSubmit} error={errorMessage} />);

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('disables form elements when loading', () => {
    render(<PostGenerationForm onSubmit={mockOnSubmit} isLoading={true} />);

    const topicInput = screen.getByLabelText(/topic/i);
    const toneSelect = screen.getByLabelText(/tone/i);
    const submitButton = screen.getByRole('button', { name: /generating/i });

    expect(topicInput).toBeDisabled();
    expect(toneSelect.closest('.Mui-disabled')).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });

  it('prevents submission when topic is empty', async () => {
    render(<PostGenerationForm onSubmit={mockOnSubmit} />);

    const submitButton = screen.getByRole('button', { name: /generate post/i });
    expect(submitButton).toBeDisabled();

    const topicInput = screen.getByLabelText(/topic/i);
    await act(async () => {
      await userEvent.type(topicInput, ' ');
    });

    expect(submitButton).toBeDisabled();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });
});
