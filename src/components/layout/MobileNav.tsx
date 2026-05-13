"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { routes } from "./Sidebar";

export function MobileNav() {
  const pathname = usePathname();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border flex items-center justify-around pb-safe glass">
      {routes.map((route) => {
        const isActive = pathname === route.href;
        return (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "flex flex-col items-center justify-center w-full py-3 transition-colors",
              isActive ? "text-primary" : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            <route.icon className={cn("h-5 w-5 mb-1", isActive ? "text-primary" : "")} />
            <span className="text-[10px] font-medium">{route.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
