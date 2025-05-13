import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      checkAuth(token);
    } else {
      setLoading(false);
    }
  }, []);

  const checkAuth = async (token) => {
    try {
      console.log('Checking auth with token:', token);
<<<<<<< HEAD
      const response = await axios.get('https://crm-1-30zn.onrender.com/api/auth/me', {
=======
      const response = await axios.get('http://localhost:5000/api/auth/me', {
>>>>>>> 8af402ad195f69e7d8b30f4e0a92cb8a829c01e5
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Auth response:', response.data);
      if (response.data && response.data._id) {
        setUser(response.data);
      } else {
        console.error('Invalid user data received:', response.data);
        localStorage.removeItem('token');
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (token) => {
    console.log('Login called with token:', token);
    localStorage.setItem('token', token);
    await checkAuth(token);
  };

  const logout = async () => {
    try {
<<<<<<< HEAD
      await axios.get('https://crm-1-30zn.onrender.com/api/auth/logout');
=======
      await axios.get('http://localhost:5000/api/auth/logout');
>>>>>>> 8af402ad195f69e7d8b30f4e0a92cb8a829c01e5
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
    }
  };

  // Debug log when user state changes
  useEffect(() => {
    console.log('User state updated:', user);
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 