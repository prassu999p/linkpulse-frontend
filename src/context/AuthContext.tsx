import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../api/config';
import { AxiosError } from 'axios';

interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  signIn: {
    withEmail: (email: string, password: string) => Promise<void>;
    withLinkedIn: () => Promise<void>;
  };
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check for existing token on mount
    const token = localStorage.getItem('auth_token');
    setIsAuthenticated(!!token);
    setLoading(false);
  }, []);

  const signIn = {
    withEmail: async (email: string, password: string) => {
      try {
        console.log('Attempting to sign in with:', { email, baseURL: api.defaults.baseURL });
        const response = await api.post('/auth/login', { email, password });
        console.log('Sign-in response:', response.data);

        const { token } = response.data;
        if (!token) {
          throw new Error('No token received from server');
        }

        localStorage.setItem('auth_token', token);
        setIsAuthenticated(true);
      } catch (error) {
        const axiosError = error as AxiosError<any>;
        console.error('Email sign-in failed:', {
          status: axiosError.response?.status,
          data: axiosError.response?.data,
          message: axiosError.message,
          config: {
            url: axiosError.config?.url,
            method: axiosError.config?.method,
            baseURL: axiosError.config?.baseURL,
          },
        });
        throw error;
      }
    },
    withLinkedIn: async () => {
      try {
        // Redirect to LinkedIn OAuth flow
        window.location.href = `${api.defaults.baseURL}/auth/linkedin`;
      } catch (error) {
        console.error('LinkedIn sign-in failed:', error);
        throw error;
      }
    },
  };

  const signUp = async (email: string, password: string) => {
    try {
      console.log('Attempting to sign up with:', { email, baseURL: api.defaults.baseURL });
      const response = await api.post('/auth/register', { email, password });
      console.log('Sign-up response:', response.data);

      const { token } = response.data;
      if (!token) {
        throw new Error('No token received from server');
      }

      localStorage.setItem('auth_token', token);
      setIsAuthenticated(true);
    } catch (error) {
      const axiosError = error as AxiosError<any>;
      console.error('Sign-up failed:', {
        status: axiosError.response?.status,
        data: axiosError.response?.data,
        message: axiosError.message,
        config: {
          url: axiosError.config?.url,
          method: axiosError.config?.method,
          baseURL: axiosError.config?.baseURL,
        },
      });
      throw error;
    }
  };

  const signOut = () => {
    localStorage.removeItem('auth_token');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
