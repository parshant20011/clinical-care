import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { UserProvider } from "@/context/UserContext";
import { cn } from "@/lib/utils";

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <UserProvider>
      <div className="min-h-screen bg-slate-50">
        <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
        <Header collapsed={collapsed} />
        <main
          className={cn(
            "mt-20 px-8 py-6 transition-[margin] duration-200",
            collapsed ? "ml-20" : "ml-64"
          )}
        >
          <Outlet />
        </main>
      </div>
    </UserProvider>
  );
}
