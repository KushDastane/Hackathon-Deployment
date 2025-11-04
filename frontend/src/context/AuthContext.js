import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkExistingToken();
  }, []);

  const checkExistingToken = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        // Verify token is still valid
        const response = await authService.getCurrentUser();
        setUser(response.data.user);
      } catch (error) {
        console.error('Token validation failed:', error);
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  };

  const login = async (username, password) => {
    try {
      console.log('Sending login request...'); // Debug
      const response = await authService.login(username, password);
      console.log('Login response:', response); // Debug
      
      if (response.data.success) {
        const { token, user } = response.data;
        
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
        
        return { success: true, user };
      } else {
        return { 
          success: false, 
          message: response.data.error || 'Login failed' 
        };
      }
    } catch (error) {
      console.error('Login API error:', error);
      
      // Better error handling
      if (error.response) {
        // Server responded with error status
        return { 
          success: false, 
          message: error.response.data.error || 'Login failed' 
        };
      } else if (error.request) {
        // Request was made but no response received
        return { 
          success: false, 
          message: 'Cannot connect to server. Please check if backend is running.' 
        };
      } else {
        // Something else happened
        return { 
          success: false, 
          message: error.message || 'Login failed' 
        };
      }
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};