"use client";
import { useState, useCallback } from "react";
import { X, ImageIcon } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import Spinner from "./Spinner";

interface Props { value: string; onChange: (url: string) => void; folder?: string; label?: string; className?: string; }

export default function ImageUploader({ value, onChange, folder = "general", label, className }: Props) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const upload = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) { toast.error("Upload an image file"); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error("Max 5MB"); return; }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", folder);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      onChange(data.data.url);
      toast.success("Uploaded!");
    } catch (e: any) { toast.error(e.message || "Upload failed"); }
    finally { setUploading(false); }
  }, [folder, onChange]);

  return (
    <div className={cn("space-y-1.5", className)}>
      {label && <label className="block text-sm font-medium text-text-secondary">{label}</label>}
      {value ? (
        <div className="relative group w-full h-48 rounded-xl overflow-hidden border border-border">
          <Image src={value} alt="Uploaded" fill className="object-cover" />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button type="button" onClick={() => onChange("")} className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600"><X className="w-5 h-5" /></button>
          </div>
        </div>
      ) : (
        <div onDragOver={(e) => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) upload(f); }}
          className={cn("relative w-full h-48 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-3 cursor-pointer transition-all",
            dragOver ? "border-primary bg-primary/5" : "border-border hover:border-text-muted")}>
          {uploading ? <Spinner size="sm" /> : (
            <>
              <div className="p-3 bg-surface-2 rounded-xl"><ImageIcon className="w-6 h-6 text-text-muted" /></div>
              <p className="text-sm text-text-secondary"><span className="text-primary font-medium">Click to upload</span> or drag</p>
              <p className="text-xs text-text-muted">PNG, JPG, WebP up to 5MB</p>
            </>
          )}
          <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f); }}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" disabled={uploading} />
        </div>
      )}
    </div>
  );
}
