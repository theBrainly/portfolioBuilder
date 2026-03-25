"use client";

import { GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

interface DragResizeHandleProps {
  ariaLabel: string;
  className?: string;
  onResize: (deltaX: number) => void;
}

export default function DragResizeHandle({
  ariaLabel,
  className,
  onResize,
}: DragResizeHandleProps) {
  const handlePointerDown = (event: React.PointerEvent<HTMLButtonElement>) => {
    event.preventDefault();

    let lastX = event.clientX;
    const previousCursor = document.body.style.cursor;
    const previousUserSelect = document.body.style.userSelect;

    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const deltaX = moveEvent.clientX - lastX;
      lastX = moveEvent.clientX;
      onResize(deltaX);
    };

    const stopResizing = () => {
      document.body.style.cursor = previousCursor;
      document.body.style.userSelect = previousUserSelect;
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", stopResizing);
      window.removeEventListener("pointercancel", stopResizing);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", stopResizing);
    window.addEventListener("pointercancel", stopResizing);
  };

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onPointerDown={handlePointerDown}
      className={cn(
        "group relative flex w-4 shrink-0 cursor-col-resize touch-none items-center justify-center",
        className
      )}
    >
      <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-border transition-colors group-hover:bg-primary/40" />
      <span className="z-10 flex h-10 w-2 items-center justify-center rounded-full border border-border bg-surface text-text-muted shadow-sm transition-colors group-hover:border-primary/30 group-hover:text-primary">
        <GripVertical className="h-3.5 w-3.5" />
      </span>
    </button>
  );
}
