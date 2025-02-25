// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import RootLayout from "./RootLayout";
import { getUser } from "@/utilities/getUser";

export const metadata: Metadata = {
  title: "Tiny Tail Store",
  description: "Shop online",
};

export default async function Layout({ children }: { children: React.ReactNode }) {
  const { user } = await getUser(); // Fetch user data on the server
  // console.log("logged in user", user);

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <RootLayout user={user}>{children}</RootLayout>
      </body>
    </html>
  );
}