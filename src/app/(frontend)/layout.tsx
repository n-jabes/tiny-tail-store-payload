// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import RootLayout from "./RootLayout";
import {getUser} from '@/utilities/getUser'
import {redirect} from 'next/navigation'

export const metadata: Metadata = {
  title: "Tiny Tail Store",
  description: "Shop online",
};

export default async function Layout({ children }: { children: React.ReactNode }) {
    //get user if they exist/are logged in
    const { user } = await getUser()
  
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <RootLayout user={user}>{children}</RootLayout>
      </body>
    </html>
  );
}
