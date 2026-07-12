import { Bell, ChevronDown, Menu, Search, User } from "lucide-react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { appNotifications } from "@/data/mockData";
import { useAuth } from "@/context/AuthContext";
import { ROLE_LABELS, type Role } from "@clinical/shared";
import { cn } from "@/lib/utils";

const pageMeta: Record<string, { title: string; subtitle: string }> = {
  "/residents": { title: "Residents", subtitle: "Manage and view all resident information" },
  "/tasks": { title: "Tasks", subtitle: "Manage and track all clinical tasks" },
  "/documents": { title: "Documents", subtitle: "Global document repository" },
  "/reports": { title: "Reports", subtitle: "Analytics and reporting dashboard" },
  "/settings": { title: "Settings", subtitle: "Manage your account and system preferences" },
};

interface HeaderProps {
  collapsed: boolean;
  onMenuClick: () => void;
}

export default function Header({ collapsed, onMenuClick }: HeaderProps) {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  const name = user?.name ?? "";
  const role = user ? (ROLE_LABELS[user.role as Role] ?? user.role) : "";
  const firstName = name.split(" ")[0];

  const meta =
    pathname === "/"
      ? { title: "Dashboard", subtitle: `Welcome back, ${firstName}. Here's what's happening today.` }
      : Object.entries(pageMeta).find(([p]) => pathname.startsWith(p))?.[1] ?? {
          title: "",
          subtitle: "",
        };

  return (
    <header
      className={cn(
        "fixed top-0 right-0 z-30 h-16 sm:h-20 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-2 sm:gap-4 px-4 sm:px-6 lg:px-8 transition-[left] duration-200 left-0",
        collapsed ? "lg:left-20" : "lg:left-64"
      )}
    >
      <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0 lg:hidden"
          onClick={onMenuClick}
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="min-w-0">
          <h1 className="text-lg sm:text-xl lg:text-2xl font-bold leading-tight truncate">{meta.title}</h1>
          {meta.subtitle && (
            <p className="text-xs sm:text-sm text-muted-foreground truncate hidden sm:block">
              {meta.subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        <div className="relative w-48 xl:w-[22rem] hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search residents, tasks..."
            className="border-0 bg-slate-100 focus-visible:ring-0 h-10 pl-9 rounded-lg"
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative shrink-0">
              <Bell className="h-5 w-5" />
              {appNotifications.length > 0 && (
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72 max-w-[calc(100vw-2rem)]">
            <DropdownMenuLabel className="flex items-center justify-between">
              Notifications
              <Badge variant="secondary" className="text-xs">
                {appNotifications.length} new
              </Badge>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {appNotifications.map((n) => (
              <DropdownMenuItem key={n.id} className="flex-col items-start gap-0.5 whitespace-normal">
                <span className="text-sm">{n.title}</span>
                <span className="text-xs text-muted-foreground">{n.timeAgo}</span>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-blue-600 justify-center">
              View all notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 px-2 sm:px-3">
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                <User className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-sm font-medium leading-none">{name}</p>
                <p className="text-xs text-muted-foreground hidden md:block">{role}</p>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground hidden sm:block" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="flex flex-col">
              <span>{name}</span>
              <span className="text-xs font-normal text-muted-foreground">
                {user?.email}
              </span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2">
              <User className="h-4 w-4" />
              {role}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive" onClick={() => void logout()}>
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
