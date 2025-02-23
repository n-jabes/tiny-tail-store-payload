'use client';

import './globals.css';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { ThemeProvider } from '@/components/theme-provider';
import { usePathname, useRouter } from 'next/navigation';
import { AdminSidebar } from '@/components/admin-sidebar';
import { Toaster } from 'react-hot-toast';
import { useEffect, useState } from 'react';

export default function RootLayout({ children, user: initialUser }: { children: React.ReactNode; user: any }) {
  const currentPath = usePathname();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(initialUser); // Use initial user data from the server

  console.log("user to admin", user);

  // Check if the current path includes '/admin'
  const isAdminPath = currentPath.includes('/admin');

  // Revalidate user data on the client side if needed
  useEffect(() => {
    const revalidateUser = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/user`); // Fetch user data from an API route
        const { user: updatedUser } = await response.json();
        setUser(updatedUser); // Update the user data
        setIsLoading(false); // Mark loading as complete
      } catch (error) {
        console.error("Failed to revalidate user:", error);
        setIsLoading(false); // Mark loading as complete even if there's an error
      }
    };

    // Only revalidate if the initial user data is not available
    if (!initialUser) {
      revalidateUser();
    } else {
      setIsLoading(false); // Mark loading as complete if initial user data is available
    }
  }, [initialUser]);

  // Redirect non-admin users trying to access admin paths
  useEffect(() => {
    if (!isLoading && user !== null) {
      if (isAdminPath && user?.role !== 'admin') {
        console.log("Redirecting non-admin user to /profile");
        router.push('/profile'); // Redirect to /profile
      }
    }
  }, [isAdminPath, user, isLoading, router]);

  // If the user is not an admin and tries to access an admin path, don't render anything
  if (isAdminPath && user?.role !== 'admin' && !isLoading) {
    return null;
  }

  // Show a loading spinner or placeholder while waiting for user data
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    );
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
  );
}