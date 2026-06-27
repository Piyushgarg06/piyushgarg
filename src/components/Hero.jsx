import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { data, springs } from "../constants/data";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import PacmanGame from "./PacmanGame";

export default function Hero() {
  const prefersReduced = usePrefersReducedMotion();
  const [gameOpen, setGameOpen] = useState(false);
  const [triggerHovered, setTriggerHovered] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  // Exclude touch devices and screen widths < 1024px
  useEffect(() => {
    const checkDesktop = () => {
      const isCoarse = window.matchMedia("(pointer: coarse)").matches;
      setIsDesktop(window.innerWidth >= 1024 && !isCoarse);
    };
    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  return (
    <section
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Grid background */}
      <motion.div
        className="hero-grid"
        initial={prefersReduced ? {} : { opacity: 0 }}
        animate={prefersReduced ? {} : { opacity: 0.4 }}
        transition={{ duration: 2, delay: 0.6 }}
      />

      {/* Gradient fade at bottom of hero */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 200,
          background: "linear-gradient(to top, var(--bg), transparent)",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />

      <div
        className="container"
        style={{ position: "relative", zIndex: 2, width: "100%" }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isDesktop && gameOpen ? "1.2fr 1fr" : "1fr",
            gap: 48,
            alignItems: isDesktop && gameOpen ? "start" : "center",
            width: "100%",
          }}
        >
          {/* Column 1: Main content */}
          <div>
            {/* Name line 1 */}
            <motion.h1
              className="font-display"
              initial={prefersReduced ? {} : { opacity: 0, y: 40 }}
              animate={prefersReduced ? {} : { opacity: 1, y: 0 }}
              transition={{ ...springs.snappy, delay: 0.1 }}
              style={{
                fontSize: "clamp(44px, 10vw, 120px)",
                fontWeight: 800,
                lineHeight: 0.95,
                color: "var(--text)",
                margin: 0,
                letterSpacing: "-0.02em",
              }}
            >
              {data.name.line1}
            </motion.h1>

            {/* Name line 2 */}
            <motion.span
              className="font-display"
              initial={prefersReduced ? {} : { opacity: 0, y: 40 }}
              animate={prefersReduced ? {} : { opacity: 1, y: 0 }}
              transition={{ ...springs.snappy, delay: 0.18 }}
              aria-hidden="true"
              style={{
                display: "block",
                fontSize: "clamp(44px, 10vw, 120px)",
                fontWeight: 800,
                lineHeight: 0.95,
                color: "var(--text)",
                marginBottom: 40,
                letterSpacing: "-0.02em",
              }}
            >
              {data.name.line2}
            </motion.span>

            {/* Subtitle */}
            <motion.p
              initial={prefersReduced ? {} : { opacity: 0, y: 20 }}
              animate={prefersReduced ? {} : { opacity: 1, y: 0 }}
              transition={{ ...springs.gentle, delay: 0.32 }}
              style={{
                fontSize: 17,
                color: "var(--muted)",
                maxWidth: 560,
                lineHeight: 1.65,
                marginBottom: 36,
              }}
            >
              {data.subtitle}
            </motion.p>

            {/* CTA links */}
            <motion.div
              initial={prefersReduced ? {} : { opacity: 0 }}
              animate={prefersReduced ? {} : { opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.48 }}
              style={{ display: "flex", gap: 32, alignItems: "center" }}
            >
              <a href="#projects" className="hero-link">
                See my work ↓
              </a>
              <a
                href="#contact"
                className="hero-link"
                style={{ color: "var(--muted)" }}
              >
                Get in touch ↓
              </a>
            </motion.div>

            {/* Mobile-only Easter egg hint */}
            {!isDesktop && (
              <div
                className="font-mono"
                style={{
                  marginTop: 40,
                  fontSize: 11,
                  color: "var(--muted)",
                  opacity: 0.45,
                  userSelect: "none",
                  textAlign: "left",
                }}
              >
                // this page has secrets. desktop reveals them.
              </div>
            )}
          </div>

          {/* Column 2: Pacman Game widget */}
          {isDesktop && gameOpen && (
            <div style={{ width: "100%", maxWidth: 440, marginLeft: "auto" }}>
              <PacmanGame onClose={() => setGameOpen(false)} />
            </div>
          )}
        </div>

        {/* Easter Egg Trigger */}
        {isDesktop && (
          <div
            style={{
              position: "absolute",
              top: -40,
              right: 24,
              display: "flex",
              alignItems: "center",
              gap: 8,
              zIndex: 10,
            }}
          >
            <AnimatePresence>
              {triggerHovered && (
                <motion.span
                  initial={{ opacity: 0, x: 4 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 4 }}
                  transition={{ duration: 0.15 }}
                  className="font-mono"
                  style={{
                    fontSize: 11,
                    color: "var(--muted)",
                    userSelect: "none",
                  }}
                >
                  game mode
                </motion.span>
              )}
            </AnimatePresence>

            <button
              onClick={() => setGameOpen(!gameOpen)}
              onMouseEnter={() => setTriggerHovered(true)}
              onMouseLeave={() => setTriggerHovered(false)}
              style={{
                background: "none",
                border: "none",
                color: gameOpen ? "var(--accent)" : "var(--text)",
                opacity: triggerHovered || gameOpen ? 1 : 0.25,
                transform:
                  triggerHovered || gameOpen ? "scale(1)" : "scale(0.9)",
                transition: "opacity 0.15s, transform 0.15s, color 0.15s",
                padding: 4,
                cursor: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              aria-label="Toggle game mode"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="currentColor"
              >
                <path d="M8 1a6 6 0 0 0-6 6v7.5a.5.5 0 0 0 .8.4L5 13.5l2.2 1.4a.5.5 0 0 0 .6 0l2.2-1.4 2.2 1.4a.5.5 0 0 0 .8-.4V7a6 6 0 0 0-6-6zM5.5 6a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
