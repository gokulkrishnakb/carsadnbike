import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "amber" | "success" | "danger" | "info" | "outline";

const styles: Record<BadgeVariant, string> = {
  default: "bg-slate-100 text-slate-700 border border-slate-200",
  amber:   "bg-amber-50 text-amber-700 border border-amber-200",
  success: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  danger:  "bg-red-50 text-red-600 border border-red-200",
  info:    "bg-blue-50 text-blue-700 border border-blue-200",
  outline: "bg-transparent border border-slate-300 text-slate-600",
};

export function Badge({
  children,
  variant = "default",
  className,
}: {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide",
        styles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
