"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

import { calculateRevealProgress } from "@/lib/scroll-motion";

export function ScrollMotion() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const elements = Array.from(document.querySelectorAll<HTMLElement>("[data-scroll]"));
    let frame = 0;
    let active = false;

    const update = () => {
      frame = 0;
      const viewportHeight = window.innerHeight;
      const scrollRange = Math.max(1, document.documentElement.scrollHeight - viewportHeight);
      const pageProgress = Math.min(1, Math.max(0, window.scrollY / scrollRange));
      const heroProgress = Math.min(1, Math.max(0, window.scrollY / Math.max(1, viewportHeight * 0.85)));

      root.style.setProperty("--page-scroll", pageProgress.toFixed(4));
      root.style.setProperty("--hero-scroll", heroProgress.toFixed(4));

      for (const element of elements) {
        const delay = Number(element.dataset.scrollDelay ?? 0);
        const top = element.getBoundingClientRect().top + delay * viewportHeight * 0.08;
        const progress = calculateRevealProgress(top, viewportHeight);
        element.style.setProperty("--view-progress", progress.toFixed(4));
        element.style.setProperty("--view-offset", (1 - progress).toFixed(4));
        element.style.setProperty("--view-scale", (0.94 + progress * 0.06).toFixed(4));
      }
    };

    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    const stop = () => {
      active = false;
      root.classList.remove("motion-ready");
      root.style.removeProperty("--page-scroll");
      root.style.removeProperty("--hero-scroll");
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
      for (const element of elements) {
        element.style.removeProperty("--view-progress");
        element.style.removeProperty("--view-offset");
        element.style.removeProperty("--view-scale");
      }
    };

    const start = () => {
      if (active) return;
      active = true;
      root.classList.add("motion-ready");
      update();
      window.addEventListener("scroll", requestUpdate, { passive: true });
      window.addEventListener("resize", requestUpdate);
    };

    const handleMotionPreference = () => {
      if (reduceMotion.matches) stop();
      else start();
    };

    reduceMotion.addEventListener("change", handleMotionPreference);
    handleMotionPreference();

    return () => {
      reduceMotion.removeEventListener("change", handleMotionPreference);
      stop();
    };
  }, [pathname]);

  return <div className="scroll-progress" aria-hidden="true"><span /></div>;
}
