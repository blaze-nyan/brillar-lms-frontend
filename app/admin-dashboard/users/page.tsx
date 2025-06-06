"use client";

import { useState } from "react";
import { AdminLayout } from "@/components/layout/admin-layout";
import { UsersManagementTable } from "@/components/admin/users-management-table";
import { UserDetailsModal } from "@/components/admin/user-details-modal";
import type { User } from "@/lib/types";

export default function UsersManagementPage() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"view" | "edit">("view");

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setModalMode("view");
    setModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setModalMode("edit");
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedUser(null);
  };

  return (
    <AdminLayout>
      <UsersManagementTable
        onViewUser={handleViewUser}
        onEditUser={handleEditUser}
      />
      <UserDetailsModal
        open={modalOpen}
        onClose={handleCloseModal}
        user={selectedUser}
        viewOnly={modalMode === "view"}
      />
    </AdminLayout>
  );
}
