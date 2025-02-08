// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import RootLayout from "./RootLayout";

export const metadata: Metadata = {
  title: "Tiny Tail Store",
  description: "Shop online",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <RootLayout>{children}</RootLayout>
      </body>
    </html>
  );
}
