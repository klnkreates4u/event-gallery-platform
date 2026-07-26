'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Calendar,
  Library,
  BarChart3,
  HardDrive,
  Palette,
  User,
  LogOut,
  Menu,
  X,
  Bell,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import { ThemeToggle } from '@/components/theme-toggle';
import { siteConfig } from '@/config/site';

interface AdminUser {
  id?: string | null;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

const NAV_ITEMS = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Events', href: '/admin/dashboard/events', icon: Calendar },
  { name: 'Media Library', href: '/admin/dashboard/media', icon: Library },
  { name: 'Analytics', href: '/admin/dashboard/analytics', icon: BarChart3 },
  { name: 'Storage', href: '/admin/dashboard/storage', icon: HardDrive },
  { name: 'Branding', href: '/admin/dashboard/branding', icon: Palette },
  { name: 'Profile', href: '/admin/dashboard/profile', icon: User },
];

export default function AdminLayoutClient({
  children,
  user,
}: {
  children: React.ReactNode;
  user: AdminUser;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isActive = (href: string) =>
    href === '/admin/dashboard'
      ? pathname === href
      : pathname.startsWith(href);

  const initials = user.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : user.email?.[0]?.toUpperCase() ?? 'A';

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/admin' });
  };

  return (
    <div className="min-h-screen flex bg-soft-cream/20 dark:bg-neutral-950">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-primary-black/50 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white dark:bg-neutral-900 border-r border-warm-ivory dark:border-neutral-800 flex flex-col justify-between transition-transform duration-300 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-6 flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between mb-8">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-button bg-primary-black dark:bg-soft-cream flex items-center justify-center text-white dark:text-primary-black font-bold text-base shadow-xs">
                <span>{siteConfig.logo.symbol}</span>
              </div>
              <span className="font-editorial font-bold text-base text-primary-black dark:text-soft-cream">
                {siteConfig.logo.text}{' '}
                <span className="text-velvet-red font-light">ADMIN</span>
              </span>
            </Link>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-muted-gray hover:text-primary-black dark:hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center justify-between gap-3 px-4 py-2.5 rounded-button text-sm font-medium transition-all duration-150 ${
                    active
                      ? 'bg-primary-black text-white dark:bg-soft-cream dark:text-primary-black shadow-sm'
                      : 'text-muted-gray hover:text-primary-black dark:hover:text-soft-cream hover:bg-warm-ivory/50 dark:hover:bg-neutral-800'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </span>
                  {active && <ChevronRight className="w-3.5 h-3.5 opacity-60" />}
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="mt-4 pt-4 border-t border-warm-ivory dark:border-neutral-800 space-y-2">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-button text-sm font-medium text-muted-gray hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>

            {/* User Info */}
            <div className="flex items-center gap-3 p-3 rounded-button bg-soft-cream/60 dark:bg-neutral-800/60">
              <div className="w-9 h-9 rounded-full bg-velvet-red text-white flex items-center justify-center font-bold text-xs flex-shrink-0 overflow-hidden">
                {user.image ? (
                  <img src={user.image} alt={user.name ?? ''} className="w-full h-full object-cover" />
                ) : (
                  initials
                )}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-primary-black dark:text-soft-cream truncate">
                  {user.name ?? 'Admin'}
                </p>
                <p className="text-[10px] text-muted-gray truncate">{user.email ?? ''}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* Top Header */}
        <header className="sticky top-0 z-30 h-16 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border-b border-warm-ivory dark:border-neutral-800 px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden text-muted-gray hover:text-primary-black dark:hover:text-white"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-muted-gray">
              <Sparkles className="w-3.5 h-3.5 text-velvet-red" />
              <span>White-Label Studio Admin</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <button className="p-2 rounded-full text-muted-gray hover:text-primary-black dark:hover:text-white transition-colors relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-velvet-red" />
            </button>
          </div>
        </header>

        <main className="p-6 md:p-8 flex-1">{children}</main>
      </div>
    </div>
  );
}
