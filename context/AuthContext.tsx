// tomato-classification-frontend/context/AuthContext.tsx
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "@/lib/axios";
import { setAccessToken } from "@/lib/axios";
import { User } from "@/types/user";
import { useMe } from "@/hooks/useMe";
import { useQueryClient } from "@tanstack/react-query";

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [bootstrapped, setBootstrapped] = useState(false);
  const me = useMe(bootstrapped)
  const queryClient = useQueryClient()

  const login = async (email: string, password: string): Promise<User> => {
    const res = await axios.post("/auth/login", { email, password });

    if (!res.data.success) {
      throw new Error(res.data.message);
    }

    const user = res.data.data.user;

    queryClient.setQueryData(["users", "me"], user);

    return user;
  };

  const logout = async () => {
    try {
      await axios.post("/auth/logout");
    } finally {
      setAccessToken(null);
      queryClient.removeQueries({ queryKey: ["users", "me"] });
    }
  };

  const refreshAccessToken = async () => {
    try {
      await axios.post("/auth/refresh");
    } catch (err) {
      queryClient.removeQueries({ queryKey: ["users", "me"] });
    } finally {
      setBootstrapped(true);
    }
  };

  useEffect(() => {
    refreshAccessToken();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user: me.data ?? null,
        isLoading: me.isLoading,
        isAuthenticated: me.isSuccess,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
