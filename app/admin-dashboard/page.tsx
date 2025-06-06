"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/lib/hooks";
import { AdminLayout } from "@/components/layout/admin-layout";
import { StatisticsCards } from "@/components/admin/statistics-cards";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (user?.role !== "admin") {
      router.push("/user-dashboard");
      return;
    }
  }, [isAuthenticated, user, router]);

  // Don't render anything until authentication is verified
  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <AdminLayout>
      <StatisticsCards />
    </AdminLayout>
  );
}
