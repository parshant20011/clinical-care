import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { UserProvider } from "@/context/UserContext";
import { cn } from "@/lib/utils";

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const handleChange = () => {
      if (mq.matches) setMobileOpen(false);
    };
    mq.addEventListener("change", handleChange);
    return () => mq.removeEventListener("change", handleChange);
  }, []);

  return (
    <UserProvider>
      <div className="min-h-screen bg-slate-50">
        {mobileOpen && (
          <button
            type="button"
            aria-label="Close navigation menu"
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
        <Sidebar
          collapsed={collapsed}
          mobileOpen={mobileOpen}
          onToggle={() => setCollapsed((c) => !c)}
          onMobileClose={() => setMobileOpen(false)}
        />
        <Header
          collapsed={collapsed}
          onMenuClick={() => setMobileOpen(true)}
        />
        <main
          className={cn(
            "mt-16 sm:mt-20 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 transition-[margin] duration-200 ml-0",
            collapsed ? "lg:ml-20" : "lg:ml-64"
          )}
        >
          <Outlet />
        </main>
      </div>
    </UserProvider>
  );
}
