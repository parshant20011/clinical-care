import { createContext, useContext, type ReactNode } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, ApiError } from "@/lib/apiClient";
import type { AuthUser } from "@clinical/shared";

// Real authentication state, sourced from the backend's /auth/me endpoint
// (replaces the old hardcoded UserContext). While /auth/me is loading we show a
// splash; if it 401s, the user is treated as logged out and the route guard
// sends them to /login.

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      try {
        const res = await api.get<{ user: AuthUser }>("/auth/me");
        // /auth/me returns { user }, and apiClient unwraps { data } but this
        // endpoint has no data wrapper, so res is the raw { user } object.
        return (res as unknown as { user: AuthUser }).user ?? (res as unknown as AuthUser);
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) return null;
        throw err;
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  const loginMutation = useMutation({
    mutationFn: (creds: { email: string; password: string }) =>
      api.post<{ user: AuthUser }>("/auth/login", creds),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["auth", "me"] }),
  });

  const logoutMutation = useMutation({
    mutationFn: () => api.post("/auth/logout"),
    onSuccess: () => {
      queryClient.setQueryData(["auth", "me"], null);
      queryClient.clear(); // drop all cached tenant data on logout
    },
  });

  const value: AuthContextValue = {
    user: user ?? null,
    isLoading,
    login: async (email, password) => {
      await loginMutation.mutateAsync({ email, password });
    },
    logout: async () => {
      await logoutMutation.mutateAsync();
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
