"use client";

import { AdminLayout } from "@/components/layout/admin-layout";
import { StatisticsCards } from "@/components/admin/statistics-cards";

export default function StatisticsPage() {
  return (
    <AdminLayout>
      <StatisticsCards />
    </AdminLayout>
  );
}
