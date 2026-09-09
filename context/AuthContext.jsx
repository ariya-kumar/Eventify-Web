import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from '../src/utils/axios';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }
    axios.get('/auth/me')
      .then(res => {
        const data = res.data;
        if (data.status === 'success' && data.data?.user) {
          setCurrentUser(data.data.user);
        } else {
          localStorage.removeItem('token');
        }
      })
      .catch(() => localStorage.removeItem('token'))
      .finally(() => setLoading(false));
  }, []);

  const registerUser = async (userData) => {
    setLoading(true);
    try {
      const response = await axios.post('/auth/register/user', userData);
      const responseData = response.data;

      if (!responseData.data || !responseData.data.user) {
        throw new Error('Invalid response from server');
      }

      localStorage.setItem('token', responseData.token);
      setCurrentUser(responseData.data.user);
      return responseData;
    } catch (error) {
      console.error('Registration error:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Registration failed';
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const registerOrganizer = async (organizerData) => {
    setLoading(true);
    try {
      const response = await axios.post('/auth/register/organizer', organizerData);
      const responseData = response.data;

      if (!responseData.data || !responseData.data.user) {
        throw new Error('Invalid response from server');
      }

      localStorage.setItem('token', responseData.token);
      setCurrentUser(responseData.data.user);
      return responseData;
    } catch (error) {
      console.error('Organizer registration error:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Registration failed';
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password, isOrganizer) => {
    setLoading(true);
    try {
      const response = await axios.post('/auth/login', { email, password, isOrganizer });
      const responseData = response.data;

      if (!responseData.data || !responseData.data.user) {
        throw new Error('Invalid response from server');
      }

      localStorage.setItem('token', responseData.token);
      setCurrentUser(responseData.data.user);
    } catch (error) {
      console.error('Login error:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Login failed';
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
  };

  const getToken = () => localStorage.getItem('token');

  return (
    <AuthContext.Provider value={{
      currentUser,
      login,
      registerUser,
      registerOrganizer,
      logout,
      loading,
      getToken
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};