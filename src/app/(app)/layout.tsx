// app/(app)/layout.tsx
import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-muted/20 p-4">
        <nav className="space-y-2">
          <a href="/dashboard" className="block font-medium">
            Dashboard
          </a>
          <a href="/transactions" className="block">
            Transactions
          </a>
          <a href="/categories" className="block">
            Categories
          </a>
          <a href="/budgets" className="block">
            Budgets
          </a>
          <a href="/reports" className="block">
            Reports
          </a>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
