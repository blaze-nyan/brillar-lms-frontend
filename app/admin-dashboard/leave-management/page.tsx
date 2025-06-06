"use client";

import { AdminLayout } from "@/components/layout/admin-layout";
import { LeaveBalancesTable } from "@/components/admin/leave-balances-table";

export default function LeaveManagementPage() {
  return (
    <AdminLayout>
      <LeaveBalancesTable />
    </AdminLayout>
  );
}
