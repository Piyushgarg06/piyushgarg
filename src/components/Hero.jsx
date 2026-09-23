import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { data, springs } from "../constants/data";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import PacmanGame from "./PacmanGame";

export default function Hero() {
  const prefersReduced = usePrefersReducedMotion();
  const [gameOpen, setGameOpen] = useState(false);
  const [hovered, setHovered] = useState(false);

  const fadeUp = (delay = 0) =>
    prefersReduced
      ? {}
      : {
          initial: { opacity: 0, y: 28 },
          animate: { opacity: 1, y: 0 },
          transition: { ...springs.snappy, delay },
        };

  return (
    <section
      aria-label="Introduction"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative background grid and gradient */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        <motion.div
          className="hero-grid"
          initial={prefersReduced ? {} : { opacity: 0 }}
          animate={prefersReduced ? {} : { opacity: 0.25 }}
          transition={{ duration: 2.5, delay: 0.5 }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 240,
            background: "linear-gradient(to top, var(--bg), transparent)",
          }}
        />
      </div>

      <div
        className="container"
        style={{ position: "relative", zIndex: 2, width: "100%" }}
      >
        {/* ── Top row: Role chip on left, Game mode button on the right ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 28,
            width: "100%",
          }}
        >
          {/* Role chip */}
          <motion.div
            {...(prefersReduced
              ? {}
              : {
                  initial: { opacity: 0, y: 12 },
                  animate: { opacity: 1, y: 0 },
                  transition: { ...springs.snappy, delay: 0.05 },
                })}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span
              aria-hidden="true"
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "var(--accent)",
                display: "inline-block",
                animation: "pulse-dot 2.4s ease-in-out infinite",
              }}
            />
            <span
              className="font-mono"
              style={{
                fontSize: "var(--t-xs)",
                color: "var(--muted)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              {data.role}
            </span>
          </motion.div>

          {/* Game mode button on the right side */}
          <motion.div
            {...(prefersReduced
              ? {}
              : {
                  initial: { opacity: 0, y: 12 },
                  animate: { opacity: 1, y: 0 },
                  transition: { ...springs.snappy, delay: 0.1 },
                })}
          >
            <button
              onClick={() => setGameOpen(!gameOpen)}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              aria-label="Toggle game mode"
              aria-pressed={gameOpen}
              style={{
                background: "none",
                border: "none",
                padding: "4px 0",
                color: hovered || gameOpen ? "var(--accent)" : "var(--text-2)",
                opacity: hovered || gameOpen ? 1 : 0.75,
                transition: "color 0.18s ease, opacity 0.18s ease",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M8 1a6 6 0 0 0-6 6v7.5a.5.5 0 0 0 .8.4L5 13.5l2.2 1.4a.5.5 0 0 0 .6 0l2.2-1.4 2.2 1.4a.5.5 0 0 0 .8-.4V7a6 6 0 0 0-6-6zM5.5 6a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
              </svg>
              {(hovered || gameOpen) && (
                <span
                  className="font-mono"
                  style={{
                    fontSize: 11,
                    letterSpacing: "0.06em",
                    color: hovered || gameOpen ? "var(--accent)" : "var(--muted)",
                  }}
                >
                  {gameOpen ? "close game" : "game mode"}
                </span>
              )}
            </button>
          </motion.div>
        </div>

        {/* ── Main content row: Name on left, Game window on right ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 48,
            width: "100%",
            flexWrap: "wrap",
          }}
        >
          {/* Left Column: Name, Subtitle, CTA */}
          <div
            style={{
              flex: "1 1 520px",
              maxWidth: 580,
              minWidth: 300,
            }}
          >
            {/* Name */}
            <h1
              className="font-display"
              style={{ margin: 0, padding: 0 }}
            >
              <motion.span
                {...fadeUp(0.1)}
                style={{
                  display: "block",
                  fontSize: "clamp(52px, 10vw, 120px)",
                  fontWeight: 900,
                  lineHeight: 0.92,
                  color: "var(--text)",
                  letterSpacing: "-0.03em",
                }}
              >
                {data.name.line1}
              </motion.span>
              <motion.span
                {...fadeUp(0.17)}
                style={{
                  display: "block",
                  fontSize: "clamp(52px, 10vw, 120px)",
                  fontWeight: 900,
                  lineHeight: 0.92,
                  color: "var(--text)",
                  letterSpacing: "-0.03em",
                  marginBottom: 40,
                }}
              >
                {data.name.line2}
              </motion.span>
            </h1>

            {/* Subtitle */}
            <motion.p
              {...fadeUp(0.3)}
              style={{
                fontSize: "clamp(15px, 1.5vw, 17px)",
                color: "var(--text-2)",
                maxWidth: 520,
                lineHeight: 1.7,
                marginBottom: 38,
                fontWeight: 300,
              }}
            >
              {data.subtitle}
            </motion.p>

            {/* CTA row */}
            <motion.div
              {...(prefersReduced
                ? {}
                : {
                    initial: { opacity: 0 },
                    animate: { opacity: 1 },
                    transition: { duration: 0.4, delay: 0.44 },
                  })}
              style={{
                display: "flex",
                gap: 28,
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <a
                href="#projects"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "9px 20px",
                  border: "1px solid var(--border)",
                  borderRadius: 2,
                  fontSize: 13,
                  fontFamily: "JetBrains Mono, monospace",
                  color: "var(--text)",
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  transition: "border-color 0.2s, color 0.2s, background 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--accent)";
                  e.currentTarget.style.color = "var(--accent)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--border)";
                  e.currentTarget.style.color = "var(--text)";
                }}
              >
                See my work
                <span aria-hidden="true" style={{ fontSize: 16 }}>↓</span>
              </a>

              <a
                href="#contact"
                className="hero-link"
                style={{ color: "var(--muted)", fontSize: 13 }}
              >
                Get in touch
              </a>
            </motion.div>
          </div>

          {/* Right Column: Empty space beside name, houses Pac-Man Game when open */}
          <div
            style={{
              flex: gameOpen ? "0 1 450px" : "0 0 auto",
              width: gameOpen ? "100%" : "auto",
              maxWidth: 450,
              marginLeft: "auto",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              justifyContent: "center",
            }}
          >
            <AnimatePresence mode="wait">
              {gameOpen && (
                <motion.div
                  key="active-game-widget"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={springs.snappy}
                  style={{ width: "100%" }}
                >
                  <PacmanGame onClose={() => setGameOpen(false)} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Pulse dot animation */}
      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.4; transform: scale(0.7); }
        }
      `}</style>
    </section>
  );
}
