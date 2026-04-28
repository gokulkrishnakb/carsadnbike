"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, Edit2, X, Check } from "lucide-react";
import { adminService } from "@/services/admin.service";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import type { AdPlacement, Advertisement } from "@/types";

const PLACEMENTS: AdPlacement[] = ["homepage", "listings_top", "listings_sidebar", "listing_detail"];
const PLACEMENT_LABEL: Record<AdPlacement, string> = {
  homepage: "Homepage",
  listings_top: "Listings — Top",
  listings_sidebar: "Listings — Sidebar",
  listing_detail: "Listing Detail",
};

interface AdFormData {
  title: string;
  description: string;
  image_url: string;
  link_url: string;
  placement: AdPlacement;
  is_active: boolean;
}

const EMPTY_FORM: AdFormData = {
  title: "",
  description: "",
  image_url: "",
  link_url: "",
  placement: "homepage",
  is_active: true,
};

function AdForm({
  initial,
  onSave,
  onCancel,
  saving,
}: {
  initial?: AdFormData;
  onSave: (data: AdFormData) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const [form, setForm] = useState<AdFormData>(initial ?? EMPTY_FORM);
  const set = (k: keyof AdFormData, v: string | boolean) =>
    setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="bg-slate-50 border border-slate-200 p-5 space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Title *</label>
          <input
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="Ad title"
            className="w-full border border-slate-200 bg-white px-3 py-2 rounded text-sm text-slate-900 focus:outline-none focus:border-[#9b111e] focus:ring-1 focus:ring-red-100"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Link URL *</label>
          <input
            value={form.link_url}
            onChange={(e) => set("link_url", e.target.value)}
            placeholder="https://..."
            className="w-full border border-slate-200 bg-white px-3 py-2 rounded text-sm text-slate-900 focus:outline-none focus:border-[#9b111e] focus:ring-1 focus:ring-red-100"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Placement *</label>
          <select
            value={form.placement}
            onChange={(e) => set("placement", e.target.value as AdPlacement)}
            className="w-full border border-slate-200 bg-white px-3 py-2 rounded text-sm text-slate-700 focus:outline-none focus:border-[#9b111e] focus:ring-1 focus:ring-red-100"
          >
            {PLACEMENTS.map((p) => <option key={p} value={p}>{PLACEMENT_LABEL[p]}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Image URL</label>
          <input
            value={form.image_url}
            onChange={(e) => set("image_url", e.target.value)}
            placeholder="https://..."
            className="w-full border border-slate-200 bg-white px-3 py-2 rounded text-sm text-slate-900 focus:outline-none focus:border-[#9b111e] focus:ring-1 focus:ring-red-100"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Description</label>
          <input
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            placeholder="Short ad description"
            className="w-full border border-slate-200 bg-white px-3 py-2 rounded text-sm text-slate-900 focus:outline-none focus:border-[#9b111e] focus:ring-1 focus:ring-red-100"
          />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={form.is_active}
            onChange={(e) => set("is_active", e.target.checked)}
            className="w-4 h-4 border-slate-300 text-[#9b111e] accent-[#9b111e]"
          />
          <span className="text-sm text-slate-700 font-medium">Active</span>
        </label>
        <div className="ml-auto flex gap-2">
          <Button variant="secondary" size="sm" onClick={onCancel}>
            <X className="h-4 w-4 mr-1" /> Cancel
          </Button>
          <Button size="sm" loading={saving} onClick={() => onSave(form)} disabled={!form.title || !form.link_url}>
            <Check className="h-4 w-4 mr-1" /> Save
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function AdminAdsPage() {
  const [showCreate, setShowCreate] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-ads"],
    queryFn: () => adminService.listAds(),
  });

  const createMutation = useMutation({
    mutationFn: (d: AdFormData) => adminService.createAd({
      ...d,
      description: d.description || undefined,
      image_url: d.image_url || undefined,
    }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-ads"] });
      qc.invalidateQueries({ queryKey: ["ads"] });
      setShowCreate(false);
      toast.success("Ad created");
    },
    onError: () => toast.error("Failed to create ad"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: AdFormData }) =>
      adminService.updateAd(id, {
        ...data,
        description: data.description || undefined,
        image_url: data.image_url || undefined,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-ads"] });
      qc.invalidateQueries({ queryKey: ["ads"] });
      setEditId(null);
      toast.success("Ad updated");
    },
    onError: () => toast.error("Failed to update ad"),
  });

  const deleteMutation = useMutation({
    mutationFn: (adId: string) => adminService.deleteAd(adId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-ads"] });
      qc.invalidateQueries({ queryKey: ["ads"] });
      toast.success("Ad deleted");
    },
    onError: () => toast.error("Failed to delete ad"),
  });

  const ads = data?.items ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Advertisements</h1>
          <p className="text-slate-500 text-sm mt-1">{ads.length} ad{ads.length !== 1 ? "s" : ""}</p>
        </div>
        <Button onClick={() => setShowCreate(true)} disabled={showCreate} className="gap-2">
          <Plus className="h-4 w-4" /> New Ad
        </Button>
      </div>

      {showCreate && (
        <AdForm
          onSave={(d) => createMutation.mutate(d)}
          onCancel={() => setShowCreate(false)}
          saving={createMutation.isPending}
        />
      )}

      <div className="space-y-3">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white border border-slate-200 p-5 h-20 animate-pulse" />
            ))
          : ads.map((ad) => (
              <div key={ad.id}>
                {editId === ad.id ? (
                  <AdForm
                    initial={{
                      title: ad.title,
                      description: ad.description ?? "",
                      image_url: ad.image_url ?? "",
                      link_url: ad.link_url,
                      placement: ad.placement,
                      is_active: ad.is_active,
                    }}
                    onSave={(d) => updateMutation.mutate({ id: ad.id, data: d })}
                    onCancel={() => setEditId(null)}
                    saving={updateMutation.isPending}
                  />
                ) : (
                  <div className="bg-white border border-slate-200 p-5 flex items-center gap-4 hover:bg-slate-50 transition-colors">
                    {ad.image_url && (
                      <img src={ad.image_url} alt="" className="w-16 h-12 object-cover shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-slate-900 truncate">{ad.title}</p>
                        <Badge variant={ad.is_active ? "success" : "secondary"}>
                          {ad.is_active ? "Active" : "Inactive"}
                        </Badge>
                        <Badge variant="outline">{PLACEMENT_LABEL[ad.placement]}</Badge>
                      </div>
                      {ad.description && (
                        <p className="text-xs text-slate-500 truncate">{ad.description}</p>
                      )}
                      <p className="text-xs text-slate-400 mt-1">
                        {ad.impressions} impressions · {ad.clicks} clicks
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => setEditId(ad.id)}
                        className="p-2 text-slate-400 hover:text-slate-700 transition-colors"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm("Delete this ad?")) deleteMutation.mutate(ad.id);
                        }}
                        className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}

        {!isLoading && ads.length === 0 && !showCreate && (
          <div className="bg-white border border-dashed border-slate-200 p-12 text-center">
            <p className="text-slate-400 text-sm mb-4">No advertisements yet</p>
            <Button onClick={() => setShowCreate(true)} variant="secondary" className="gap-2">
              <Plus className="h-4 w-4" /> Create your first ad
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
