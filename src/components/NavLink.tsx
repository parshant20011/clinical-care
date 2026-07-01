import { NavLink as RouterNavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
}

export function NavLink({ to, children, className }: NavLinkProps) {
  return (
    <RouterNavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 rounded-lg px-3 py-2.5 text-[15px] font-medium transition-colors",
          isActive
            ? "bg-sidebar-accent text-white"
            : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-white",
          className
        )
      }
    >
      {children}
    </RouterNavLink>
  );
}
