import type { Metadata } from "next";
import * as React from "react";
import { ReduxProvider } from "@/store/ReduxProvider";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { ClientNavigationProvider } from "@/components/navigation/ClientNavigationProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Brillar LMS - Leave Management System",
  description: "Employee Leave Management System by Brillar",
};

// Create a separate client component for the dashboard layout
import { DashboardLayoutWrapper } from "@/components/layout/DashboardLayoutWrapper";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ReduxProvider>
          <ClientNavigationProvider>
            <AuthGuard>
              <DashboardLayoutWrapper>{children}</DashboardLayoutWrapper>
            </AuthGuard>
          </ClientNavigationProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
