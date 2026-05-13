"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  PlusCircle,
  TrendingUp,
  CreditCard,
  Settings,
  LogOut,
} from "lucide-react";

export const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    label: "Add Bet",
    icon: PlusCircle,
    href: "/dashboard/bets/add",
  },
  {
    label: "Analytics",
    icon: TrendingUp,
    href: "/dashboard/analytics",
  },
  {
    label: "Transactions",
    icon: CreditCard,
    href: "/dashboard/transactions",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/dashboard/settings",
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/auth/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-card text-card-foreground border-r border-border glass">
      <div className="px-3 py-2 flex-1">
        <Link href="/dashboard" className="flex items-center pl-3 mb-14">
          <div className="relative w-8 h-8 mr-4 bg-primary rounded-full flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-xl">C</span>
          </div>
          <h1 className="text-xl font-bold text-primary">
            CricBetTracker
          </h1>
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-primary/20 rounded-lg transition",
                pathname === route.href ? "text-white bg-primary/20 border border-primary/30" : "text-zinc-400"
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn("h-5 w-5 mr-3", pathname === route.href ? "text-primary" : "")} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className="px-3 py-2">
        <button 
          onClick={handleLogout}
          className="text-sm group flex p-3 w-full justify-start font-medium cursor-pointer text-zinc-400 hover:text-destructive hover:bg-destructive/10 rounded-lg transition"
        >
          <div className="flex items-center flex-1">
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </div>
        </button>
      </div>
    </div>
  );
}
