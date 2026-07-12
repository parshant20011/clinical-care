import { useState } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@clinical/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { ApiError } from "@/lib/apiClient";

export default function Login() {
  const { user, isLoading, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  // Already signed in? Bounce to where they were headed (or the dashboard).
  if (!isLoading && user) {
    const to = (location.state as { from?: string })?.from ?? "/";
    return <Navigate to={to} replace />;
  }

  const onSubmit = async (values: LoginInput) => {
    setFormError(null);
    try {
      await login(values.email, values.password);
      const to = (location.state as { from?: string })?.from ?? "/";
      navigate(to, { replace: true });
    } catch (err) {
      setFormError(
        err instanceof ApiError ? err.message : "Something went wrong. Please try again.",
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="h-9 w-9 rounded-xl bg-blue-500 flex items-center justify-center">
            <Heart className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-semibold">CareFlow</span>
        </div>

        <div className="bg-white border rounded-xl p-6 shadow-sm">
          <h1 className="text-lg font-bold">Sign in</h1>
          <p className="text-sm text-muted-foreground mt-0.5 mb-5">
            Access the clinical management system.
          </p>

          {formError && (
            <div className="mb-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              {formError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="username"
                placeholder="you@care.com"
                className="mt-1.5"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                className="mt-1.5"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-xs text-red-600 mt-1">{errors.password.message}</p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Signing in…" : "Sign in"}
            </Button>
          </form>

          <p className="text-xs text-muted-foreground mt-5 text-center">
            Demo: <code>l.brown@care.com</code> · <code>Password123!</code>
          </p>
        </div>
      </div>
    </div>
  );
}
