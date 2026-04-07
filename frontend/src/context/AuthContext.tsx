import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { loginUser, registerUser, ApiUser } from "../services/api";

interface User {
  id: string;
  username: string;
  email: string;
  role: 'PLAYER' | 'ADMIN';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isGuest: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const TOKEN_KEY = "pixelops_token";

function parseJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore session from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(TOKEN_KEY);
    if (stored) {
      const payload = parseJwtPayload(stored);
      if (payload && typeof payload.sub === "string") {
        // Reconstruct minimal user from JWT payload
        setToken(stored);
        setUser({
          id: payload.sub as string,
          username: (payload.username as string) ?? "Player",
          email: (payload.email as string) ?? "",
          role: (payload.role as User["role"]) ?? "PLAYER",
        });
      } else {
        localStorage.removeItem(TOKEN_KEY);
      }
    }
    setLoading(false);
  }, []);

  const storeSession = (tok: string, apiUser: ApiUser) => {
    localStorage.setItem(TOKEN_KEY, tok);
    setToken(tok);
    setUser({
      id: apiUser.id,
      username: apiUser.username,
      email: apiUser.email,
      role: (apiUser.role === 'ADMIN' ? 'ADMIN' : 'PLAYER') as User['role'],
    });
  };

  const login = async (email: string, password: string) => {
    const res = await loginUser(email, password);
    storeSession(res.access_token, res.user);
  };

  const signup = async (username: string, email: string, password: string) => {
    const res = await registerUser(username, email, password);
    storeSession(res.access_token, res.user);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isGuest: user === null,
        loading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
