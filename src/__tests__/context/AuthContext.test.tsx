import React from 'react';
import { render, act, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../../context/AuthContext';
import { api } from '../../api/config';
import { vi } from 'vitest';

// Mock the api module
vi.mock('../../api/config', () => ({
  api: {
    post: vi.fn(),
    defaults: {
      baseURL: 'http://localhost:8000'
    }
  }
}));

// Test component to access auth context
const TestComponent = () => {
  const { isAuthenticated, loading, signIn, signUp, signOut } = useAuth();
  return (
    <div>
      <div data-testid="auth-status">{isAuthenticated ? 'authenticated' : 'not-authenticated'}</div>
      <div data-testid="loading-status">{loading ? 'loading' : 'not-loading'}</div>
      <button onClick={() => signIn.withEmail('test@example.com', 'password')}>Sign In</button>
      <button onClick={() => signUp('test@example.com', 'password')}>Sign Up</button>
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Reset all mocks
    vi.clearAllMocks();
  });

  it('should initialize with not authenticated state', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('auth-status')).toHaveTextContent('not-authenticated');
    expect(screen.getByTestId('loading-status')).toHaveTextContent('not-loading');
  });

  it('should initialize as authenticated if token exists', () => {
    localStorage.setItem('auth_token', 'test-token');

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('auth-status')).toHaveTextContent('authenticated');
  });

  it('should handle successful sign in', async () => {
    // Mock successful API response
    (api.post as any).mockResolvedValueOnce({
      data: {
        access_token: 'test-token',
        user: {
          id: '1',
          email: 'test@example.com'
        }
      }
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Click sign in button
    fireEvent.click(screen.getByText('Sign In'));

    // Wait for authentication to complete
    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('authenticated');
    });

    // Verify token was stored
    expect(localStorage.getItem('auth_token')).toBe('test-token');
  });

  it('should handle failed sign in', async () => {
    // Mock failed API response
    (api.post as any).mockRejectedValueOnce(new Error('Invalid credentials'));

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Click sign in button
    fireEvent.click(screen.getByText('Sign In'));

    // Wait for authentication to fail
    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('not-authenticated');
    });

    // Verify no token was stored
    expect(localStorage.getItem('auth_token')).toBeNull();
  });

  it('should handle successful sign up', async () => {
    // Mock successful API response
    (api.post as any).mockResolvedValueOnce({
      data: {
        access_token: 'test-token',
        user: {
          id: '1',
          email: 'test@example.com'
        }
      }
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Click sign up button
    fireEvent.click(screen.getByText('Sign Up'));

    // Wait for authentication to complete
    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('authenticated');
    });

    // Verify token was stored
    expect(localStorage.getItem('auth_token')).toBe('test-token');
  });

  it('should handle sign out', async () => {
    // Start with authenticated state
    localStorage.setItem('auth_token', 'test-token');

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Verify initial authenticated state
    expect(screen.getByTestId('auth-status')).toHaveTextContent('authenticated');

    // Click sign out button
    fireEvent.click(screen.getByText('Sign Out'));

    // Verify signed out state
    expect(screen.getByTestId('auth-status')).toHaveTextContent('not-authenticated');
    expect(localStorage.getItem('auth_token')).toBeNull();
  });
}); 