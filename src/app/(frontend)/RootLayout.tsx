'use client'

import './globals.css'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'
import { ThemeProvider } from '@/components/theme-provider'
import { usePathname } from 'next/navigation'
import { AdminSidebar } from '@/components/admin-sidebar'
import { Toaster } from 'react-hot-toast'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const currentPath = usePathname()

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      <SidebarProvider>
        {currentPath === '/pro' ? <AdminSidebar /> : <AppSidebar />}

        <main className="flex flex-1 flex-col gap-2 p-4 pt-0 lg:pt-2 w-full h-full bg-mainBg overflow-x-hidden">
          <div className="flex gap-3 items-center lg:hidden">
            <SidebarTrigger />
          </div>
          {children}
        </main>
      </SidebarProvider>

      {/* Toast Notifications */}
      <Toaster position="top-right" reverseOrder={false} />
    </ThemeProvider>
  )
}
