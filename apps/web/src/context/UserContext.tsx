import { createContext, useContext, useState, type ReactNode } from "react";

export const roles = ["Registered Nurse", "Care Manager", "Admin", "Carer"] as const;
export type Role = (typeof roles)[number];

interface UserContextValue {
  name: string;
  role: Role;
  setRole: (role: Role) => void;
}

const UserContext = createContext<UserContextValue | null>(null);

// Header (account menu) and Sidebar (footer profile block) both display
// the same signed-in identity — a small context avoids threading role
// state through AppLayout as props.
export function UserProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>("Registered Nurse");

  return (
    <UserContext.Provider value={{ name: "Sarah Johnson", role, setRole }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
}
