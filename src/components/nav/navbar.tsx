'use client';

import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Ensure theme is loaded client-side before rendering icons
  useEffect(() => setMounted(true), []);

  return (
    <div className="flex justify-between items-center p-4 border-b border-border">
      <h1 className="text-2xl font-semibold">Expense Tracker</h1>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      >
        {mounted ? (
          theme === 'dark' ? <Sun /> : <Moon />
        ) : (
          // Placeholder so layout doesn’t shift on first render
          <div className="h-5 w-5" />
        )}
      </Button>
    </div>
  );
};
