import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../lib/api';

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
      const resp = await authAPI.login({ email: credentials.username, password: credentials.password });
      if (!resp.success) return { success: false, error: resp.message || 'Invalid credentials' };
      
      const token = resp.token;
      if (!token) return { success: false, error: 'No token received' };
      
      // Store token and fetch user profile using whoami
      localStorage.setItem('ubas_token', token);
      
      // Get user profile from whoami endpoint
      const whoamiResp = await userAPI.whoami();
      if (whoamiResp.authenticated && whoamiResp.id && whoamiResp.email) {
        // Get full profile
        const profileResp = await userAPI.getProfile();
        if (profileResp.success && profileResp.data) {
          const u = profileResp.data;
          const userData = {
            id: u.id,
            username: u.email,
            email: u.email,
            accountType: u.account_type || 'personal',
            accountNumber: `UBAS${Math.random().toString().substr(2, 9)}`,
            fullName: `${u.first_name || ''} ${u.last_name || ''}`.trim(),
            phoneNumber: u.phone || '',
            isVerified: u.is_verified || false,
            kycStatus: u.kyc_status || 'pending',
            createdAt: new Date(u.created_at || Date.now()).toISOString().split('T')[0]
          };
          localStorage.setItem('ubas_user', JSON.stringify(userData));
          setUser(userData);
          return { success: true };
        }
      }
      
      // Fallback to minimal user data from whoami if profile fails
      const userData = {
        id: whoamiResp.id || '',
        username: whoamiResp.email || credentials.username,
        email: whoamiResp.email || credentials.username,
        accountType: 'personal' as const,
        accountNumber: `UBAS${Math.random().toString().substr(2, 9)}`,
        fullName: credentials.username,
        phoneNumber: '',
        isVerified: false,
        kycStatus: 'pending' as const,
        createdAt: new Date().toISOString().split('T')[0]
      };
      localStorage.setItem('ubas_user', JSON.stringify(userData));
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

      const resp = await authAPI.register({
        email: userData.email,
        password: userData.password,
        firstName: userData.fullName.split(' ')[0],
        lastName: userData.fullName.split(' ').slice(1).join(' ') || userData.fullName.split(' ')[0],
        phone: userData.phoneNumber,
        dateOfBirth: '1990-01-01',
        accountType: userData.accountType,
      } as any);
      if (!resp.success) return { success: false, error: resp.message || 'Registration failed' };

      // Create user object for frontend
      const newUser: User = {
        id: (resp as any).data.userId,
        username: userData.email,
        email: userData.email,
        accountType: userData.accountType,
        accountNumber: (resp as any).data.accountNumber,
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
