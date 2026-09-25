"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthModalOpen: boolean;
  pendingCourseId: string | null;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (name: string, email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  signInWithOAuth: (provider: "google" | "github", forceDemo?: boolean) => Promise<{ success: boolean; error?: string; providerNotConfigured?: boolean }>;
  logout: () => Promise<void>;
  openAuthModal: (pendingCourseId?: string) => void;
  closeAuthModal: () => void;
  isSupabaseConnected: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [pendingCourseId, setPendingCourseId] = useState<string | null>(null);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState(false);

  // Initialize Supabase Client
  useEffect(() => {
    const { isConfigured, client: supabase } = createClient();
    setIsSupabaseConnected(isConfigured);

    if (isConfigured && supabase) {
      // 1. Get current active session safely
      supabase.auth
        .getUser()
        .then(({ data, error }) => {
          if (!error && data?.user) {
            setUser({
              id: data.user.id,
              name: data.user.user_metadata?.full_name || data.user.email?.split("@")[0] || "Philosopher",
              email: data.user.email || "",
            });
          }
        })
        .catch((err) => {
          console.warn("Supabase auth session fetch warning:", err?.message || err);
        });

      // 2. Listen to real-time auth changes (Sign in, Sign out, Token Refresh)
      try {
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
          if (session?.user) {
            setUser({
              id: session.user.id,
              name: session.user.user_metadata?.full_name || session.user.email?.split("@")[0] || "Philosopher",
              email: session.user.email || "",
            });
          } else {
            setUser(null);
          }
        });

        return () => {
          subscription.unsubscribe();
        };
      } catch (err) {
        console.warn("Supabase auth listener warning:", err);
      }
    } else {
      // Local fallback for testing before keys are entered
      try {
        const saved = localStorage.getItem("philosophy_user");
        if (saved) {
          setUser(JSON.parse(saved));
        }
      } catch {
        // Ignore localStorage errors
      }
    }
  }, []);

  const login = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    const { isConfigured, client: supabase } = createClient();

    if (isConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password: pass,
        });

        if (error) {
          return { success: false, error: error.message };
        }

        if (data.user) {
          setUser({
            id: data.user.id,
            name: data.user.user_metadata?.full_name || data.user.email?.split("@")[0] || "Philosopher",
            email: data.user.email || "",
          });
        }
        setIsAuthModalOpen(false);
        return { success: true };
      } catch (networkErr: any) {
        return {
          success: false,
          error: networkErr?.message || "Network error connecting to authentication service",
        };
      }
    }

    // Demo Mode Fallback:
    const dummyUser: User = {
      id: "usr_" + Date.now(),
      name: email.split("@")[0] || "Philosopher",
      email,
    };
    setUser(dummyUser);
    localStorage.setItem("philosophy_user", JSON.stringify(dummyUser));
    setIsAuthModalOpen(false);
    return { success: true };
  };

  const signUp = async (name: string, email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    const { isConfigured, client: supabase } = createClient();

    if (isConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password: pass,
          options: {
            data: {
              full_name: name,
            },
          },
        });

        if (error) {
          return { success: false, error: error.message };
        }

        if (data.user) {
          setUser({
            id: data.user.id,
            name: name || data.user.email?.split("@")[0] || "Seeker of Wisdom",
            email: data.user.email || "",
          });
        }
        setIsAuthModalOpen(false);
        return { success: true };
      } catch (networkErr: any) {
        return {
          success: false,
          error: networkErr?.message || "Network error connecting to registration service",
        };
      }
    }

    // Demo Mode Fallback:
    const dummyUser: User = {
      id: "usr_" + Date.now(),
      name: name || email.split("@")[0] || "Seeker of Wisdom",
      email,
    };
    setUser(dummyUser);
    localStorage.setItem("philosophy_user", JSON.stringify(dummyUser));
    setIsAuthModalOpen(false);
    return { success: true };
  };

  const signInWithOAuth = async (
    provider: "google" | "github",
    forceDemo = false
  ): Promise<{ success: boolean; error?: string; providerNotConfigured?: boolean }> => {
    const { isConfigured, client: supabase } = createClient();

    if (isConfigured && supabase && !forceDemo) {
      try {
        const { error } = await supabase.auth.signInWithOAuth({
          provider,
          options: {
            redirectTo: `${window.location.origin}/auth/callback`,
          },
        });

        if (error) {
          const errMsg = error.message || "";
          const isNotEnabled =
            errMsg.toLowerCase().includes("not enabled") ||
            errMsg.toLowerCase().includes("unsupported provider") ||
            errMsg.toLowerCase().includes("validation_failed");

          return {
            success: false,
            error: isNotEnabled
              ? `${provider.toUpperCase()} provider is not activated in your Supabase Dashboard yet.`
              : errMsg,
            providerNotConfigured: isNotEnabled,
          };
        }
        return { success: true };
      } catch (err: any) {
        return {
          success: false,
          error: err?.message || `Failed to initiate ${provider} authentication.`,
        };
      }
    }

    // Demo Mode fallback for OAuth
    const dummyUser: User = {
      id: `usr_${provider}_` + Date.now(),
      name: `${provider === "google" ? "Google" : "GitHub"} Scholar`,
      email: `${provider.toLowerCase()}.scholar@philosophy.org`,
    };
    setUser(dummyUser);
    localStorage.setItem("philosophy_user", JSON.stringify(dummyUser));
    setIsAuthModalOpen(false);
    return { success: true };
  };

  const logout = async () => {
    const { isConfigured, client: supabase } = createClient();
    if (isConfigured && supabase) {
      await supabase.auth.signOut();
    }
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
        signInWithOAuth,
        logout,
        openAuthModal,
        closeAuthModal,
        isSupabaseConnected,
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
