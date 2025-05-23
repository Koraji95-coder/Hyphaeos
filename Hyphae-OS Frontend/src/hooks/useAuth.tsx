import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import type { User } from '@/types';

type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (email: string, password: string, pin?: string) => Promise<any>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

// ✅ Dev-only: mock refreshToken
export async function refreshToken() {
  return 'mock_token_123';
}

// ✅ Dev-only: mock getProfile
export async function getProfile(token: string): Promise<User> {
  return {
    id: 'abc123',
    username: 'owner_dusty',
    email: 'owner@hyphae.local',
    role: 'owner',
    avatar: '',
    deviceId: 'dev-01',
    pinVerified: true
  };
}

// ✅ Dev-only: mock login
export async function login(email: string, password: string, pin?: string) {
  if (email.length >= 3 && password.length >= 6) {
    return { token: 'mock_token_123' };
  }
  return { error: "Invalid credentials" };
}

// ✅ Dev-only: mock logout
export function logout() {
  console.log('Logged out');
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const newToken = await refreshToken();
        setToken(newToken);
        const data = await getProfile(newToken);
        setUser(data);
      } catch {
        setUser(null);
        setToken(null);
      }
    };
    init();
  }, []);

  const loginUser = async (email: string, password: string, pin?: string) => {
    const response = await login(email, password, pin);
    if (response.token) {
      setToken(response.token);
      const data = await getProfile(response.token);
      setUser(data);
    }
    return response;
  };

  const logoutUser = () => {
    logout();
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login: loginUser, logout: logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
