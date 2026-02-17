
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, AuthState } from '../types';
import { authApi } from '../services/api';

interface AuthContextType extends AuthState {
  login: (email: string, passwordOrRole: string | UserRole) => Promise<void>;
  forgot: (email: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  updateUserUsage: (usageType: 'ai' | 'schedule' | 'image') => void;
  updatePlan: (planId: string) => Promise<void>;
  updateProfile: (updates: Partial<User>) => void;
  setUser: (user: User) => void;
  // Added checkAuth to type definition to fix provider and consumer errors
  checkAuth: () => Promise<void>;

}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
  });

  const checkAuth = async () => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (savedToken) {
      try {
        // Attempt to get fresh data from API (or simulation)
        const response = await authApi.getMe();
        const user = response.data;
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
          setState({
            token: savedToken,
            user,
            isAuthenticated: true,
          });
          return;
        }
      } catch (err) {
        console.warn("Auth check failed, using local cache");
      }

      // Fallback to local storage if API is down
      if (savedUser) {
        setState({
          token: savedToken,
          user: JSON.parse(savedUser),
          isAuthenticated: true,
        });
      }
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email: string, passwordOrRole: string | UserRole) => {
    try {
      const response = await authApi.login({ email, password: passwordOrRole });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setState({ user, token, isAuthenticated: true });
      window.location.pathname = '/dashboard';
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData: any) => {
    try {
      const response = await authApi.register(userData);
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setState({ user, token, isAuthenticated: true });
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setState({ user: null, token: null, isAuthenticated: false });
    window.location.pathname = '/login';
  };

    const forgot = async (email: string) => {
      try {
        await authApi.forgotPassword(email);
      } catch (error) {
        throw error;
      }
    };

  const updatePlan = async (planId: string) => {
    try {
      await authApi.purchasePlan(planId);
      const response = await authApi.getMe();
      const updatedUser = response.data;
      setUser(updatedUser);
    } catch (err) {
      console.error("Failed to update plan", err);
      throw err;
    }
  };

  const setUser = (user: User) => {
    localStorage.setItem('user', JSON.stringify(user));
    setState(prev => ({ 
      ...prev, 
      user, 
      isAuthenticated: true,
      token: prev.token || localStorage.getItem('token')
    }));
  };

  const updateProfile = (updates: Partial<User>) => {
    const currentUser = state.user || JSON.parse(localStorage.getItem('user') || 'null');
    if (!currentUser) return;

    const updatedUser = { ...currentUser, ...updates };
   
    setUser(updatedUser);
  };

  const updateUserUsage = (usageType: 'ai' | 'schedule' | 'image') => {
    const currentUser = state.user || JSON.parse(localStorage.getItem('user') || 'null');
    // console.log("Updating user usage for type:", usageType, "Current user:", currentUser);
    if (!currentUser) return;
    const updatedUser = { ...currentUser };
    if (usageType === 'ai') updatedUser.usage.aiGenerationsThisMonth += 1;
    if (usageType === 'schedule') updatedUser.usage.scheduledToday += 1;
    if (usageType === 'image') updatedUser.usage.aiImagesThisMonth ? updatedUser.usage.aiImagesThisMonth += 1 : updatedUser.usage.aiImagesThisMonth = 1;
    // console.log('first', updatedUser.usage)
    authApi.updateProfile(currentUser._id, updatedUser).catch(err => {
      console.error("Failed to update profile", err);
    });
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ ...state, login, forgot ,register, logout, updateUserUsage, updatePlan, updateProfile, setUser, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
