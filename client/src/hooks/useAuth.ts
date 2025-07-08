import { useState, useEffect } from "react";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = () => {
    window.location.href = "/api/login";
  };

  const loginWithGoogle = () => {
    window.location.href = "/auth/google/login";
  };

  const logout = () => {
    window.location.href = "/api/auth/logout";
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    loginWithGoogle,
    logout,
  };
}