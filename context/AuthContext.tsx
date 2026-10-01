"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { loginSchema, signupSchema } from "@/lib/validations/auth";

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
  const [isSupabaseConnected] = useState(() => createClient().isConfigured);

  // Initialize Supabase Client
  useEffect(() => {
    const { isConfigured, client: supabase } = createClient();

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
      const restoreTimer = window.setTimeout(() => {
        try {
          const saved = localStorage.getItem("philosophy_user");
          if (saved) setUser(JSON.parse(saved));
        } catch {
          // Ignore localStorage errors
        }
      }, 0);
      return () => window.clearTimeout(restoreTimer);
    }
  }, []);

  const login = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    const validation = loginSchema.safeParse({ email, password: pass });
    if (!validation.success) {
      return { success: false, error: validation.error.issues[0]?.message ?? "Invalid credentials." };
    }
    const { isConfigured, client: supabase } = createClient();

    if (isConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: validation.data.email,
          password: validation.data.password,
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
      } catch (networkErr: unknown) {
        return {
          success: false,
          error:
            networkErr instanceof Error
              ? networkErr.message
              : "Network error connecting to authentication service",
        };
      }
    }

    if (process.env.NODE_ENV === "production") {
      return { success: false, error: "Authentication service is not configured." };
    }

    // Development-only demo fallback.
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
    const validation = signupSchema.safeParse({ full_name: name, email, password: pass });
    if (!validation.success) {
      return { success: false, error: validation.error.issues[0]?.message ?? "Invalid registration." };
    }
    const { isConfigured, client: supabase } = createClient();

    if (isConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email: validation.data.email,
          password: validation.data.password,
          options: {
            data: {
              full_name: validation.data.full_name,
            },
          },
        });

        if (error) {
          return { success: false, error: error.message };
        }

        if (data.user) {
          setUser({
            id: data.user.id,
            name: validation.data.full_name,
            email: data.user.email || "",
          });
        }
        setIsAuthModalOpen(false);
        return { success: true };
      } catch (networkErr: unknown) {
        return {
          success: false,
          error:
            networkErr instanceof Error
              ? networkErr.message
              : "Network error connecting to registration service",
        };
      }
    }

    if (process.env.NODE_ENV === "production") {
      return { success: false, error: "Registration service is not configured." };
    }

    // Development-only demo fallback.
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
      } catch (err: unknown) {
        return {
          success: false,
          error:
            err instanceof Error
              ? err.message
              : `Failed to initiate ${provider} authentication.`,
        };
      }
    }

    if (process.env.NODE_ENV === "production") {
      return { success: false, error: "OAuth service is not configured." };
    }

    // Development-only demo fallback for OAuth.
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
