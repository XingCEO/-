'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
  LayoutDashboard,
  Image,
  FolderOpen,
  Calendar,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useState } from 'react';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import type { Locale } from '@/i18n/config';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

interface AdminSidebarProps {
  lang: string;
  dict: any;
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

const navItems = [
  { key: 'dashboard', href: '', icon: LayoutDashboard },
  { key: 'works', href: '/works', icon: Image },
  { key: 'categories', href: '/categories', icon: FolderOpen },
  { key: 'bookings', href: '/bookings', icon: Calendar },
  { key: 'settings', href: '/settings', icon: Settings },
];

export default function AdminSidebar({ lang, dict, user }: AdminSidebarProps) {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const isActive = (href: string) => {
    const fullPath = `/${lang}/admin${href}`;
    if (href === '') {
      return pathname === `/${lang}/admin` || pathname === `/${lang}/admin/`;
    }
    return pathname.startsWith(fullPath);
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: '/login' });
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-card/50 backdrop-blur-sm">
      {/* Logo */}
      <div className="p-8 pb-6">
        <Link href={`/${lang}`} className="flex items-center gap-3 group">
          <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold text-lg group-hover:bg-primary/90 transition-colors">
            S
          </div>
          <div className="flex flex-col">
            <span className="font-playfair text-xl font-semibold leading-none">Studio</span>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mt-1">Admin Panel</span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        <div className="text-xs font-semibold text-muted-foreground/50 uppercase tracking-wider px-4 mb-2">Menu</div>
        {navItems.map((item) => (
          <Link
            key={item.key}
            href={`/${lang}/admin${item.href}`}
            onClick={() => setIsMobileOpen(false)}
            className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive(item.href)
              ? 'bg-primary/5 text-primary font-medium shadow-sm'
              : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
              }`}
          >
            <item.icon className={`w-5 h-5 transition-colors ${isActive(item.href) ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
              }`} />
            <span>{dict.admin.nav[item.key]}</span>
            {isActive(item.href) && (
              <div className="ml-auto w-1 h-1 rounded-full bg-primary" />
            )}
          </Link>
        ))}
      </nav>

      {/* User & Logout */}
      <div className="p-4 mt-auto">
        <div className="bg-muted/30 rounded-xl p-4 border border-border/50">
          <div className="flex items-center gap-3 mb-4">
            <Avatar className="h-9 w-9 border border-border">
              <AvatarImage src={user?.image || ''} />
              <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                {user?.name?.[0]?.toUpperCase() || 'A'}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-medium truncate">{user?.name || 'Administrator'}</span>
              <span className="text-xs text-muted-foreground truncate">{user?.email || 'admin@studio.com'}</span>
            </div>
          </div>
          <Separator className="my-3 bg-border/50" />
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2 h-8 text-muted-foreground hover:text-destructive hover:bg-destructive/5 pl-2"
            onClick={handleSignOut}
          >
            <LogOut className="w-4 h-4" />
            <span className="text-xs font-medium">{dict.admin.nav.logout}</span>
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 border-r bg-card z-40">
        <SidebarContent />
      </aside>

      {/* Mobile Header Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/75 border-b">
        <div className="flex items-center justify-between h-16 px-4">
          <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
            {/* Mobile layout implementation same as previous, just reusing the redesign SidebarContent */}
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-10 w-10">
                <Menu className="w-5 h-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-72">
              <SidebarContent />
            </SheetContent>
          </Sheet>
          <Link href={`/${lang}`} className="flex flex-col items-center">
            <span className="font-playfair text-lg font-semibold">Studio</span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest leading-none">Admin</span>
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </>
  );
}
