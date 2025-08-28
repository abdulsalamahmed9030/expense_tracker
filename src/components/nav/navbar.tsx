'use client';

import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

export const Navbar = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex justify-between items-center p-4 border-b border-border">
      <h1 className="text-2xl font-semibold">Expense Tracker</h1>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      >
        {theme === 'dark' ? <Sun /> : <Moon />}
      </Button>
    </div>
  );
};
