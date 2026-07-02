import {
  LayoutDashboard,
  Users,
  ClipboardList,
  FileText,
  BarChart3,
  Settings,
  Heart,
  ChevronLeft,
  ChevronRight,
  LogOut,
  X,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useUser } from "@/context/UserContext";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/residents", icon: Users, label: "Residents" },
  { to: "/tasks", icon: ClipboardList, label: "Tasks" },
  { to: "/documents", icon: FileText, label: "Documents" },
  { to: "/reports", icon: BarChart3, label: "Reports" },
  { to: "/settings", icon: Settings, label: "Settings" },
];

interface SidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  onToggle: () => void;
  onMobileClose: () => void;
}

export default function Sidebar({ collapsed, mobileOpen, onToggle, onMobileClose }: SidebarProps) {
  const { name, role } = useUser();
  const initials = name.split(" ").map((n) => n[0]).join("");
  const showLabels = mobileOpen || !collapsed;

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-50 h-screen bg-sidebar flex flex-col w-64 transition-transform duration-200 lg:transition-[width] lg:translate-x-0",
        mobileOpen ? "translate-x-0" : "-translate-x-full",
        collapsed ? "lg:w-20" : "lg:w-64"
      )}
    >
      <div
        className={cn(
          "flex h-16 sm:h-20 items-center gap-2 border-b border-sidebar-border shrink-0",
          showLabels ? "justify-between px-5" : "justify-center px-0 lg:justify-center"
        )}
      >
        <div className={cn("flex items-center gap-2", !showLabels && "lg:justify-center")}>
          <div className="h-9 w-9 rounded-xl bg-blue-500 flex items-center justify-center shrink-0">
            <Heart className="h-5 w-5 text-white" />
          </div>
          {showLabels && (
            <span className="text-lg font-semibold text-sidebar-foreground">CareFlow</span>
          )}
        </div>
        <button
          type="button"
          onClick={onMobileClose}
          className="text-sidebar-foreground/70 hover:text-sidebar-foreground lg:hidden"
          aria-label="Close menu"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex flex-col gap-1 p-3 flex-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onMobileClose}
            className={showLabels ? "" : "lg:justify-center lg:px-0"}
          >
            <item.icon className="h-5 w-5 shrink-0" />
            {showLabels && item.label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-sidebar-border shrink-0">
        <button
          type="button"
          onClick={onToggle}
          className={cn(
            "hidden lg:flex w-full items-center gap-2 py-3.5 text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors",
            collapsed ? "justify-center px-0" : "px-5"
          )}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4" />
              Collapse
            </>
          )}
        </button>
        <div
          className={cn(
            "flex items-center gap-3 py-3.5 border-t border-sidebar-border",
            showLabels ? "px-5" : "justify-center px-0 lg:justify-center"
          )}
        >
          <div className="h-9 w-9 rounded-full bg-sidebar-accent flex items-center justify-center text-sidebar-foreground text-xs font-medium shrink-0">
            {initials}
          </div>
          {showLabels && (
            <>
              <div className="min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">{name}</p>
                <p className="text-xs text-sidebar-foreground/60 truncate">{role}</p>
              </div>
              <button
                type="button"
                className="ml-auto text-sidebar-foreground/60 hover:text-sidebar-foreground shrink-0"
                onClick={() => toast({ title: "Signed out" })}
              >
                <LogOut className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}
