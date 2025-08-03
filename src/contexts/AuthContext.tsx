import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  username: string;
  email: string;
  accountType: 'personal' | 'business' | 'corporate' | 'private';
  accountNumber: string;
  fullName: string;
  phoneNumber: string;
  isVerified: boolean;
  kycStatus: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  register: (userData: RegisterData) => Promise<{ success: boolean; error?: string; user?: User }>;
  updateProfile: (updates: Partial<User>) => Promise<{ success: boolean; error?: string }>;
}

interface LoginCredentials {
  username: string;
  password: string;
  accountType: string;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  phoneNumber: string;
  accountType: 'personal' | 'business' | 'corporate' | 'private';
  dateOfBirth?: string;
  address?: string;
  occupation?: string;
  annualIncome?: string;
  businessName?: string;
  businessType?: string;
  companySize?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock user database (in real app, this would be API calls)
  const mockUsers: User[] = [
    {
      id: '1',
      username: 'john.doe',
      email: 'john.doe@email.com',
      accountType: 'personal',
      accountNumber: 'UBAS001234567',
      fullName: 'John Doe',
      phoneNumber: '+1-555-0123',
      isVerified: true,
      kycStatus: 'approved',
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      username: 'business.user',
      email: 'contact@business.com',
      accountType: 'business',
      accountNumber: 'UBAS002345678',
      fullName: 'Business Account',
      phoneNumber: '+1-555-0124',
      isVerified: true,
      kycStatus: 'approved',
      createdAt: '2024-01-10'
    }
  ];

  useEffect(() => {
    // Check for stored authentication
    const storedUser = localStorage.getItem('ubas_user');
    const storedToken = localStorage.getItem('ubas_token');
    
    if (storedUser && storedToken) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('ubas_user');
        localStorage.removeItem('ubas_token');
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    try {
      // Use real API authentication
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: credentials.username, // Using username as email for now
          password: credentials.password,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        return { success: false, error: data.message || 'Invalid credentials' };
      }

      // Store authentication data
      const userData = {
        id: data.data.user.id,
        username: data.data.user.email,
        email: data.data.user.email,
        accountType: data.data.user.accountType,
        accountNumber: `UBAS${Math.random().toString().substr(2, 9)}`, // Will be fetched from accounts API
        fullName: `${data.data.user.firstName} ${data.data.user.lastName}`,
        phoneNumber: data.data.user.phone || '',
        isVerified: data.data.user.isVerified || false,
        kycStatus: data.data.user.kycStatus || 'pending',
        createdAt: new Date().toISOString().split('T')[0]
      };

      localStorage.setItem('ubas_user', JSON.stringify(userData));
      localStorage.setItem('ubas_token', data.data.accessToken);
      localStorage.setItem('ubas_refresh_token', data.data.refreshToken);

      setUser(userData);
      return { success: true };

    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData): Promise<{ success: boolean; error?: string; user?: User }> => {
    setIsLoading(true);

    try {
      // Validation
      if (userData.password !== userData.confirmPassword) {
        return { success: false, error: 'Passwords do not match' };
      }

      if (userData.password.length < 8) {
        return { success: false, error: 'Password must be at least 8 characters long' };
      }

      // Use real API registration
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userData.email,
          password: userData.password,
          firstName: userData.fullName.split(' ')[0],
          lastName: userData.fullName.split(' ').slice(1).join(' ') || userData.fullName.split(' ')[0],
          phone: userData.phoneNumber,
          dateOfBirth: '1990-01-01', // Default for now
          accountType: userData.accountType,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        return { success: false, error: data.message || 'Registration failed' };
      }

      // Create user object for frontend
      const newUser: User = {
        id: data.data.userId,
        username: userData.email,
        email: userData.email,
        accountType: userData.accountType,
        accountNumber: data.data.accountNumber,
        fullName: userData.fullName,
        phoneNumber: userData.phoneNumber,
        isVerified: false,
        kycStatus: 'pending',
        createdAt: new Date().toISOString().split('T')[0]
      };

      // Don't auto-login after registration - user needs to go through onboarding
      return { success: true, user: newUser };
      
    } catch (error) {
      return { success: false, error: 'Registration failed. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<User>): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: 'Not authenticated' };
    
    try {
      const updatedUser = { ...user, ...updates };
      localStorage.setItem('ubas_user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to update profile' };
    }
  };

  const logout = () => {
    localStorage.removeItem('ubas_user');
    localStorage.removeItem('ubas_token');
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    register,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
