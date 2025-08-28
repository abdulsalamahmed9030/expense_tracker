"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { supabase } from "@/lib/supabaseClient";
import { Sun, Moon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  // Ensure theme + user info only load client-side
  useEffect(() => {
    setMounted(true);

    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user?.email) {
        setUserEmail(user.email);

        // Use a gravatar-style image based on email hash
        const gravatarUrl = `https://www.gravatar.com/avatar/${btoa(
          user.email
        )}?d=identicon`;
        setAvatarUrl(gravatarUrl);
      } else {
        setUserEmail(null);
        setAvatarUrl(null);
      }
    };

    fetchUser();

    // Listen for login/logout state changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user?.email) {
          setUserEmail(session.user.email);

          const gravatarUrl = `https://www.gravatar.com/avatar/${btoa(
            session.user.email
          )}?d=identicon`;
          setAvatarUrl(gravatarUrl);
        } else {
          setUserEmail(null);
          setAvatarUrl(null);
        }
      }
    );

    return () => {
      listener?.subscription.unsubscribe();
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
      <h1 className="text-2xl font-semibold">Expense Tracker</h1>

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

        {/* User Menu OR Auth Buttons */}
        {userEmail ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer" suppressHydrationWarning>
                {avatarUrl ? (
                  <AvatarImage src={avatarUrl} alt={userEmail} />
                ) : (
                  <AvatarFallback>
                    {userEmail[0].toUpperCase()}
                  </AvatarFallback>
                )}
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem disabled>{userEmail}</DropdownMenuItem>
              <DropdownMenuItem
                onClick={async () => {
                  await supabase.auth.signOut();
                  setUserEmail(null);
                  setAvatarUrl(null);
                  router.push("/auth/sign-in"); // ✅ redirect after logout
                }}
              >
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push("/auth/sign-in")}>
              Login
            </Button>
            <Button variant="default" onClick={() => router.push("/auth/sign-up")}>
              Sign Up
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
