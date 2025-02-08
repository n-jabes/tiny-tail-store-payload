'use client';

import { ChevronRight } from 'lucide-react';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { type LucideIcon } from 'lucide-react';

export function AdminSidebarMenu({
  menu,
}: {
  menu: {
    title: string;
    url: string;
    isActive?: boolean;
    icon?: LucideIcon;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  const currentPath = usePathname();

  return (
    <SidebarGroup>
      {/* <SidebarGroupLabel>MEMBER menu</SidebarGroupLabel> */}
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
              <CollapsibleTrigger asChild>
                <Link href={item.url} className="w-full">
                  <SidebarMenuButton tooltip={item.title}>
                  {item.icon && <item.icon />}
                    <span>{item.title}</span>
                    {/* check if the items are not empty */}
                    {item?.items && item.items.length > 0 && (
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    )}
                  </SidebarMenuButton>
                </Link>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items?.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <Link href={subItem.url} className="w-full">
                        <SidebarMenuSubButton asChild>
                          <a href={subItem.url}>
                            <span>{subItem.title}</span>
                          </a>
                        </SidebarMenuSubButton>
                      </Link>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
