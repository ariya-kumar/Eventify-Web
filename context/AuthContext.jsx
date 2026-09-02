import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(undefined);

const API_URL = '/api';

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }
    fetch(`${API_URL}/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
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
      const response = await fetch(`${API_URL}/auth/register/user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'Registration failed');
      }

      if (!responseData.data || !responseData.data.user) {
        throw new Error('Invalid response from server');
      }

      localStorage.setItem('token', responseData.token);
      setCurrentUser(responseData.data.user);
      return responseData;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const registerOrganizer = async (organizerData) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/register/organizer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(organizerData)
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'Registration failed');
      }

      if (!responseData.data || !responseData.data.user) {
        throw new Error('Invalid response from server');
      }

      localStorage.setItem('token', responseData.token);
      setCurrentUser(responseData.data.user);
      return responseData;
    } catch (error) {
      console.error('Organizer registration error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password, isOrganizer) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, isOrganizer })
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'Login failed');
      }

      if (!responseData.data || !responseData.data.user) {
        throw new Error('Invalid response from server');
      }

      localStorage.setItem('token', responseData.token);
      setCurrentUser(responseData.data.user);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
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