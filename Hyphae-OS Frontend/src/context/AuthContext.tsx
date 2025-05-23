import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  username: string;
  role: 'owner' | 'admin' | 'system';
  avatar?: string;
  deviceId?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  verifyPin: (pin: string) => Promise<boolean>;
  logout: () => void;
}

const generateDeviceId = () => {
  const nav = window.navigator;
  const screen = window.screen;
  const hash = (str: string) => {
    let h = 0;
    for (let i = 0; i < str.length; i++) {
      h = ((h << 5) - h) + str.charCodeAt(i);
      h = h & h;
    }
    return Math.abs(h).toString(16);
  };

  const deviceFingerprint = [
    nav.userAgent,
    screen.height,
    screen.width,
    nav.language,
    nav.platform,
  ].join('');

  return hash(deviceFingerprint);
};

const defaultAuthContext: AuthContextType = {
  user: null,
  isAuthenticated: false,
  login: async () => false,
  verifyPin: async () => false,
  logout: () => {},
};

const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = async (username: string, password: string): Promise<boolean> => {
    // Simulate role-based authentication
    if (username.length >= 3 && password.length >= 6) {
      let role: User['role'] = 'admin';
      
      // Determine role based on username prefix
      if (username.startsWith('owner_')) {
        role = 'owner';
      } else if (username.startsWith('sys_')) {
        role = 'system';
      }

      setUser({
        id: Math.random().toString(36).substr(2, 9),
        username,
        role,
        deviceId: generateDeviceId(),
      });
      return true;
    }
    return false;
  };

  const verifyPin = async (pin: string): Promise<boolean> => {
    if (pin === '1234' || pin.length === 4) {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, verifyPin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};