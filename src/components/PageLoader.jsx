"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";

export default function PageLoader() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);
  const isFirst = useRef(true);
  const fadeTimer = useRef(null);
  const removeTimer = useRef(null);

  function showLoader() {
    clearTimeout(fadeTimer.current);
    clearTimeout(removeTimer.current);
    setFading(false);
    setVisible(true);
  }

  function hideLoader() {
    fadeTimer.current = setTimeout(() => setFading(true), 50);
    removeTimer.current = setTimeout(() => setVisible(false), 350);
  }

  useEffect(() => {
    const handleClick = (e) => {
      const anchor = e.target.closest("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href) return;
      const isInternal =
        !href.startsWith("http") &&
        !href.startsWith("mailto") &&
        !href.startsWith("tel") &&
        !href.startsWith("#") &&
        !href.startsWith("//");
      if (isInternal) showLoader();
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      fadeTimer.current = setTimeout(() => setFading(true), 100);
      removeTimer.current = setTimeout(() => setVisible(false), 400);
      return;
    }
    hideLoader();
  }, [pathname]);

  useEffect(() => {
    return () => {
      clearTimeout(fadeTimer.current);
      clearTimeout(removeTimer.current);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9998,
        background: "#0d0d0d",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: fading ? 0 : 1,
        transition: "opacity 0.3s ease",
        pointerEvents: fading ? "none" : "all",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem" }}>
        <div
          style={{
            position: "relative",
            fontFamily: "var(--font-display, 'Playfair Display', Georgia, serif)",
            fontSize: "1.9rem",
            letterSpacing: "0.35em",
            color: "#f5f5f5",
          }}
        >
          <span style={{ opacity: 0.12 }}>Jalade.dev</span>
          <span
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              color: "#4f9eff",
              animation: "revealText 0.9s ease-in-out infinite",
            }}
          >
            Jalade.dev
          </span>
        </div>

        <div style={{ width: "6rem", height: "1px", background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
          <div
            style={{
              height: "100%",
              width: "100%",
              background: "#4f9eff",
              animation: "slideBar 0.9s ease-in-out infinite",
            }}
          />
        </div>
      </div>
    </div>
  );
}