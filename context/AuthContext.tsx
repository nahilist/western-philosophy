"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthModalOpen: boolean;
  pendingCourseId: string | null;
  login: (email: string, pass: string) => Promise<boolean>;
  signUp: (name: string, email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  openAuthModal: (pendingCourseId?: string) => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [pendingCourseId, setPendingCourseId] = useState<string | null>(null);

  // Check persisted demo login in localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("philosophy_user");
      if (saved) {
        setUser(JSON.parse(saved));
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  const login = async (email: string): Promise<boolean> => {
    // Frontend mock - ready to plug into Supabase later:
    // const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    const dummyUser: User = {
      id: "usr_" + Date.now(),
      name: email.split("@")[0] || "Philosopher",
      email,
    };
    setUser(dummyUser);
    localStorage.setItem("philosophy_user", JSON.stringify(dummyUser));
    setIsAuthModalOpen(false);
    return true;
  };

  const signUp = async (name: string, email: string): Promise<boolean> => {
    // Frontend mock - ready to plug into Supabase later:
    // const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { name } } });
    const dummyUser: User = {
      id: "usr_" + Date.now(),
      name: name || email.split("@")[0] || "Seeker of Wisdom",
      email,
    };
    setUser(dummyUser);
    localStorage.setItem("philosophy_user", JSON.stringify(dummyUser));
    setIsAuthModalOpen(false);
    return true;
  };

  const logout = () => {
    // Supabase later: await supabase.auth.signOut();
    setUser(null);
    localStorage.removeItem("philosophy_user");
  };

  const openAuthModal = (courseId?: string) => {
    if (courseId) setPendingCourseId(courseId);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthModalOpen,
        pendingCourseId,
        login,
        signUp,
        logout,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

