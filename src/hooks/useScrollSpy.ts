"use client";

import { useState, useEffect } from "react";

export function useScrollSpy(ids: string[], offset: number = 100) {
  const [active, setActive] = useState("");

  useEffect(() => {
    const onScroll = () => {
      const pos = window.scrollY + offset;
      for (let i = ids.length - 1; i >= 0; i--) {
        const el = document.getElementById(ids[i]);
        if (el && el.offsetTop <= pos) {
          setActive(ids[i]);
          break;
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [ids, offset]);

  return active;
}
