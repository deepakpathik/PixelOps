import { createContext, useContext, useState, ReactNode } from "react";

interface User {
  username: string;
  level: number;
}

interface AuthContextType {
  user: User | null;
  isGuest: boolean;
  login: (username: string) => void;
  signup: (username: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (username: string) => {
    setUser({ username, level: 1 });
  };

  const signup = (username: string) => {
    setUser({ username, level: 1 });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isGuest: user === null,
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
