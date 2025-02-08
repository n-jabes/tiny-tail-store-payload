'use client';

import * as React from 'react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';
import { Logout } from './logout-btn';
import { useTheme } from 'next-themes';

// This is sample data.
import {
  LayoutDashboard,
  Users,
  User,
  CreditCard,
  ClipboardList,
  Gift,
  Lock,
  Puzzle,
  Settings,
  SunMedium,
  Moon,
  MoveLeft,
  Mail,
  Wallet,
  ShieldHalf,
} from 'lucide-react';
import { AdminSidebarMenu } from './admin-sidebar-menu';
import Link from 'next/link';

const data = {
  membership: [
    {
      title: 'Utlimate Membership (Pro)',
      url: '/pro',
      isActive: true,
      icon: ShieldHalf,
    },
  ],
  menu: [
    {
      title: 'Dashboard',
      url: '/dashboard',
      isActive: true,
      icon: LayoutDashboard,
    },
    {
      title: 'Members',
      url: '#',
      icon: User,
    },
    {
      title: 'Memberships',
      url: '#',
      icon: Users,
    },
    {
      title: 'Payment Gateways',
      url: '#',
      icon: CreditCard,
    },
    {
      title: 'Showcases',
      url: '#',
      icon: ClipboardList,
      items: [
        { title: 'Registration Form', url: '#' },
        { title: 'Login Form', url: '#' },
        { title: 'Subscriptions Plan', url: '#' },
        { title: 'Checkout Page', url: '#' },
        {
          title: 'Member Portal',
          url: '#',
        },
      ],
    },
    {
      title: 'Coupons',
      url: '#',
      icon: Gift,
    },
    {
      title: 'Content Access Rules',
      url: '#',
      icon: Lock,
    },
    {
      title: 'Payment History',
      url: '#',
      icon: Wallet,
    },
    {
      title: 'Email Notifications',
      url: '#',
      icon: Mail,
    },
    {
      title: 'Extensions',
      url: '#',
      icon: Puzzle,
    },
    {
      title: 'General Settings',
      url: '#',
      icon: Settings,
    },
  ],
};

export function AdminSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { theme, setTheme } = useTheme();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => {
    setTheme('light');
  }, []);

  return (
    <Sidebar
      collapsible="icon"
      {...props}
      className="overflow-clip h-full bg-sidebar"
    >
      <SidebarHeader>
        <h1 className="font-semibold text-lg">ADMIN</h1>
      </SidebarHeader>
      <SidebarContent >
        {/* Changing themes */}
        <div
          className="w-[90%] mx-auto flex items-center justify-between p-[0.2rem] bg-input
  text-text rounded-full"
        >
          <button
            className={`flex items-center justify-center cursor-pointer w-1/2 rounded-full font-bold ${
              theme === 'dark' ? 'text-[#fdfdff] bg-button-bg' : ''
            }`}
            onClick={() => setTheme('dark')}
          >
            <Moon className="w-4" />
          </button>
          <button
            className={`flex items-center justify-center cursor-pointer w-1/2 rounded-full font-bold ${
              theme !== 'dark' ? 'text-[#fdfdff] bg-button-bg' : ''
            }`}
            onClick={() => setTheme('light')}
          >
            <SunMedium className="w-4" />
          </button>
        </div>
        {/* search input */}
        <div className="px-4 w-[90%] ">
          <Link
            href="/"
            className="w-max py-1 px-4 rounded-sm bg-input flex items-center gap-[1rem] text-text"
          >
            <MoveLeft className="w-4 h-4" />
            <span className="text-title font-semibold text-sm">Back</span>
          </Link>
        </div>
        <AdminSidebarMenu menu={data.membership} />
        <AdminSidebarMenu menu={data.menu} />
      </SidebarContent>
      <div className="absolute bottom-[-0.8rem] right-[-12rem] z-[-1] transform -translate-x-1/2 w-64 h-48 bg-siderbar-blur blur-3xl rounded-full"></div>

      <SidebarFooter>
        <Logout />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
