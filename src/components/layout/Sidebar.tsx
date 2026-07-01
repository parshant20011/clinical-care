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
  onToggle: () => void;
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const { name, role } = useUser();
  const initials = name.split(" ").map((n) => n[0]).join("");

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-sidebar flex flex-col transition-[width] duration-200",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div
        className={cn(
          "flex h-20 items-center gap-2 border-b border-sidebar-border",
          collapsed ? "justify-center px-0" : "px-5"
        )}
      >
        <div className="h-9 w-9 rounded-xl bg-blue-500 flex items-center justify-center shrink-0">
          <Heart className="h-5 w-5 text-white" />
        </div>
        {!collapsed && (
          <span className="text-lg font-semibold text-sidebar-foreground">CareFlow</span>
        )}
      </div>

      <nav className="flex flex-col gap-1 p-3 flex-1">
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to} className={collapsed ? "justify-center px-0" : ""}>
            <item.icon className="h-5 w-5 shrink-0" />
            {!collapsed && item.label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-sidebar-border">
        <button
          onClick={onToggle}
          className={cn(
            "w-full flex items-center gap-2 py-3.5 text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors",
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
            collapsed ? "justify-center px-0" : "px-5"
          )}
        >
          <div className="h-9 w-9 rounded-full bg-sidebar-accent flex items-center justify-center text-sidebar-foreground text-xs font-medium shrink-0">
            {initials}
          </div>
          {!collapsed && (
            <>
              <div className="min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">{name}</p>
                <p className="text-xs text-sidebar-foreground/60 truncate">{role}</p>
              </div>
              <button
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
