'use client'

import './globals.css'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'
import { ThemeProvider } from '@/components/theme-provider'
import { usePathname, useRouter } from 'next/navigation'
import { AdminSidebar } from '@/components/admin-sidebar'
import { Toaster } from 'react-hot-toast'
import { useEffect, useState } from 'react' // Import useState

export default function RootLayout({ children, user }: { children: React.ReactNode; user: any }) {
  const currentPath = usePathname()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true) // Add a loading state

  // Check if the current path includes '/admin'
  const isAdminPath = currentPath.includes('/admin')

  // Redirect non-admin users trying to access admin paths
  useEffect(() => {
    if (user !== undefined) {
      // Ensure user is defined
      setIsLoading(false) // Set loading to false once user is available
      if (isAdminPath && user?.role !== 'user') {
        router.push('/profile') // Redirect to /profile
      }
    }
  }, [isAdminPath, user, router])

  // If the user is not an admin and tries to access an admin path, don't render anything
  if (isAdminPath && user?.role !== 'user' && !isLoading) {
    return null // Return null to prevent rendering the admin layout
  }

  // Show a loading spinner or placeholder while waiting for user data
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      <SidebarProvider>
        {isAdminPath ? <AdminSidebar /> : <AppSidebar />}

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
