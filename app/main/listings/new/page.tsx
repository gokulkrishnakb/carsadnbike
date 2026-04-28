"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import {
  Upload, X, ImagePlus, ArrowRight, ChevronLeft, CheckCircle2,
  Video, Shield, Wrench, Fuel, Palette, Users, Gauge, Calendar,
  FileText, Car, AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import { listingsService } from "@/services/listings.service";

const listingSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(200),
  description: z.string().min(20, "Please provide a detailed description").max(5000),
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z.number({ invalid_type_error: "Year is required" }).min(1900).max(new Date().getFullYear() + 1),
  vehicle_type: z.enum(["car", "bike", "truck", "van"] as const),
  condition: z.enum(["new", "used", "certified"] as const),
  price: z.number({ invalid_type_error: "Price is required" }).positive("Price must be positive"),
  mileage: z.number({ invalid_type_error: "Mileage is required" }).min(0),
  location: z.string().min(2, "Location is required"),
  // New fields
  fuel_type: z.enum(["petrol", "diesel", "electric", "hybrid", "cng", "lpg"] as const).optional(),
  transmission: z.enum(["manual", "automatic", "cvt", "dct"] as const).optional(),
  color: z.string().optional(),
  seats: z.number().min(1).max(50).optional(),
  owners: z.number().min(1).max(10).optional(),
  // Insurance & Service
  insurance_valid: z.boolean().optional(),
  insurance_expiry: z.string().optional(),
  last_service_date: z.string().optional(),
  service_history: z.boolean().optional(),
  // Documents
  rc_available: z.boolean().optional(),
  fitness_valid: z.boolean().optional(),
  // Additional
  registration_year: z.number().optional(),
  rto: z.string().optional(),
});

type ListingInput = z.infer<typeof listingSchema>;

const STEPS = [
  { label: "Basics", desc: "Title & description" },
  { label: "Specs", desc: "Vehicle details" },
  { label: "Features", desc: "Additional info" },
  { label: "Media", desc: "Photos & video" },
  { label: "Review", desc: "Confirm & publish" },
] as const;

export default function NewListingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [video, setVideo] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, watch, trigger, setValue, formState: { errors } } = useForm<ListingInput>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      vehicle_type: "car",
      condition: "used",
      year: new Date().getFullYear(),
      mileage: 0,
      fuel_type: "petrol",
      transmission: "manual",
      owners: 1,
      insurance_valid: false,
      service_history: false,
      rc_available: true,
      fitness_valid: true,
    },
  });

  const handleImageAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const valid = files.filter((f) => f.type.startsWith("image/")).slice(0, 10 - images.length);
    setImages((prev) => [...prev, ...valid]);
    valid.forEach((f) => {
      const reader = new FileReader();
      reader.onload = (e) => setPreviews((prev) => [...prev, e.target?.result as string]);
      reader.readAsDataURL(f);
    });
  };

  const handleVideoAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("video/")) {
      if (file.size > 100 * 1024 * 1024) { // 100MB limit
        toast.error("Video must be under 100MB");
        return;
      }
      setVideo(file);
      const url = URL.createObjectURL(file);
      setVideoPreview(url);
    }
  };

  const removeImage = (i: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== i));
    setPreviews((prev) => prev.filter((_, idx) => idx !== i));
  };

  const removeVideo = () => {
    setVideo(null);
    if (videoPreview) URL.revokeObjectURL(videoPreview);
    setVideoPreview(null);
  };

  const nextStep = async () => {
    const fieldsPerStep: (keyof ListingInput)[][] = [
      ["title", "description"],
      ["make", "model", "year", "vehicle_type", "condition", "price", "mileage", "location"],
      ["fuel_type", "transmission", "color", "seats", "owners"],
      [],
    ];
    if (fieldsPerStep[step]?.length > 0) {
      const valid = await trigger(fieldsPerStep[step]);
      if (!valid) return;
    }
    setStep((s) => s + 1);
  };

  const onSubmit = async (data: ListingInput) => {
    try {
      setSubmitting(true);
      const listing = await listingsService.create(data);
      if (images.length > 0) await listingsService.uploadImages(listing.id, images);
      // Note: Video upload would need backend support
      toast.success("Listing published!");
      router.push(`/main/listings/${listing.id}`);
    } catch {
      toast.error("Failed to create listing. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const values = watch();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => step > 0 ? setStep((s) => s - 1) : router.back()}
            className="w-10 h-10 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:text-gray-900 hover:border-gray-300 transition-all"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Sell Your Vehicle</h1>
            <p className="text-sm text-gray-500">Step {step + 1} of {STEPS.length} · {STEPS[step].desc}</p>
          </div>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-1 mb-8">
          {STEPS.map((s, i) => (
            <div key={s.label} className="flex items-center flex-1">
              <div className="flex flex-col items-center gap-1 min-w-0 flex-1">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
                  i < step ? "bg-emerald-500 text-white" :
                  i === step ? "bg-[#9b111e] text-white ring-4 ring-red-100" :
                  "bg-gray-200 text-gray-500"
                }`}>
                  {i < step ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                </div>
                <span className={`text-[9px] font-semibold uppercase tracking-wide hidden sm:block ${
                  i === step ? "text-[#9b111e]" : i < step ? "text-emerald-600" : "text-gray-400"
                }`}>
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-1 ${i < step ? "bg-emerald-500" : "bg-gray-200"}`} />
              )}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <AnimateStep step={step}>
            {/* Step 1: Basics */}
            {step === 0 && (
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Listing Title</label>
                  <input
                    type="text"
                    placeholder="e.g. 2021 BMW M3 Competition — Low Mileage"
                    className={`w-full px-4 py-3 bg-gray-50 border ${errors.title ? "border-red-500" : "border-gray-200"} rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#9b111e]/20 focus:border-[#9b111e] transition-all`}
                    {...register("title")}
                  />
                  {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    placeholder="Describe the vehicle in detail — condition, features, history, reason for selling…"
                    rows={6}
                    className={`w-full px-4 py-3 bg-gray-50 border ${errors.description ? "border-red-500" : "border-gray-200"} rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#9b111e]/20 focus:border-[#9b111e] transition-all resize-y min-h-[140px]`}
                    {...register("description")}
                  />
                  {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>}
                </div>
              </div>
            )}

            {/* Step 2: Specs */}
            {step === 1 && (
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Make *</label>
                    <input
                      type="text"
                      placeholder="Toyota, BMW…"
                      className={`w-full px-4 py-3 bg-gray-50 border ${errors.make ? "border-red-500" : "border-gray-200"} rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#9b111e]/20 focus:border-[#9b111e]`}
                      {...register("make")}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Model *</label>
                    <input
                      type="text"
                      placeholder="Camry, M3…"
                      className={`w-full px-4 py-3 bg-gray-50 border ${errors.model ? "border-red-500" : "border-gray-200"} rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#9b111e]/20 focus:border-[#9b111e]`}
                      {...register("model")}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Year *</label>
                    <input
                      type="number"
                      placeholder="2021"
                      className={`w-full px-4 py-3 bg-gray-50 border ${errors.year ? "border-red-500" : "border-gray-200"} rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#9b111e]/20 focus:border-[#9b111e]`}
                      {...register("year", { valueAsNumber: true })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mileage (km) *</label>
                    <input
                      type="number"
                      placeholder="35000"
                      className={`w-full px-4 py-3 bg-gray-50 border ${errors.mileage ? "border-red-500" : "border-gray-200"} rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#9b111e]/20 focus:border-[#9b111e]`}
                      {...register("mileage", { valueAsNumber: true })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Type</label>
                    <select
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#9b111e]/20 focus:border-[#9b111e]"
                      {...register("vehicle_type")}
                    >
                      <option value="car">Car</option>
                      <option value="bike">Bike</option>
                      <option value="truck">Truck</option>
                      <option value="van">Van</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Condition</label>
                    <select
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#9b111e]/20 focus:border-[#9b111e]"
                      {...register("condition")}
                    >
                      <option value="new">New</option>
                      <option value="used">Used</option>
                      <option value="certified">Certified Pre-Owned</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹) *</label>
                    <input
                      type="number"
                      placeholder="500000"
                      className={`w-full px-4 py-3 bg-gray-50 border ${errors.price ? "border-red-500" : "border-gray-200"} rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#9b111e]/20 focus:border-[#9b111e]`}
                      {...register("price", { valueAsNumber: true })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
                    <input
                      type="text"
                      placeholder="Mumbai, Maharashtra"
                      className={`w-full px-4 py-3 bg-gray-50 border ${errors.location ? "border-red-500" : "border-gray-200"} rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#9b111e]/20 focus:border-[#9b111e]`}
                      {...register("location")}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Features & Additional Info */}
            {step === 2 && (
              <div className="space-y-6">
                {/* Vehicle Features */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Car className="w-4 h-4 text-[#9b111e]" />
                    Vehicle Features
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Fuel Type</label>
                      <select
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#9b111e]/20 focus:border-[#9b111e]"
                        {...register("fuel_type")}
                      >
                        <option value="petrol">Petrol</option>
                        <option value="diesel">Diesel</option>
                        <option value="electric">Electric</option>
                        <option value="hybrid">Hybrid</option>
                        <option value="cng">CNG</option>
                        <option value="lpg">LPG</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Transmission</label>
                      <select
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#9b111e]/20 focus:border-[#9b111e]"
                        {...register("transmission")}
                      >
                        <option value="manual">Manual</option>
                        <option value="automatic">Automatic</option>
                        <option value="cvt">CVT</option>
                        <option value="dct">DCT</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                      <input
                        type="text"
                        placeholder="White, Black, Silver…"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#9b111e]/20 focus:border-[#9b111e]"
                        {...register("color")}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">No. of Seats</label>
                      <input
                        type="number"
                        placeholder="5"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#9b111e]/20 focus:border-[#9b111e]"
                        {...register("seats", { valueAsNumber: true })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">No. of Owners</label>
                      <select
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#9b111e]/20 focus:border-[#9b111e]"
                        {...register("owners", { valueAsNumber: true })}
                      >
                        <option value={1}>1st Owner</option>
                        <option value={2}>2nd Owner</option>
                        <option value={3}>3rd Owner</option>
                        <option value={4}>4+ Owners</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">RTO Code</label>
                      <input
                        type="text"
                        placeholder="MH-01, DL-02…"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#9b111e]/20 focus:border-[#9b111e]"
                        {...register("rto")}
                      />
                    </div>
                  </div>
                </div>

                {/* Insurance & Service */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-[#9b111e]" />
                    Insurance & Service
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Shield className="w-5 h-5 text-emerald-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Insurance Valid</p>
                          <p className="text-xs text-gray-500">Is insurance currently active?</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" {...register("insurance_valid")} />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-[#9b111e]/20 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                      </label>
                    </div>

                    {values.insurance_valid && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Insurance Expiry Date</label>
                        <input
                          type="date"
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#9b111e]/20 focus:border-[#9b111e]"
                          {...register("insurance_expiry")}
                        />
                      </div>
                    )}

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Wrench className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Service History Available</p>
                          <p className="text-xs text-gray-500">Do you have service records?</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" {...register("service_history")} />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-[#9b111e]/20 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Last Service Date</label>
                      <input
                        type="date"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#9b111e]/20 focus:border-[#9b111e]"
                        {...register("last_service_date")}
                      />
                    </div>
                  </div>
                </div>

                {/* Documents */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#9b111e]" />
                    Documents
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-900">RC Available</p>
                        <p className="text-xs text-gray-500">Registration Certificate</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" {...register("rc_available")} />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-[#9b111e]/20 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Fitness Valid</p>
                        <p className="text-xs text-gray-500">Fitness Certificate</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" {...register("fitness_valid")} />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-[#9b111e]/20 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Media (Photos & Video) */}
            {step === 3 && (
              <div className="space-y-6">
                {/* Photos */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                        <ImagePlus className="w-4 h-4 text-[#9b111e]" />
                        Photos <span className="text-gray-400 font-normal">({images.length}/10)</span>
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">First photo is your cover image</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {previews.map((src, i) => (
                      <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                        <img src={src} alt="" className="w-full h-full object-cover" />
                        {i === 0 && (
                          <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-[#9b111e] text-white text-[9px] font-bold">
                            Cover
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => removeImage(i)}
                          className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center hover:bg-red-500 transition-colors"
                        >
                          <X className="h-3 w-3 text-white" />
                        </button>
                      </div>
                    ))}

                    {images.length < 10 && (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="aspect-square rounded-lg border-2 border-dashed border-gray-200 hover:border-[#9b111e] hover:bg-red-50 flex flex-col items-center justify-center gap-1.5 transition-all group"
                      >
                        <ImagePlus className="h-6 w-6 text-gray-400 group-hover:text-[#9b111e]" />
                        <span className="text-xs text-gray-400 group-hover:text-[#9b111e] font-medium">Add photo</span>
                      </button>
                    )}
                  </div>
                  <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImageAdd} />
                </div>

                {/* Video */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                        <Video className="w-4 h-4 text-[#9b111e]" />
                        Video <span className="text-gray-400 font-normal">(Optional)</span>
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">Upload a walkthrough video (max 100MB)</p>
                    </div>
                  </div>

                  {videoPreview ? (
                    <div className="relative rounded-lg overflow-hidden bg-black">
                      <video src={videoPreview} controls className="w-full aspect-video" />
                      <button
                        type="button"
                        onClick={removeVideo}
                        className="absolute top-3 right-3 px-3 py-1.5 bg-red-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1 hover:bg-red-600 transition-colors"
                      >
                        <X className="h-3 w-3" /> Remove
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => videoInputRef.current?.click()}
                      className="w-full aspect-video rounded-lg border-2 border-dashed border-gray-200 hover:border-[#9b111e] hover:bg-red-50 flex flex-col items-center justify-center gap-2 transition-all group"
                    >
                      <div className="w-12 h-12 rounded-full bg-gray-100 group-hover:bg-red-100 flex items-center justify-center transition-colors">
                        <Video className="h-6 w-6 text-gray-400 group-hover:text-[#9b111e]" />
                      </div>
                      <span className="text-sm text-gray-500 group-hover:text-[#9b111e] font-medium">Click to upload video</span>
                      <span className="text-xs text-gray-400">MP4, MOV, WebM — up to 100MB</span>
                    </button>
                  )}
                  <input ref={videoInputRef} type="file" accept="video/*" className="hidden" onChange={handleVideoAdd} />
                </div>

                <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-amber-800">
                    High-quality photos and videos significantly increase buyer interest. Include exterior, interior, engine, and any special features.
                  </p>
                </div>
              </div>
            )}

            {/* Step 5: Review */}
            {step === 4 && (
              <div className="space-y-5">
                {previews[0] && (
                  <img src={previews[0]} alt="" className="w-full aspect-video object-cover rounded-lg" />
                )}
                <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-200 bg-white">
                    <p className="text-sm font-bold text-gray-900">Listing Summary</p>
                  </div>
                  <div className="divide-y divide-gray-100">
                    <ReviewRow label="Title" value={values.title} />
                    <ReviewRow label="Make / Model" value={`${values.make} ${values.model}`} />
                    <ReviewRow label="Year" value={String(values.year)} />
                    <ReviewRow label="Condition" value={values.condition} />
                    <ReviewRow label="Mileage" value={`${(values.mileage ?? 0).toLocaleString()} km`} />
                    <ReviewRow label="Fuel Type" value={values.fuel_type} />
                    <ReviewRow label="Transmission" value={values.transmission} />
                    <ReviewRow label="Color" value={values.color} />
                    <ReviewRow label="Owners" value={values.owners ? `${values.owners}${values.owners === 1 ? 'st' : values.owners === 2 ? 'nd' : 'rd'} Owner` : undefined} />
                    <ReviewRow label="Insurance" value={values.insurance_valid ? "Valid" : "Not Valid"} />
                    <ReviewRow label="Service History" value={values.service_history ? "Available" : "Not Available"} />
                    <ReviewRow label="Price" value={`₹${(values.price ?? 0).toLocaleString()}`} highlight />
                    <ReviewRow label="Location" value={values.location} />
                    <ReviewRow label="Photos" value={`${images.length} photo${images.length !== 1 ? "s" : ""}`} />
                    <ReviewRow label="Video" value={video ? "1 video" : "No video"} />
                  </div>
                </div>
              </div>
            )}
          </AnimateStep>

          {/* Navigation */}
          <div className="flex items-center justify-between gap-3 mt-8">
            <div className="flex-1">
              {step > 0 && (
                <button
                  type="button"
                  onClick={() => setStep((s) => s - 1)}
                  className="px-6 py-3 bg-white border border-gray-200 text-gray-700 font-semibold rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-all"
                >
                  Back
                </button>
              )}
            </div>

            {step < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-6 py-3 bg-[#9b111e] text-white font-bold rounded-lg hover:bg-[#7b0d18] transition-all flex items-center gap-2"
              >
                Continue <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={submitting}
                className="px-8 py-3 bg-[#9b111e] text-white font-bold rounded-lg hover:bg-[#7b0d18] transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {submitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Publish Listing <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

function AnimateStep({ step, children }: { step: number; children: React.ReactNode }) {
  return (
    <motion.div
      key={step}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
      className="bg-white border border-gray-200 rounded-xl p-6 min-h-[400px]"
    >
      {children}
    </motion.div>
  );
}

function ReviewRow({ label, value, highlight }: { label: string; value: string | undefined; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <span className="text-sm text-gray-500">{label}</span>
      <span className={`text-sm font-semibold ${highlight ? "text-[#9b111e] text-base" : "text-gray-900"}`}>
        {value || "—"}
      </span>
    </div>
  );
}
