import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id?: number | string;
  name?: string;
  email: string;
  role: 'admin' | 'customer';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; role?: string; redirect?: string; error?: string }>;
  register: (name: string, email: string, pass: string) => Promise<{ success: boolean; role?: string; redirect?: string; error?: string }>;
  logout: () => void;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const savedUser = localStorage.getItem('mrmango_user');
      const isAdminAuth = localStorage.getItem('mrmango_admin_auth') === 'true';
      if (savedUser) {
        return JSON.parse(savedUser);
      } else if (isAdminAuth) {
        return { email: 'mango@gmail.com', name: 'Store Administrator', role: 'admin' };
      }
    } catch {
      // ignore JSON parse error
    }
    return null;
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin' || localStorage.getItem('mrmango_admin_auth') === 'true';

  const login = async (email: string, pass: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password: pass.trim() })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        const loggedUser: User = data.user || {
          email: email.trim(),
          name: data.role === 'admin' ? 'Store Administrator' : email.split('@')[0],
          role: data.role
        };
        setUser(loggedUser);
        localStorage.setItem('mrmango_user', JSON.stringify(loggedUser));
        if (data.role === 'admin') {
          localStorage.setItem('mrmango_admin_auth', 'true');
        }
        return { success: true, role: data.role, redirect: data.redirect };
      } else {
        return { success: false, error: data.error || 'Invalid credentials' };
      }
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error' };
    }
  };

  const register = async (name: string, email: string, pass: string) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), password: pass.trim() })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        const newUser: User = data.user || {
          name: name.trim() || 'Customer',
          email: email.trim(),
          role: data.role
        };
        setUser(newUser);
        localStorage.setItem('mrmango_user', JSON.stringify(newUser));
        if (data.role === 'admin') {
          localStorage.setItem('mrmango_admin_auth', 'true');
        }
        return { success: true, role: data.role, redirect: data.redirect };
      } else {
        return { success: false, error: data.error || 'Registration failed' };
      }
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('mrmango_user');
    localStorage.removeItem('mrmango_admin_auth');
    sessionStorage.removeItem('mrmango_admin_auth');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isAdmin,
        login,
        register,
        logout,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
