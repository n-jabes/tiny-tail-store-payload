'use client';

import './globals.css';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { ThemeProvider } from '@/components/theme-provider';
import { usePathname, useRouter } from 'next/navigation';
import { AdminSidebar } from '@/components/admin-sidebar';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react'; // Import useEffect and useState
import { UserProvider, useUser } from '@/context/user-context'; // Import UserProvider and useUser

export default function RootLayout({ children, user: initialUser }: { children: React.ReactNode; user: any }) {
  return (
    <UserProvider initialUser={initialUser}> {/* Wrap with UserProvider */}
      <LayoutContent>{children}</LayoutContent>
    </UserProvider>
  );
}

function LayoutContent({ children }: { children: React.ReactNode }) {
  const currentPath = usePathname();
  const router = useRouter();
  const { user, isLoading } = useUser(); // Use the user from the context

  console.log("user to admin", user);

  // Check if the current path includes '/admin'
  const isAdminPath = currentPath.includes('/admin');

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