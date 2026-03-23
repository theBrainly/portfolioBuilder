"use client";
import { useState, useCallback } from "react";
import { Upload, X } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import Spinner from "@/components/ui/Spinner";

interface Props { value: string[]; onChange: (urls: string[]) => void; folder?: string; label?: string; max?: number; }

export default function MultiImageUploader({ value, onChange, folder = "projects", label, max = 6 }: Props) {
  const [uploading, setUploading] = useState(false);

  const upload = useCallback(async (file: File) => {
    if (value.length >= max) { toast.error(`Max ${max} images`); return; }
    if (!file.type.startsWith("image/") || file.size > 5 * 1024 * 1024) { toast.error("Invalid file"); return; }
    setUploading(true);
    try {
      const fd = new FormData(); fd.append("file", file); fd.append("folder", folder);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      onChange([...value, data.data.url]);
      toast.success("Uploaded!");
    } catch (e: any) { toast.error(e.message); } finally { setUploading(false); }
  }, [value, onChange, folder, max]);

  return (
    <div className="space-y-1.5">
      {label && <label className="block text-sm font-medium text-text-secondary">{label} ({value.length}/{max})</label>}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {value.map((url, i) => (
          <div key={i} className="relative group aspect-video rounded-xl overflow-hidden border border-border">
            <Image src={url} alt={`Image ${i + 1}`} fill className="object-cover" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button type="button" onClick={() => onChange(value.filter((_, idx) => idx !== i))} className="p-2 bg-red-500 text-white rounded-full"><X className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
        {value.length < max && (
          <label className={cn("relative aspect-video rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer transition-all",
            uploading ? "border-primary bg-primary/5" : "border-border hover:border-text-muted")}>
            {uploading ? <Spinner size="sm" /> : <><Upload className="w-5 h-5 text-text-muted" /><span className="text-xs text-text-muted">Add Image</span></>}
            <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f); e.target.value = ""; }}
              className="absolute inset-0 opacity-0 cursor-pointer" disabled={uploading} />
          </label>
        )}
      </div>
    </div>
  );
}
