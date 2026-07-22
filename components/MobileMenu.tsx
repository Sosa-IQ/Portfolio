"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";

import { navigation } from "@/data/site";

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const summaryRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    const desktopLayout = window.matchMedia("(min-width: 721px)");
    const links = Array.from(panelRef.current?.querySelectorAll<HTMLAnchorElement>("a") ?? []);
    const focusable = [summaryRef.current, ...links].filter(
      (element): element is HTMLElement => element !== null,
    );
    const focusTimer = window.setTimeout(() => links[0]?.focus(), 120);

    const closeMenu = (returnFocus = false) => {
      if (detailsRef.current) detailsRef.current.open = false;
      setOpen(false);
      if (returnFocus) window.requestAnimationFrame(() => summaryRef.current?.focus());
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMenu(true);
        return;
      }
      if (event.key !== "Tab" || focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    const handleDesktopLayout = (event: MediaQueryListEvent) => {
      if (event.matches) closeMenu();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    desktopLayout.addEventListener("change", handleDesktopLayout);
    if (desktopLayout.matches) closeMenu();

    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      desktopLayout.removeEventListener("change", handleDesktopLayout);
    };
  }, [open]);

  const closeFromLink = () => {
    if (detailsRef.current) detailsRef.current.open = false;
    setOpen(false);
  };

  return (
    <details
      ref={detailsRef}
      className="mobile-nav"
      onToggle={(event) => setOpen(event.currentTarget.open)}
    >
      <summary
        ref={summaryRef}
        className="menu-toggle"
        aria-label={open ? "Close navigation" : "Open navigation"}
        aria-controls="mobile-menu-panel"
      >
        <span /><span />
      </summary>
      <div ref={panelRef} className="mobile-menu-panel" id="mobile-menu-panel" data-open={open}>
        <nav aria-label="Mobile navigation">
          {navigation.map((item, index) => (
            <Link
              href={item.href}
              key={item.href}
              onClick={closeFromLink}
              style={{ "--menu-index": index } as CSSProperties}
            >
              <span>0{index + 1}</span>{item.label}<i>↗</i>
            </Link>
          ))}
        </nav>
        <p>Selected work, field notes, and a direct line.</p>
      </div>
    </details>
  );
}
