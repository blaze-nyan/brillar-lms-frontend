// hooks/useRoleBasedNavigation.ts
"use client";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { type Navigation } from "@toolpad/core/AppProvider";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import TimeToLeaveIcon from "@mui/icons-material/TimeToLeave";
import BarChartIcon from "@mui/icons-material/BarChart";
import PersonIcon from "@mui/icons-material/Person";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import HistoryIcon from "@mui/icons-material/History";
import AddIcon from "@mui/icons-material/Add";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";

// Define auth state interface to fix TypeScript errors
interface AuthState {
  role: "admin" | "user" | null;
  isAuthenticated: boolean;
  user?: any;
  admin?: any;
}

export const useRoleBasedNavigation = (): Navigation => {
  const { role, isAuthenticated } = useSelector(
    (state: RootState) => state.auth as AuthState
  );

  if (!isAuthenticated || !role) {
    return [
      {
        kind: "header",
        title: "Welcome",
      },
      {
        segment: "dashboard",
        title: "Dashboard",
        icon: React.createElement(DashboardIcon),
      },
    ];
  }

  if (role === "admin") {
    return [
      {
        kind: "header",
        title: "Admin Dashboard",
      },
      {
        segment: "dashboard",
        title: "Dashboard",
        icon: React.createElement(DashboardIcon),
      },
      {
        kind: "divider",
      },
      {
        kind: "header",
        title: "Administration",
      },
      {
        segment: "dashboard/admin",
        title: "Admin Panel",
        icon: React.createElement(AdminPanelSettingsIcon),
        children: [
          {
            segment: "users",
            title: "User Management",
            icon: React.createElement(PeopleIcon),
          },
          {
            segment: "leave",
            title: "Leave Management",
            icon: React.createElement(TimeToLeaveIcon),
          },
          {
            segment: "statistics",
            title: "Statistics",
            icon: React.createElement(BarChartIcon),
          },
        ],
      },
      {
        kind: "divider",
      },
      {
        segment: "dashboard/admin/profile",
        title: "Admin Profile",
        icon: React.createElement(PersonIcon),
      },
    ];
  }

  // role === 'user' (Employee)
  return [
    {
      kind: "header",
      title: "Employee Portal",
    },
    {
      segment: "dashboard",
      title: "Dashboard",
      icon: React.createElement(DashboardIcon),
    },
    {
      kind: "divider",
    },
    {
      kind: "header",
      title: "Leave Management",
    },
    {
      segment: "dashboard/leave",
      title: "My Leave",
      icon: React.createElement(TimeToLeaveIcon),
      children: [
        {
          segment: "request",
          title: "Request Leave",
          icon: React.createElement(AddIcon),
        },
        {
          segment: "history",
          title: "Leave History",
          icon: React.createElement(HistoryIcon),
        },
        // {
        //   segment: "balance",
        //   title: "Leave Balance",
        //   icon: React.createElement(AccountBalanceIcon),
        // },
      ],
    },
    {
      kind: "divider",
    },
    {
      segment: "dashboard/profile",
      title: "My Profile",
      icon: React.createElement(PersonIcon),
    },
  ];
};
