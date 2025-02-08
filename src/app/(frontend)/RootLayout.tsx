'use client';

import './globals.css';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { ThemeProvider } from '@/components/theme-provider';
import { usePathname } from 'next/navigation';
import { AdminSidebar } from '@/components/admin-sidebar';

// const geistSans = localFont({
//   src: './fonts/GeistVF.woff',
//   variable: '--font-geist-sans',
//   weight: '100 900',
// });
// const geistMono = localFont({
//   src: './fonts/GeistMonoVF.woff',
//   variable: '--font-geist-mono',
//   weight: '100 900',
// });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentPath = usePathname();

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <SidebarProvider>
        {currentPath === '/pro' ? <AdminSidebar /> : <AppSidebar />}

        <main className="flex flex-1 flex-col gap-2 p-4 pt-0 lg:pt-2 w-full h-full bg-mainBg overflow-x-hidden">
          <div className="flex gap-3 items-center lg:hidden">
            <SidebarTrigger />
          </div>
          {children}
        </main>
      </SidebarProvider>
    </ThemeProvider>
  );
}
