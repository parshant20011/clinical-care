import { Navigate, useLocation, Outlet } from "react-router-dom";
import { Heart } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

// Gate for the whole authenticated app. While /auth/me is resolving we show a
// splash; if there's no user, redirect to /login (remembering where they were
// headed so login can send them back).
export default function ProtectedRoute() {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <div className="h-9 w-9 rounded-xl bg-blue-500 flex items-center justify-center animate-pulse">
            <Heart className="h-5 w-5 text-white" />
          </div>
          <span className="text-sm">Loading…</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
