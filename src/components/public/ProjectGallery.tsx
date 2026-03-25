"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export default function ProjectGallery({ images }: { images: string[] }) {
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);

  const openLB = (index: number) => {
    setIdx(index);
    setOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeLB = () => {
    setOpen(false);
    document.body.style.overflow = "";
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {images.map((image, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.02 }}
            onClick={() => openLB(index)}
            className="relative aspect-video cursor-zoom-in overflow-hidden rounded-xl border border-border transition-all hover:border-primary/30"
          >
            <Image src={image} alt={`Screenshot ${index + 1}`} fill className="object-cover" />
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95"
            onClick={closeLB}
          >
            <button
              onClick={closeLB}
              className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white/70 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>

            {images.length > 1 && (
              <>
                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    setIdx((current) => (current - 1 + images.length) % images.length);
                  }}
                  className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white/70 hover:text-white"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    setIdx((current) => (current + 1) % images.length);
                  }}
                  className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white/70 hover:text-white"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative h-[80vh] w-[90vw]"
              onClick={(event) => event.stopPropagation()}
            >
              <Image
                src={images[idx]}
                alt={`Screenshot ${idx + 1}`}
                fill
                className="object-contain"
              />
            </motion.div>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-white/60">
              {idx + 1} / {images.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
