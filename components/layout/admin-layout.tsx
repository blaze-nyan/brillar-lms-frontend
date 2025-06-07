"use client";

import React from "react";
import { ModernDashboardLayout } from "@/components/layout/modern-layout";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return <ModernDashboardLayout>{children}</ModernDashboardLayout>;
}
