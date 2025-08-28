"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Sun, Moon } from "lucide-react";
import md5 from "blueimp-md5";

import { MobileSidebar } from "@/components/nav/MobileSidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  // Load client-only stuff (theme + supabase user)
  useEffect(() => {
    setMounted(true);

    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user?.email) {
        setUserEmail(user.email);
        setAvatarUrl(
          `https://www.gravatar.com/avatar/${md5(
            user.email.toLowerCase()
          )}?d=identicon`
        );
      } else {
        setUserEmail(null);
        setAvatarUrl(null);
      }
    };

    fetchUser();

    // Listen to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user?.email) {
        setUserEmail(session.user.email);
        setAvatarUrl(
          `https://www.gravatar.com/avatar/${md5(
            session.user.email.toLowerCase()
          )}?d=identicon`
        );
      } else {
        setUserEmail(null);
        setAvatarUrl(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="flex justify-between items-center p-4 border-b border-border">
        <h1 className="text-2xl font-semibold">Expense Tracker</h1>
      </div>
    );
  }

  return (
    <div className="flex justify-between items-center p-4 border-b border-border">
      {/* Left side: Mobile menu + logo */}
      <div className="flex items-center gap-2">
        <MobileSidebar />
        <h1 className="text-2xl font-semibold">Expense Tracker</h1>
      </div>

      {/* Right side: controls */}
      <div className="flex items-center gap-4">
        {/* Theme toggle */}
        <Button
          variant="ghost"
          size="icon"
          suppressHydrationWarning
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>

        {/* User menu or auth buttons */}
        {userEmail ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer" suppressHydrationWarning>
                {avatarUrl ? (
                  <AvatarImage src={avatarUrl} alt={userEmail} />
                ) : (
                  <AvatarFallback>{userEmail[0].toUpperCase()}</AvatarFallback>
                )}
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem disabled>{userEmail}</DropdownMenuItem>
              <DropdownMenuItem
                onClick={async () => {
                  await supabase.auth.signOut();
                  setUserEmail(null);
                  setAvatarUrl(null);
                  router.push("/sign-in");
                }}
              >
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push("/sign-in")}>
              Login
            </Button>
            <Button variant="default" onClick={() => router.push("/sign-up")}>
              Sign Up
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
