"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, List, DollarSign, PieChart, Settings } from "lucide-react";
import { cn } from "@/lib/utils"; // utility from shadcn/ui

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Transactions", href: "/transactions", icon: List },
  { name: "Categories", href: "/categories", icon: DollarSign },
  { name: "Budgets", href: "/budgets", icon: PieChart },
  { name: "Reports", href: "/reports", icon: Settings },
];

export const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:border-r border-border h-full p-4 space-y-2">
      {navItems.map((item) => {
        const active = pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-2 p-2 rounded-lg text-sm font-medium transition-colors",
              active
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:bg-accent/10"
            )}
          >
            <item.icon className="w-5 h-5" />
            {item.name}
          </Link>
        );
      })}
    </aside>
  );
};
