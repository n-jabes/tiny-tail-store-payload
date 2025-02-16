'use client';

import { LogOut } from 'lucide-react';

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

import {useRouter} from 'next/navigation'

export function Logout() {
  const router = useRouter();

  const handleLogout = async ()=>{
   
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', //important for cookie handling
    });


    if(!response.ok){
      alert("Logout failed!");
      return
    }

    const result = await response.json();
    console.log("Logout result: ", result)

    router.refresh()
    router.push('/login')

  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton onClick={handleLogout}>
          <LogOut />
          <span className='ml-2'>Logout</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
