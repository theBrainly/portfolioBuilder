"use client";
import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export default function ProjectGallery({ images }: { images: string[] }) {
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);

  const openLB = (i: number) => { setIdx(i); setOpen(true); document.body.style.overflow = "hidden"; };
  const closeLB = () => { setOpen(false); document.body.style.overflow = ""; };

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {images.map((img, i) => (
          <motion.button key={i} whileHover={{ scale: 1.02 }} onClick={() => openLB(i)}
            className="relative aspect-video rounded-xl overflow-hidden border border-border hover:border-primary/30 transition-all cursor-zoom-in">
            <Image src={img} alt={`Screenshot ${i + 1}`} fill className="object-cover" />
          </motion.button>
        ))}
      </div>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center" onClick={closeLB}>
            <button onClick={closeLB} className="absolute top-4 right-4 p-2 text-white/70 hover:text-white bg-white/10 rounded-full z-10"><X className="w-6 h-6" /></button>
            {images.length > 1 && (
              <>
                <button onClick={(e) => { e.stopPropagation(); setIdx((p) => (p - 1 + images.length) % images.length); }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 text-white/70 hover:text-white bg-white/10 rounded-full z-10"><ChevronLeft className="w-6 h-6" /></button>
                <button onClick={(e) => { e.stopPropagation(); setIdx((p) => (p + 1) % images.length); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 text-white/70 hover:text-white bg-white/10 rounded-full z-10"><ChevronRight className="w-6 h-6" /></button>
              </>
            )}
            <motion.div key={idx} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative w-[90vw] h-[80vh]" onClick={(e) => e.stopPropagation()}>
              <Image src={images[idx]} alt={`Screenshot ${idx + 1}`} fill className="object-contain" />
            </motion.div>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-sm">{idx + 1} / {images.length}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
