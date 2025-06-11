"use client";

import * as React from "react";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { Stack, Typography } from "@mui/material";
import type { SidebarFooterProps } from "@toolpad/core/DashboardLayout";
import { useRoleBasedNavigation } from "@/hooks/useRoleBasedNavigation";
import { NextAppProvider } from "@toolpad/core/nextjs";

// Custom App Title Component
function CustomAppTitle() {
  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Typography variant="h6" sx={{ fontWeight: "bold" }}>
        Brillar LMS
      </Typography>
    </Stack>
  );
}

// Sidebar Footer Component
function SidebarFooter({ mini }: SidebarFooterProps) {
  return (
    <Typography
      variant="caption"
      sx={{
        m: 1,
        whiteSpace: "nowrap",
        overflow: "hidden",
        color: "text.secondary",
        textAlign: "center",
      }}
    >
      {mini
        ? "© Brillar"
        : `© ${new Date().getFullYear()} Brillar Leave Management System`}
    </Typography>
  );
}

interface DashboardLayoutWrapperProps {
  children: React.ReactNode;
}

export function DashboardLayoutWrapper({ children }: DashboardLayoutWrapperProps) {
  const navigation = useRoleBasedNavigation();

  return (
    <NextAppProvider navigation={navigation}>
      <DashboardLayout
        slots={{
          appTitle: CustomAppTitle,
          sidebarFooter: SidebarFooter,
        }}
      >
        {children}
      </DashboardLayout>
    </NextAppProvider>
  );
}