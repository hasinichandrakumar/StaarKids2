import { useQuery } from "@tanstack/react-query";

export function useAuth() {
  const { data: user, isLoading } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
  });

  const login = () => {
    window.location.href = "/api/login";
  };

  const loginWithGoogle = () => {
    window.location.href = "/api/auth/google";
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
  };
}
