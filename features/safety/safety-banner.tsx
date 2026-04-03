"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X, Info, ChevronDown, ChevronUp, ShieldAlert } from "lucide-react";

export type SafetyLevel = "info" | "warning" | "danger";

interface SafetyBannerProps {
  level: SafetyLevel;
  title: string;
  message: string;
  tips?: string[];
  dismissible?: boolean;
}

const STYLES: Record<SafetyLevel, {
  bg: string; border: string; leftBar: string;
  title: string; body: string; icon: string;
  iconBg: string; iconComponent: typeof AlertTriangle;
}> = {
  info: {
    bg: "bg-blue-50", border: "border-blue-200", leftBar: "bg-blue-500",
    title: "text-blue-900", body: "text-blue-700", icon: "text-blue-500",
    iconBg: "bg-blue-100 border-blue-200", iconComponent: Info,
  },
  warning: {
    bg: "bg-amber-50", border: "border-amber-200", leftBar: "bg-amber-500",
    title: "text-amber-900", body: "text-amber-700", icon: "text-amber-500",
    iconBg: "bg-amber-100 border-amber-200", iconComponent: AlertTriangle,
  },
  danger: {
    bg: "bg-red-50", border: "border-red-200", leftBar: "bg-red-500",
    title: "text-red-900", body: "text-red-700", icon: "text-red-500",
    iconBg: "bg-red-100 border-red-200", iconComponent: ShieldAlert,
  },
};

export function SafetyBanner({ level, title, message, tips, dismissible = true }: SafetyBannerProps) {
  const [dismissed, setDismissed] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const s = STYLES[level];
  const Icon = s.iconComponent;

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className={`rounded-xl border overflow-hidden ${s.bg} ${s.border}`}
        >
          <div className="flex gap-3 px-4 py-3.5">
            <div className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 ${s.iconBg}`}>
              <Icon className={`h-4 w-4 ${s.icon}`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <p className={`text-sm font-bold ${s.title}`}>{title}</p>
                <div className="flex items-center gap-1 shrink-0">
                  {tips && tips.length > 0 && (
                    <button
                      onClick={() => setExpanded(!expanded)}
                      className={`${s.icon} opacity-70 hover:opacity-100 transition-opacity p-0.5 rounded`}
                    >
                      {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                  )}
                  {dismissible && (
                    <button
                      onClick={() => setDismissed(true)}
                      className="text-slate-400 hover:text-slate-600 transition-colors p-0.5 rounded"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
              <p className={`text-xs mt-0.5 leading-relaxed ${s.body}`}>{message}</p>

              <AnimatePresence>
                {expanded && tips && (
                  <motion.ul
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-2.5 space-y-1.5"
                  >
                    {tips.map((tip, i) => (
                      <li key={i} className={`flex items-start gap-2 text-xs ${s.body}`}>
                        <span className={`${s.icon} mt-0.5 shrink-0`}>•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function CashPaymentWarning() {
  return (
    <SafetyBanner
      level="danger"
      title="Never pay with cash or wire transfer"
      message="This seller is requesting cash or wire transfer. This is a common fraud tactic."
      tips={[
        "Use secure payment platforms only",
        "Never transfer money before seeing the vehicle in person",
        "Meet at a public location for test drives",
        "Request a vehicle history report (CarFax, AutoCheck)",
        "Verify the seller's identity and ownership documents",
      ]}
    />
  );
}

export function OtpWarning() {
  return (
    <SafetyBanner
      level="danger"
      title="OTP / verification code request detected"
      message="Never share SMS codes or one-time passwords with anyone, including apparent buyers or sellers."
      tips={[
        "Legitimate sellers never need your OTP codes",
        "OTP sharing is a common account takeover scam",
        "Report this conversation if you're being pressured for codes",
      ]}
    />
  );
}

export function NewSellerWarning() {
  return (
    <SafetyBanner
      level="warning"
      title="New or unverified seller"
      message="This seller recently joined and has limited transaction history. Exercise additional caution."
      tips={[
        "Ask for proof of ownership before proceeding",
        "Consider meeting at a dealership or public place",
        "Check for verified badge and reviews",
      ]}
    />
  );
}

export function SuspiciousPriceWarning({ price, avgPrice }: { price: number; avgPrice: number }) {
  const diff = Math.round(((avgPrice - price) / avgPrice) * 100);
  return (
    <SafetyBanner
      level="warning"
      title={`Price is ${diff}% below market average`}
      message="Unusually low prices can indicate a scam listing. Verify the vehicle and seller before any payment."
    />
  );
}
