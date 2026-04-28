"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { adminService } from "@/services/admin.service";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice, formatDate } from "@/lib/utils";
import { toast } from "sonner";

const STATUS_BADGE = {
  active: "success",
  draft: "secondary",
  sold: "warning",
  removed: "destructive",
} as const;

const STATUSES = ["active", "draft", "sold", "removed"];

export default function AdminListingsPage() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const SIZE = 20;
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-listings", page, statusFilter],
    queryFn: () => adminService.listListings(page, SIZE, statusFilter),
  });

  const statusMutation = useMutation({
    mutationFn: ({ listingId, status }: { listingId: string; status: string }) =>
      adminService.updateListingStatus(listingId, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-listings"] });
      toast.success("Status updated");
    },
    onError: () => toast.error("Failed to update status"),
  });

  const deleteMutation = useMutation({
    mutationFn: (listingId: string) => adminService.deleteListing(listingId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-listings"] });
      toast.success("Listing deleted");
    },
    onError: () => toast.error("Failed to delete listing"),
  });

  const listings = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / SIZE);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Listings</h1>
          <p className="text-slate-500 text-sm mt-1">{total} total listings</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={statusFilter ?? ""}
            onChange={(e) => { setStatusFilter(e.target.value || undefined); setPage(1); }}
            className="text-sm border border-slate-200 bg-white px-3 py-2 rounded text-slate-700 focus:outline-none focus:border-[#9b111e] focus:ring-1 focus:ring-red-100"
          >
            <option value="">All statuses</option>
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div className="bg-white border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              <th className="text-left px-5 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Title</th>
              <th className="text-left px-5 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider hidden md:table-cell">Price</th>
              <th className="text-left px-5 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
              <th className="text-left px-5 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider hidden sm:table-cell">Listed</th>
              <th className="text-right px-5 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 5 }).map((_, j) => (
                      <td key={j} className="px-5 py-4">
                        <div className="h-4 bg-slate-100 animate-pulse" style={{ width: `${50 + j * 10}%` }} />
                      </td>
                    ))}
                  </tr>
                ))
              : listings.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-900 truncate max-w-xs">{l.title}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{l.make} {l.model} · {l.year}</p>
                    </td>
                    <td className="px-5 py-4 text-slate-700 font-medium hidden md:table-cell">{formatPrice(l.price)}</td>
                    <td className="px-5 py-4">
                      <Badge variant={STATUS_BADGE[l.status] ?? "default"}>{l.status}</Badge>
                    </td>
                    <td className="px-5 py-4 text-slate-500 hidden sm:table-cell">{formatDate(l.created_at)}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <select
                          value={l.status}
                          onChange={(e) => statusMutation.mutate({ listingId: l.id, status: e.target.value })}
                          className="text-xs border border-slate-200 bg-white px-2 py-1 rounded text-slate-700 focus:outline-none focus:border-[#9b111e] focus:ring-1 focus:ring-red-100"
                        >
                          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <button
                          onClick={() => {
                            if (confirm("Delete this listing permanently?")) {
                              deleteMutation.mutate(l.id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 bg-slate-50">
            <p className="text-xs text-slate-500">Page {page} of {totalPages}</p>
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
