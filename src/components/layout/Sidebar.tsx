import {
  LayoutDashboard,
  Users,
  ClipboardList,
  FileText,
  BarChart3,
  Settings,
  Heart,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/residents", icon: Users, label: "Residents" },
  { to: "/tasks", icon: ClipboardList, label: "Tasks" },
  { to: "/documents", icon: FileText, label: "Documents" },
  { to: "/reports", icon: BarChart3, label: "Reports" },
  { to: "/settings", icon: Settings, label: "Settings" },
];

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar border-r border-sidebar-border">
      <div className="flex h-16 items-center gap-2 px-4 border-b border-sidebar-border">
        <Heart className="h-6 w-6 text-blue-400" />
        <span className="text-lg font-semibold text-sidebar-foreground">
          ClinicalCare
        </span>
      </div>
      <nav className="flex flex-col gap-1 p-3 mt-2">
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to}>
            <item.icon className="h-4 w-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
