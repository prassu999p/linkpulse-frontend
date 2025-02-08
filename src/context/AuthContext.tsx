import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../api/config';
import { AxiosError } from 'axios';
import { SignupData } from '../components/auth/SignupPage';

interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  signIn: {
    withEmail: (email: string, password: string) => Promise<void>;
    withLinkedIn: () => Promise<void>;
  };
  signUp: (data: SignupData) => Promise<void>;
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
        console.log('Attempting to sign in with:', { email });
        const response = await api.post('/auth/login', { email, password });
        console.log('Sign-in response:', response.data);

        const { access_token } = response.data;
        if (!access_token) {
          throw new Error('No token received from server');
        }

        localStorage.setItem('auth_token', access_token);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Sign-in failed:', error);
        throw error;
      }
    },
    withLinkedIn: async () => {
      // To be implemented
      throw new Error('LinkedIn sign-in not implemented');
    },
  };

  const signUp = async (data: SignupData) => {
    try {
      console.log('Attempting to sign up with:', data);
      const response = await api.post('/auth/register', data);
      console.log('Sign-up response:', response.data);

      const { access_token } = response.data;
      if (access_token) {
        localStorage.setItem('auth_token', access_token);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Sign-up failed:', error);
      if (error instanceof AxiosError && error.response?.data?.detail) {
        throw new Error(error.response.data.detail);
      }
      throw error;
    }
  };

  const signOut = () => {
    localStorage.removeItem('auth_token');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        loading,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
