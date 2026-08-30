import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('solex-token'));
  const [loading, setLoading] = useState(true);
  
  // Auth modal management
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('login'); // 'login', 'signup', 'forgot', 'reset'
  const [resetTokenData, setResetTokenData] = useState({ token: '', code: '', email: '' });
  
  // Simulated Email Inbox Modal
  const [emailSimulatorOpen, setEmailSimulatorOpen] = useState(false);
  const [inboxEmails, setInboxEmails] = useState([]);

  // Check initial token
  useEffect(() => {
    async function loadUser() {
      if (token) {
        try {
          const res = await api.getProfile(token);
          setUser(res.user);
        } catch (err) {
          console.error('Session expired:', err);
          logout();
        }
      }
      setLoading(false);
    }
    loadUser();
  }, [token]);

  // Load emails periodically or on demand
  const refreshInbox = async () => {
    try {
      const data = await api.getMailInbox();
      setInboxEmails(data.inbox || []);
    } catch (err) {
      console.error('Failed to load inbox:', err);
    }
  };

  useEffect(() => {
    refreshInbox();
  }, []);

  const openAuthModal = (tab = 'login', extraData = {}) => {
    setAuthModalTab(tab);
    if (extraData.token || extraData.code || extraData.email) {
      setResetTokenData(prev => ({ ...prev, ...extraData }));
    }
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  const login = async (email, password) => {
    const res = await api.login({ email, password });
    localStorage.setItem('solex-token', res.token);
    setToken(res.token);
    setUser(res.user);
    closeAuthModal();
    return res;
  };

  const register = async (name, email, password) => {
    const res = await api.register({ name, email, password });
    localStorage.setItem('solex-token', res.token);
    setToken(res.token);
    setUser(res.user);
    closeAuthModal();
    refreshInbox();
    return res;
  };

  const forgotPassword = async (email) => {
    const res = await api.forgotPassword(email);
    refreshInbox();
    if (res.debugMail) {
      setResetTokenData({
        token: res.debugMail.resetToken,
        code: res.debugMail.code,
        email: res.email
      });
    }
    return res;
  };

  const resetPassword = async ({ token, code, newPassword }) => {
    const res = await api.resetPassword({ token, code, newPassword });
    refreshInbox();
    return res;
  };

  const changePassword = async ({ currentPassword, newPassword }) => {
    if (!token) throw new Error('You must be logged in to change your password');
    const res = await api.changePassword({ currentPassword, newPassword }, token);
    return res;
  };

  const updateProfile = async (profileData) => {
    if (!token) throw new Error('Not authenticated');
    const res = await api.updateProfile(profileData, token);
    setUser(res.user);
    return res;
  };

  const logout = () => {
    localStorage.removeItem('solex-token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        authModalOpen,
        authModalTab,
        resetTokenData,
        setResetTokenData,
        openAuthModal,
        closeAuthModal,
        setAuthModalTab,
        emailSimulatorOpen,
        setEmailSimulatorOpen,
        inboxEmails,
        refreshInbox,
        login,
        register,
        forgotPassword,
        resetPassword,
        changePassword,
        updateProfile,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
