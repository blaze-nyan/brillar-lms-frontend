"use client";

import React from "react";
import { ModernDashboardLayout } from "@/components/layout/modern-layout";

interface UserLayoutProps {
  children: React.ReactNode;
}

export function UserLayout({ children }: UserLayoutProps) {
  return <ModernDashboardLayout>{children}</ModernDashboardLayout>;
}
