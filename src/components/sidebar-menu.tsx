'use client';

import { type LucideIcon } from 'lucide-react';
import { Collapsible } from '@/components/ui/collapsible';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function SideBarMenu({
  menu,
}: {
  menu: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    menu?: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  const currentPath = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>MENU</SidebarGroupLabel>
      <SidebarMenu>
        {menu.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem
              className={`${
                currentPath === item.url
                  ? 'rounded-sm font-semibold bg-sidebarMenu-bg text-sidebarMenu-text'
                  : ''
              }`}
            >
              <Link href={item.url} className="w-full">
                <SidebarMenuButton tooltip={item.title}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
