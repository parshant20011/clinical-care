import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-5xl sm:text-6xl font-bold text-muted-foreground">404</h1>
      <p className="text-lg sm:text-xl font-medium">Page not found</p>
      <p className="text-sm text-muted-foreground">
        The page you're looking for doesn't exist.
      </p>
      <Button onClick={() => navigate("/")}>
        <Home className="h-4 w-4 mr-2" />
        Go Home
      </Button>
    </div>
  );
}
