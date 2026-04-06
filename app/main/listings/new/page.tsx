"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Upload, X, ImagePlus, ArrowRight, ChevronLeft, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { listingsService } from "@/services/listings.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
});

type ListingInput = z.infer<typeof listingSchema>;

const STEPS = [
  { label: "Details", desc: "Title & description" },
  { label: "Specs", desc: "Vehicle information" },
  { label: "Photos", desc: "Add images" },
  { label: "Review", desc: "Confirm & publish" },
] as const;

export default function NewListingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, watch, trigger, formState: { errors } } = useForm<ListingInput>({
    resolver: zodResolver(listingSchema),
    defaultValues: { vehicle_type: "car", condition: "used", year: new Date().getFullYear(), mileage: 0 },
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

  const removeImage = (i: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== i));
    setPreviews((prev) => prev.filter((_, idx) => idx !== i));
  };

  const nextStep = async () => {
    const fieldsPerStep: (keyof ListingInput)[][] = [
      ["title", "description"],
      ["make", "model", "year", "vehicle_type", "condition", "price", "mileage", "location"],
      [],
    ];
    const valid = await trigger(fieldsPerStep[step]);
    if (valid) setStep((s) => s + 1);
  };

  const onSubmit = async (data: ListingInput) => {
    try {
      setSubmitting(true);
      const listing = await listingsService.create(data);
      if (images.length > 0) await listingsService.uploadImages(listing.id, images);
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
    <div className="max-w-xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => step > 0 ? setStep((s) => s - 1) : router.back()}
          className="w-10 h-10 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:text-slate-900 hover:border-slate-300 hover:bg-slate-50 transition-all shadow-sm"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">List your vehicle</h1>
          <p className="text-sm text-slate-500 mt-0.5">Step {step + 1} of {STEPS.length} · {STEPS[step].desc}</p>
        </div>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-2 mb-8">
        {STEPS.map((s, i) => (
          <div key={s.label} className="flex items-center flex-1">
            <div className="flex flex-col items-center gap-1.5 min-w-0">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                i < step ? "bg-blue-600 text-white shadow-[0_2px_8px_rgba(37,99,235,0.35)]" :
                i === step ? "bg-blue-600 text-white shadow-[0_2px_8px_rgba(37,99,235,0.35)] ring-4 ring-blue-100" :
                "bg-white border-2 border-slate-200 text-slate-400"
              }`}>
                {i < step ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
              </div>
              <span className={`text-[10px] font-semibold tracking-wide ${i === step ? "text-blue-600" : i < step ? "text-slate-500" : "text-slate-300"}`}>
                {s.label.toUpperCase()}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 mb-4 transition-all duration-300 ${i < step ? "bg-blue-600" : "bg-slate-200"}`} />
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <AnimateStep step={step}>
          {step === 0 && (
            <div className="space-y-5">
              <Input
                label="Listing title"
                placeholder="e.g. 2021 BMW M3 Competition — Low Mileage"
                error={errors.title?.message}
                {...register("title")}
              />
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Description
                </label>
                <textarea
                  placeholder="Describe the vehicle in detail — condition, features, history, reason for selling…"
                  rows={6}
                  className="input-base w-full resize-y min-h-[140px]"
                  {...register("description")}
                />
                {errors.description && <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.description.message}</p>}
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <Input label="Make" placeholder="Toyota, BMW…" error={errors.make?.message} {...register("make")} />
                <Input label="Model" placeholder="Camry, M3…" error={errors.model?.message} {...register("model")} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Year" type="number" placeholder="2021" error={errors.year?.message}
                  {...register("year", { valueAsNumber: true })} />
                <Input label="Mileage (miles)" type="number" placeholder="35000" error={errors.mileage?.message}
                  {...register("mileage", { valueAsNumber: true })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Vehicle Type</label>
                  <select className="input-base w-full" {...register("vehicle_type")}>
                    <option value="car">Car</option>
                    <option value="bike">Bike</option>
                    <option value="truck">Truck</option>
                    <option value="van">Van</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Condition</label>
                  <select className="input-base w-full" {...register("condition")}>
                    <option value="new">New</option>
                    <option value="used">Used</option>
                    <option value="certified">Certified Pre-Owned</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Asking Price ($)" type="number" placeholder="25000" error={errors.price?.message}
                  {...register("price", { valueAsNumber: true })} />
                <Input label="Location" placeholder="City, State" error={errors.location?.message}
                  {...register("location")} />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div>
                <p className="text-sm font-bold text-slate-900 mb-1">
                  Photos <span className="text-slate-400 font-normal">({images.length}/10)</span>
                </p>
                <p className="text-sm text-slate-500">First photo is your cover image. High-quality photos get more inquiries.</p>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {previews.map((src, i) => (
                  <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-slate-100 shadow-sm">
                    <img src={src} alt="" className="w-full h-full object-cover" />
                    {i === 0 && (
                      <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-lg bg-blue-600 text-white text-[9px] font-bold shadow">
                        Cover
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-1.5 right-1.5 w-6 h-6 rounded-lg bg-black/60 backdrop-blur-sm flex items-center justify-center hover:bg-red-500 transition-colors"
                    >
                      <X className="h-3 w-3 text-white" />
                    </button>
                  </div>
                ))}

                {images.length < 10 && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square rounded-xl border-2 border-dashed border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 flex flex-col items-center justify-center gap-1.5 transition-all group"
                  >
                    <ImagePlus className="h-6 w-6 text-slate-300 group-hover:text-blue-500 transition-colors" />
                    <span className="text-xs text-slate-400 group-hover:text-blue-500 font-medium">Add photo</span>
                  </button>
                )}
              </div>

              <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImageAdd} />

              <p className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
                <Upload className="h-3.5 w-3.5" /> JPG, PNG, WebP — up to 10MB each
              </p>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              {previews[0] && (
                <img src={previews[0]} alt="" className="w-full aspect-video object-cover rounded-xl shadow-sm" />
              )}
              <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-200 bg-white">
                  <p className="text-sm font-bold text-slate-900">Listing Summary</p>
                </div>
                <div className="divide-y divide-slate-100">
                  <ReviewRow label="Title" value={values.title} />
                  <ReviewRow label="Make / Model" value={`${values.make} ${values.model}`} />
                  <ReviewRow label="Year" value={String(values.year)} />
                  <ReviewRow label="Condition" value={values.condition} />
                  <ReviewRow label="Mileage" value={`${(values.mileage ?? 0).toLocaleString()} mi`} />
                  <ReviewRow label="Price" value={`$${(values.price ?? 0).toLocaleString()}`} highlight />
                  <ReviewRow label="Location" value={values.location} />
                  <ReviewRow label="Photos" value={`${images.length} photo${images.length !== 1 ? "s" : ""}`} />
                </div>
              </div>
            </div>
          )}
        </AnimateStep>

        {/* Navigation */}
        <div className="flex items-center justify-between gap-3 mt-8">
          <div className="flex-1">
            {step > 0 && (
              <Button type="button" variant="secondary" className="w-full sm:w-auto" onClick={() => setStep((s) => s - 1)}>
                Back
              </Button>
            )}
          </div>

          {step < STEPS.length - 1 ? (
            <Button type="button" onClick={nextStep} className="flex-1 sm:flex-none gap-2">
              Continue <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button type="submit" loading={submitting} className="flex-1 sm:flex-none gap-2 px-8">
              Publish Listing <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </form>
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
      className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-8 min-h-[340px]"
    >
      {children}
    </motion.div>
  );
}

function ReviewRow({ label, value, highlight }: { label: string; value: string | undefined; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <span className="text-sm text-slate-500">{label}</span>
      <span className={`text-sm font-bold ${highlight ? "text-blue-600 text-base" : "text-slate-900"}`}>
        {value || "—"}
      </span>
    </div>
  );
}
