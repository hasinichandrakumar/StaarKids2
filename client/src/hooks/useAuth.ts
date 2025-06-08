import { useQuery } from "@tanstack/react-query";

export function useAuth() {
  const { data: user, isLoading } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
  });

  const login = () => {
    window.location.href = "/api/login";
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
  };
}
