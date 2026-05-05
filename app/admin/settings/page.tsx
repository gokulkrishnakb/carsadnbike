"use client";

import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Save,
  Upload,
  Globe,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Image as ImageIcon,
  AlertTriangle,
} from "lucide-react";
import { adminService } from "@/services/admin.service";
import { toast } from "sonner";
import type { SiteSettings } from "@/types";

export default function AdminSettingsPage() {
  const qc = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<SiteSettings>>({});
  const [hasChanges, setHasChanges] = useState(false);

  const { data: settings, isLoading } = useQuery({
    queryKey: ["admin-settings"],
    queryFn: adminService.getSettings,
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<SiteSettings>) => adminService.updateSettings(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-settings"] });
      toast.success("Settings saved successfully!");
      setHasChanges(false);
    },
    onError: () => toast.error("Failed to save settings"),
  });

  const set = (key: keyof SiteSettings, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const getValue = (key: keyof SiteSettings): string => {
    if (key in form) return String(form[key] ?? "");
    return String(settings?.[key] ?? "");
  };

  const getBoolValue = (key: keyof SiteSettings): boolean => {
    if (key in form) return Boolean(form[key]);
    return Boolean(settings?.[key]);
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be less than 2MB");
      return;
    }

    try {
      const result = await adminService.uploadLogo(file);
      setLogoPreview(result.url);
      set("logo_url", result.url);
      toast.success("Logo uploaded successfully!");
    } catch {
      toast.error("Failed to upload logo");
    }
  };

  const handleSave = () => {
    const data: Partial<SiteSettings> = {
      ...settings,
      ...form,
    };
    updateMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Settings</h1>
          <p className="text-slate-500 text-sm mt-1">Configure site settings</p>
        </div>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white border border-slate-200 p-6 animate-pulse">
              <div className="h-6 w-32 bg-slate-200 mb-4" />
              <div className="space-y-3">
                <div className="h-10 bg-slate-100" />
                <div className="h-10 bg-slate-100" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Settings</h1>
          <p className="text-slate-500 text-sm mt-1">Configure site settings and branding</p>
        </div>
        <button
          onClick={handleSave}
          disabled={!hasChanges || updateMutation.isPending}
          className="flex items-center gap-2 px-4 py-2 bg-[#9b111e] text-white text-sm font-semibold rounded hover:bg-[#7b0d18] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {updateMutation.isPending ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Save Changes
        </button>
      </div>

      {/* Branding Section */}
      <div className="bg-white border border-slate-200 shadow-sm">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Globe className="w-5 h-5 text-slate-400" />
            Branding
          </h2>
        </div>
        <div className="p-6 space-y-6">
          {/* Logo Upload */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
              Site Logo
            </label>
            <div className="flex items-start gap-6">
              <div className="w-32 h-32 bg-slate-100 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center overflow-hidden">
                {logoPreview || settings?.logo_url ? (
                  <img
                    src={logoPreview || settings?.logo_url}
                    alt="Logo preview"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <ImageIcon className="w-8 h-8 text-slate-400" />
                )}
              </div>
              <div className="flex-1">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 text-sm font-medium rounded hover:bg-slate-200 transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  Upload Logo
                </button>
                <p className="mt-2 text-xs text-slate-500">
                  Recommended: 512x512px, PNG or SVG. Max 2MB.
                </p>
              </div>
            </div>
          </div>

          {/* Site Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Site Name
            </label>
            <input
              type="text"
              value={getValue("site_name")}
              onChange={(e) => set("site_name", e.target.value)}
              placeholder="Enter site name"
              className="w-full max-w-md px-4 py-2.5 border border-slate-200 rounded text-sm text-slate-900 focus:outline-none focus:border-[#9b111e] focus:ring-2 focus:ring-red-100 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white border border-slate-200 shadow-sm">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Phone className="w-5 h-5 text-slate-400" />
            Contact Information
          </h2>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              <Mail className="w-3.5 h-3.5 inline mr-1" />
              Support Email
            </label>
            <input
              type="email"
              value={getValue("support_email")}
              onChange={(e) => set("support_email", e.target.value)}
              placeholder="support@example.com"
              className="w-full px-4 py-2.5 border border-slate-200 rounded text-sm text-slate-900 focus:outline-none focus:border-[#9b111e] focus:ring-2 focus:ring-red-100 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              <Phone className="w-3.5 h-3.5 inline mr-1" />
              Support Phone
            </label>
            <input
              type="tel"
              value={getValue("support_phone")}
              onChange={(e) => set("support_phone", e.target.value)}
              placeholder="+1 (555) 123-4567"
              className="w-full px-4 py-2.5 border border-slate-200 rounded text-sm text-slate-900 focus:outline-none focus:border-[#9b111e] focus:ring-2 focus:ring-red-100 transition-all"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              <MapPin className="w-3.5 h-3.5 inline mr-1" />
              Address
            </label>
            <input
              type="text"
              value={getValue("address")}
              onChange={(e) => set("address", e.target.value)}
              placeholder="123 Main St, City, Country"
              className="w-full px-4 py-2.5 border border-slate-200 rounded text-sm text-slate-900 focus:outline-none focus:border-[#9b111e] focus:ring-2 focus:ring-red-100 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Social Media Links */}
      <div className="bg-white border border-slate-200 shadow-sm">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Globe className="w-5 h-5 text-slate-400" />
            Social Media
          </h2>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              <Facebook className="w-3.5 h-3.5 inline mr-1" />
              Facebook
            </label>
            <input
              type="url"
              value={getValue("social_facebook")}
              onChange={(e) => set("social_facebook", e.target.value)}
              placeholder="https://facebook.com/yourpage"
              className="w-full px-4 py-2.5 border border-slate-200 rounded text-sm text-slate-900 focus:outline-none focus:border-[#9b111e] focus:ring-2 focus:ring-red-100 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              <Twitter className="w-3.5 h-3.5 inline mr-1" />
              Twitter / X
            </label>
            <input
              type="url"
              value={getValue("social_twitter")}
              onChange={(e) => set("social_twitter", e.target.value)}
              placeholder="https://twitter.com/yourhandle"
              className="w-full px-4 py-2.5 border border-slate-200 rounded text-sm text-slate-900 focus:outline-none focus:border-[#9b111e] focus:ring-2 focus:ring-red-100 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              <Instagram className="w-3.5 h-3.5 inline mr-1" />
              Instagram
            </label>
            <input
              type="url"
              value={getValue("social_instagram")}
              onChange={(e) => set("social_instagram", e.target.value)}
              placeholder="https://instagram.com/yourhandle"
              className="w-full px-4 py-2.5 border border-slate-200 rounded text-sm text-slate-900 focus:outline-none focus:border-[#9b111e] focus:ring-2 focus:ring-red-100 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              <Youtube className="w-3.5 h-3.5 inline mr-1" />
              YouTube
            </label>
            <input
              type="url"
              value={getValue("social_youtube")}
              onChange={(e) => set("social_youtube", e.target.value)}
              placeholder="https://youtube.com/@yourchannel"
              className="w-full px-4 py-2.5 border border-slate-200 rounded text-sm text-slate-900 focus:outline-none focus:border-[#9b111e] focus:ring-2 focus:ring-red-100 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Maintenance Mode */}
      <div className="bg-white border border-slate-200 shadow-sm">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-slate-400" />
            Maintenance
          </h2>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Maintenance Mode</h3>
              <p className="text-xs text-slate-500 mt-1">
                When enabled, visitors will see a maintenance page instead of the site
              </p>
            </div>
            <button
              onClick={() => set("maintenance_mode", !getBoolValue("maintenance_mode"))}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                getBoolValue("maintenance_mode") ? "bg-[#9b111e]" : "bg-slate-200"
              }`}
            >
              <div
                className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  getBoolValue("maintenance_mode") ? "translate-x-6" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>
          {getBoolValue("maintenance_mode") && (
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded text-sm text-amber-800">
              <strong>Warning:</strong> Maintenance mode is enabled. Your site is not accessible to
              visitors.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
