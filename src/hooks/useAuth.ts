"use client";

import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { RootState, AppDispatch } from "@/store";
import {
  setTokens,
  clearAuth as clearAuthTokens,
} from "@/store/slices/authSlice";

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: RootState) => state.auth) as {
    user: any | null;
    admin: any | null;
    accessToken: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    role: "user" | "admin" | null;
  };
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored tokens on app load
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    if (accessToken && refreshToken) {
      dispatch(setTokens({ accessToken, refreshToken }));
    }

    setIsLoading(false);
  }, [dispatch]);

  const saveTokens = (accessToken: string, refreshToken: string) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    dispatch(setTokens({ accessToken, refreshToken }));
  };

  const clearTokens = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    dispatch(clearAuthTokens());
  };

  return {
    user: auth.user,
    admin: auth.admin,
    accessToken: auth.accessToken,
    refreshToken: auth.refreshToken,
    isAuthenticated: !!auth.accessToken,
    isLoading: isLoading || auth.isLoading,
    role: auth.role,
    error: auth.error,
    saveTokens,
    clearTokens,
  };
};
