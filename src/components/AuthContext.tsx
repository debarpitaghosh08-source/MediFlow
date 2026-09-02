"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth, isFirebaseConfigured } from "@/lib/firebase";
import { User, UserRole } from "@/types";

interface AuthContextType {
  user: User | null;
  profile: any;
  login: (method: string, data: any) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("mediflow_user");
    const savedProfile = localStorage.getItem("mediflow_profile");
    if (saved) {
      setUser(JSON.parse(saved));
      if (savedProfile) setProfile(JSON.parse(savedProfile));
    }
  }, []);

  const login = async (method: string, data: any): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ method, ...data }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Login failed");
      }

      const result = await res.json();
      setUser(result.user);
      setProfile(result.profile);
      localStorage.setItem("mediflow_user", JSON.stringify(result.user));
      localStorage.setItem("mediflow_profile", JSON.stringify(result.profile));
      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setProfile(null);
    localStorage.removeItem("mediflow_user");
    localStorage.removeItem("mediflow_profile");

    if (isFirebaseConfigured && auth && auth.currentUser) {
      signOut(auth).catch((error) => console.error("Firebase sign out failed:", error));
    }
  };

  const switchRole = async (role: UserRole) => {
    await login("demo", { role });
  };

  return (
    <AuthContext.Provider value={{ user, profile, login, logout, isLoading, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
