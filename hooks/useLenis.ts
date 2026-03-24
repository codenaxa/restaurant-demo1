"use client";

import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";

export function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.45,
      lerp: 0.065,
      gestureOrientation: "vertical",
      smoothWheel: true,
      syncTouch: true,
      touchMultiplier: 1.1,
      wheelMultiplier: 0.95
    });

    let frame = 0;

    const scrollToHash = (hash: string) => {
      if (!hash) return;

      const target = document.querySelector<HTMLElement>(hash);

      if (target) {
        lenis.scrollTo(target, {
          offset: -88,
          duration: 1.35
        });
      }
    };

    const raf = (time: number) => {
      lenis.raf(time);
      frame = window.requestAnimationFrame(raf);
    };

    const handleHashChange = () => scrollToHash(window.location.hash);
    const hashTimer = window.setTimeout(handleHashChange, 120);

    frame = window.requestAnimationFrame(raf);
    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.clearTimeout(hashTimer);
      window.removeEventListener("hashchange", handleHashChange);
      window.cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);
}
