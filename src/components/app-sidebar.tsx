'use client';

import * as React from 'react';

import {
  LayoutDashboard,
  User,
  ReceiptText,
  Network,
  CreditCard,
  Bell,
  MessageCircleQuestion,
  Search,
  SunMedium,
  Moon,
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';
import { SideBarMenu } from './sidebar-menu';
import { SideBarHelpCenter } from './sidebar-helpCenter';
import { SidebarMemberServices } from './sidebar-memberServices';
import { Logout } from './logout-btn';
import { useTheme } from 'next-themes';

// This is sample data.
const data = {
  menu: [
    {
      title: 'Dashboard',
      url: '/pro',
      isActive: true,
      icon: LayoutDashboard,
    },
    {
      title: 'Profile details',
      url: '/profile',
      icon: User,
    },
    {
      title: 'Subscriptions',
      url: '/subscriptions',
      icon: ReceiptText,
    },
    {
      title: 'Social connection',
      url: '#',
      icon: Network,
    },
  ],
  help: [
    {
      title: 'Payment',
      url: '#',
      icon: CreditCard,
    },
    {
      title: 'Notification',
      url: '#',
      icon: Bell,
    },
    {
      title: 'Help',
      url: '#',
      icon: MessageCircleQuestion,
    },
  ],
  memberServices: [
    {
      title: 'Affiliate login',
      url: '/affiliate',
      isActive: false,
      items: [
        {
          title: 'Affiliates',
          url: '#',
        },
      ],
    },
    {
      title: 'Member login',
      url: '#',
    },
    {
      title: 'Member logout',
      url: '#',
    },
    {
      title: 'Member TOS page',
      url: '#',
    },
    {
      title: 'Thank you page',
      url: '#',
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { theme, setTheme } = useTheme();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => {
    setTheme('light');
  }, []);


  return (
    <Sidebar collapsible="icon" {...props} className="overflow-clip h-full bg-sidebar">
      <SidebarHeader>
        <h1 className="font-semibold text-lg">LOGO</h1>
      </SidebarHeader>
      <SidebarContent>
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
        <div className="py-1 px-4 rounded-full  w-[90%] mx-auto bg-input flex items-center gap-[1rem] text-text">
          <Search className="w-4 h-4" />
          <input
            type="text"
            className="font-medium bg-transparent outline-none text-sm"
            placeholder="Search"
          />
        </div>
        <SideBarMenu menu={data.menu} />
        <SideBarHelpCenter help={data.help} />
        <SidebarMemberServices services={data.memberServices} />
      </SidebarContent>
      <div className="absolute bottom-[-0.8rem] right-[-12rem] z-[-1] transform -translate-x-1/2 w-64 h-48 bg-siderbar-blur blur-3xl rounded-full"></div>

      <SidebarFooter>
        <Logout />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
