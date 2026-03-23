"use client";
import { useState, KeyboardEvent } from "react";
import { X, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props { value: string[]; onChange: (t: string[]) => void; label?: string; placeholder?: string; error?: string; suggestions?: string[]; }

export default function TagInput({ value, onChange, label, placeholder = "Type and press Enter", error, suggestions = [] }: Props) {
  const [input, setInput] = useState("");
  const [showSug, setShowSug] = useState(false);

  const add = (tag: string) => { const t = tag.trim(); if (t && !value.includes(t)) onChange([...value, t]); setInput(""); setShowSug(false); };
  const remove = (i: number) => onChange(value.filter((_, idx) => idx !== i));

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") { e.preventDefault(); if (input.trim()) add(input); }
    if (e.key === "Backspace" && !input && value.length > 0) remove(value.length - 1);
  };

  const filtered = suggestions.filter((s) => s.toLowerCase().includes(input.toLowerCase()) && !value.includes(s));

  return (
    <div className="space-y-1.5">
      {label && <label className="block text-sm font-medium text-text-secondary">{label}</label>}
      <div className={cn("flex flex-wrap gap-2 p-3 rounded-lg border bg-surface min-h-[46px] focus-within:ring-2 focus-within:ring-primary/50 focus-within:border-primary transition-all",
        error ? "border-red-500" : "border-border")}>
        {value.map((tag, i) => (
          <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary/10 text-primary text-sm rounded-md font-mono">
            {tag}<button type="button" onClick={() => remove(i)} className="hover:text-red-400"><X className="w-3 h-3" /></button>
          </span>
        ))}
        <div className="relative flex-1 min-w-[120px]">
          <input type="text" value={input} onChange={(e) => { setInput(e.target.value); setShowSug(true); }} onKeyDown={onKey}
            onFocus={() => setShowSug(true)} onBlur={() => setTimeout(() => setShowSug(false), 200)}
            placeholder={value.length === 0 ? placeholder : "Add more..."} className="w-full bg-transparent outline-none text-sm text-text-primary placeholder:text-text-muted" />
          {showSug && input && filtered.length > 0 && (
            <div className="absolute top-full left-0 mt-1 w-full bg-surface border border-border rounded-lg shadow-xl z-10 max-h-40 overflow-y-auto">
              {filtered.map((s) => (
                <button key={s} type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => add(s)}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-surface-2 transition-colors flex items-center gap-2">
                  <Plus className="w-3 h-3 text-text-muted" />{s}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
