"use client";

import { useEffect, useState } from "react";

/**
 * PageLoader — shimmering "La Jade" branded splash screen.
 */
export default function PageLoader() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    // Start fade after 1.6s, fully remove after transition (0.6s)
    const fadeTimer = setTimeout(() => setFading(true), 1600);
    const removeTimer = setTimeout(() => setVisible(false), 2200);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9998,
        backgroundColor: "#0e0c09",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: "20px",
        opacity: fading ? 0 : 1,
        transition: "opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
        pointerEvents: fading ? "none" : "all",
      }}
    >
      {/* Ambient glow */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(217,119,6,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Logo mark */}
      <div style={{ position: "relative" }}>
        {/* Outer ring — slow pulse */}
        <div
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "50%",
            border: "1px solid rgba(217,119,6,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: "lj-ring-pulse 2s ease-in-out infinite",
          }}
        >
          {/* Inner circle */}
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              background: "rgba(217,119,6,0.1)",
              border: "1px solid rgba(217,119,6,0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                fontFamily: "Georgia, serif",
                fontSize: "16px",
                fontWeight: "bold",
                color: "#d97706",
                letterSpacing: "0.05em",
              }}
            >
              LJ
            </span>
          </div>
        </div>
      </div>

      {/* "La Jade" shimmer text */}
      <div style={{ position: "relative", overflow: "hidden" }}>
        <span
          style={{
            fontFamily: "Georgia, serif",
            fontSize: "22px",
            fontWeight: "bold",
            color: "rgba(255,255,255,0.15)",
            letterSpacing: "0.08em",
            position: "relative",
            display: "inline-block",
          }}
        >
          La Jade
          {/* Shimmer overlay */}
          <span
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(90deg, transparent 0%, rgba(217,119,6,0.9) 45%, rgba(255,220,100,1) 50%, rgba(217,119,6,0.9) 55%, transparent 100%)",
              backgroundSize: "200% 100%",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
              animation: "lj-shimmer 1.8s ease-in-out infinite",
            }}
          >
            La Jade
          </span>
        </span>
      </div>

      {/* Progress dots */}
      <div style={{ display: "flex", gap: "6px", marginTop: "4px" }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: "4px",
              height: "4px",
              borderRadius: "50%",
              backgroundColor: "rgba(217,119,6,0.5)",
              animation: `lj-dot-bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>

      {/* Keyframes injected via style tag */}
      <style>{`
        @keyframes lj-shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes lj-ring-pulse {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50%       { transform: scale(1.08); opacity: 1; }
        }
        @keyframes lj-dot-bounce {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.3; }
          40%            { transform: scale(1.2); opacity: 1; }
        }
      `}</style>
    </div>
  );
}