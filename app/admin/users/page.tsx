"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Shield, UserX, UserCheck, ChevronLeft, ChevronRight } from "lucide-react";
import { adminService } from "@/services/admin.service";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import type { Role } from "@/types";

const ROLE_BADGE = {
  admin: "destructive",
  dealer: "warning",
  user: "secondary",
} as const;

export default function AdminUsersPage() {
  const [page, setPage] = useState(1);
  const SIZE = 20;
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-users", page],
    queryFn: () => adminService.listUsers(page, SIZE),
  });

  const roleMutation = useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: Role }) =>
      adminService.updateUserRole(userId, role),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("Role updated");
    },
    onError: () => toast.error("Failed to update role"),
  });

  const statusMutation = useMutation({
    mutationFn: ({ userId, is_active }: { userId: string; is_active: boolean }) =>
      adminService.updateUserStatus(userId, is_active),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("Status updated");
    },
    onError: () => toast.error("Failed to update status"),
  });

  const users = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / SIZE);

  return (
    <div className="space-y-6 w-full">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Users</h1>
        <p className="text-slate-500 text-sm mt-1">{total} registered users</p>
      </div>

      <div className="bg-white border border-slate-200 shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              <th className="text-left px-5 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Name</th>
              <th className="text-left px-5 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider hidden md:table-cell">Email</th>
              <th className="text-left px-5 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Role</th>
              <th className="text-left px-5 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider hidden sm:table-cell">Status</th>
              <th className="text-right px-5 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 5 }).map((_, j) => (
                      <td key={j} className="px-5 py-4">
                        <div className="h-4 bg-slate-100 animate-pulse" style={{ width: `${60 + j * 10}%` }} />
                      </td>
                    ))}
                  </tr>
                ))
              : users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-900">{u.full_name}</p>
                    </td>
                    <td className="px-5 py-4 text-slate-500 hidden md:table-cell">{u.email}</td>
                    <td className="px-5 py-4">
                      <Badge variant={ROLE_BADGE[u.role] ?? "default"}>{u.role}</Badge>
                    </td>
                    <td className="px-5 py-4 hidden sm:table-cell">
                      <Badge variant={u.is_active ? "success" : "destructive"}>
                        {u.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <select
                          value={u.role}
                          onChange={(e) => roleMutation.mutate({ userId: u.id, role: e.target.value as Role })}
                          className="text-xs border border-slate-200 bg-white px-2 py-1 rounded text-slate-700 focus:outline-none focus:border-[#9b111e] focus:ring-1 focus:ring-red-100"
                        >
                          <option value="user">user</option>
                          <option value="dealer">dealer</option>
                          <option value="admin">admin</option>
                        </select>
                        <button
                          onClick={() => statusMutation.mutate({ userId: u.id, is_active: !u.is_active })}
                          className={`p-1.5 transition-colors ${u.is_active ? "text-slate-400 hover:text-red-500" : "text-slate-400 hover:text-emerald-600"}`}
                          title={u.is_active ? "Deactivate" : "Activate"}
                        >
                          {u.is_active ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 bg-slate-50">
            <p className="text-xs text-slate-500">
              Page {page} of {totalPages}
            </p>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="secondary" size="sm" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
