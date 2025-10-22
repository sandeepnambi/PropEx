// frontend/src/context/AuthContext.tsx

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { IUser, AuthState, JwtPayload } from '../types';
import { jwtDecode } from 'jwt-decode';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

const initialAuthState: AuthState = {
  user: null,
  token: null,
  isLoggedIn: false,
  role: null,
  isLoading: true,
  error: null
};

interface AuthContextType extends AuthState {
  login: (token: string, user: IUser) => void;
  register: (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone?: string;
    role: 'Buyer' | 'Agent';
  }) => Promise<{ success: boolean; user?: IUser; error?: string }>;
  logout: () => void;
  setError: (error: string | null) => void;
  checkAuthStatus: () => Promise<boolean>;
  API_BASE_URL: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>(initialAuthState);

  const setError = useCallback((error: string | null) => {
    setAuthState(prev => ({ ...prev, error }));
  }, []);

  const login = useCallback((token: string, user: IUser) => {
    try {
      localStorage.setItem('token', token);
      // Ensure the role is properly set from the user object
      const userRole = user.role || 'Buyer'; // Default to 'Buyer' if role is not set
      
      const newAuthState = {
        user: {
          ...user,
          role: userRole // Ensure role is set on the user object
        },
        token,
        isLoggedIn: true,
        role: user.role,
        isLoading: false,
        error: null
      };
      
      setAuthState(newAuthState);
    } catch (error) {
      console.error('Error saving token:', error);
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to save authentication token'
      }));
    }
  }, []);

  const register = useCallback(async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone?: string;
    role: 'Buyer' | 'Agent';
  }) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        mode: 'cors',
        body: JSON.stringify(userData),
      }).catch(error => {
        console.error('Network error:', error);
        throw new Error('Unable to connect to the server. Please check your internet connection and try again.');
      });

      const data = await response.json().catch(() => ({
        message: 'Invalid server response',
      }));

      if (!response.ok) {
        console.error('API Error:', {
          status: response.status,
          statusText: response.statusText,
          error: data
        });
        throw new Error(data.message || 'Registration failed. Please try again.');
      }

      // Automatically log in the user after successful registration
      if (data.token && data.data?.user) {
        login(data.token, data.data.user);
      } else {
        console.error('Missing token or user data in response:', data);
        throw new Error('Registration successful but failed to log in automatically.');
      }

      return { success: true, user: data.data.user };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      setAuthState(prev => ({
        ...prev,
        error: errorMessage,
        isLoading: false,
      }));
      return { success: false, error: errorMessage };
    }
  }, [login]);

  const logout = useCallback(() => {
    try {
      localStorage.removeItem('token');
      setAuthState({
        ...initialAuthState,
        isLoading: false,
        token: null,
        error: null
      });
    } catch (error) {
      console.error('Logout error:', error);
      setAuthState(prev => ({
        ...prev,
        error: 'Failed to logout properly. Please clear your browser data.',
        isLoading: false
      }));
    }
  }, []);

  const checkAuthStatus = useCallback(async (): Promise<boolean> => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return false;
    }

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      
      // Check token expiry
      if (decoded.exp * 1000 < Date.now()) {
        logout();
        return false;
      }
      
      // Map token payload to user
      const user: IUser = {
        _id: decoded.id,
        email: decoded.email || '',
        role: decoded.role,
        firstName: decoded.firstName || '',
        lastName: decoded.lastName || '',
      };

      setAuthState({
        user,
        token,
        isLoggedIn: true,
        role: user.role,
        isLoading: false,
        error: null
      });
      
      return true;
    } catch (error) {
      console.error('Auth check failed:', error);
      logout();
      return false;
    }
  }, [logout]);

  // Auto-check auth status on mount
  useEffect(() => {
    const verifyAuth = async () => {
      await checkAuthStatus();
    };
    
    verifyAuth();
  }, [checkAuthStatus]);

  // Auto-logout on token expiration
  useEffect(() => {
    if (!authState.token) return;

    try {
      const decoded = jwtDecode<JwtPayload>(authState.token);
      const timeUntilExpiry = decoded.exp * 1000 - Date.now();
      
      if (timeUntilExpiry <= 0) {
        logout();
        return;
      }

      const timer = setTimeout(() => {
        logout();
      }, timeUntilExpiry);

      return () => clearTimeout(timer);
    } catch (error) {
      console.error('Token validation error:', error);
      logout();
    }
  }, [authState.token, logout]);

  const contextValue: AuthContextType = {
    ...authState,
    login,
    register,
    logout,
    setError,
    checkAuthStatus,
    API_BASE_URL,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Helper function to get auth headers
export const getAuthHeaders = (token: string | null) => {
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};