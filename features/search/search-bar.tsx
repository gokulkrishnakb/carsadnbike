"use client";

import { Suspense, useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SearchBarProps {
  defaultValue?: string;
  onSearch?: (query: string) => void;
  placeholder?: string;
  className?: string;
}

function SearchBarInner({ defaultValue = "", onSearch, placeholder = "Search vehicles…", className }: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(defaultValue);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  const handleChange = (v: string) => {
    setValue(v);
    if (onSearch) {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => onSearch(v), 300);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(value);
    } else {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set("q", value);
      else params.delete("q");
      params.delete("page");
      router.push(`/main/listings?${params.toString()}`);
    }
    inputRef.current?.blur();
  };

  const clear = () => {
    setValue("");
    onSearch?.("");
    inputRef.current?.focus();
  };

  return (
    <form onSubmit={handleSubmit} className={`relative flex items-center ${className ?? ""}`}>
      <div
        className={`relative flex items-center w-full rounded-xl border transition-all duration-200 overflow-hidden ${
          focused
            ? "border-blue-500 shadow-[0_0_0_3px_rgba(37,99,235,0.1)]"
            : "border-slate-200 hover:border-slate-300 shadow-sm"
        } bg-white`}
      >
        <Search
          className={`absolute left-3.5 h-4 w-4 transition-colors duration-200 pointer-events-none ${
            focused ? "text-blue-500" : "text-slate-400"
          }`}
        />
        <input
          ref={inputRef}
          type="search"
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          className="w-full bg-transparent pl-10 pr-10 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
        />
        <AnimatePresence>
          {value && (
            <motion.button
              type="button"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.1 }}
              onClick={clear}
              className="absolute right-3 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </form>
  );
}

export function SearchBar(props: SearchBarProps) {
  return (
    <Suspense>
      <SearchBarInner {...props} />
    </Suspense>
  );
}
