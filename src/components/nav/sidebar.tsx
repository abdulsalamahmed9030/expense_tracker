import Link from 'next/link';
import { Home, List, DollarSign, PieChart, Settings } from 'lucide-react';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Transactions', href: '/transactions', icon: List },
  { name: 'Categories', href: '/categories', icon: DollarSign },
  { name: 'Budgets', href: '/budgets', icon: PieChart },
  { name: 'Reports', href: '/reports', icon: Settings },
];

export const Sidebar = () => {
  return (
    <aside className="w-64 border-r border-border h-full p-4 flex flex-col space-y-4">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent/10"
        >
          <item.icon className="w-5 h-5" />
          {item.name}
        </Link>
      ))}
    </aside>
  );
};
