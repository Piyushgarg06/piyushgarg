import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { data } from "../constants/data";
import { useScrolled } from "../hooks/useScrolled";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

export default function Navbar() {
  const scrolled = useScrolled(80);
  const prefersReduced = usePrefersReducedMotion();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { label: "About",    href: "#about"    },
    { label: "Projects", href: "#projects" },
    { label: "Contact",  href: "#contact"  },
  ];

  return (
    <>
      <motion.nav
        initial={prefersReduced ? {} : { opacity: 0 }}
        animate={prefersReduced ? {} : { opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.9 }}
        aria-label="Primary navigation"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          borderBottom: `1px solid ${scrolled ? "var(--border)" : "transparent"}`,
          transition: "border-color 0.25s, background 0.25s",
          background: scrolled ? "rgba(8, 8, 8, 0.94)" : "transparent",
          backdropFilter: scrolled ? "blur(16px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(16px)" : "none",
        }}
      >
        <div
          className="container"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: 56,
          }}
        >
          {/* Name / home link */}
          <a
            href="#"
            className="font-display"
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: "var(--text)",
              letterSpacing: "0.03em",
              textTransform: "uppercase",
            }}
            aria-label="Piyush Garg — home"
          >
            {data.name.line1} {data.name.line2}
          </a>

          {/* Desktop links */}
          <div
            className="desktop-only"
            style={{ display: "flex", gap: 24, alignItems: "center" }}
          >
            {links.map((link) => (
              <a key={link.label} href={link.href} className="nav-link">
                {link.label}
              </a>
            ))}

            <a
              href="/piyushGarg.pdf"
              download="Piyush_Garg_Resume.pdf"
              className="nav-resume-btn"
              aria-label="Download resume PDF"
            >
              <svg
                width="11"
                height="11"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Resume
            </a>

            <kbd className="nav-kbd" title="Press / to open command palette" aria-label="Press slash to open command palette">/</kbd>
          </div>

          {/* Mobile hamburger */}
          <button
            className="mobile-only"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            style={{
              background: "none",
              border: "none",
              padding: 8,
              display: "flex",
              flexDirection: "column",
              gap: 5,
              cursor: "none",
            }}
          >
            <span
              style={{
                width: 20,
                height: 1,
                background: "var(--text)",
                display: "block",
                transition: "transform 0.2s",
                transform: menuOpen ? "rotate(45deg) translateY(3px)" : "none",
              }}
            />
            <span
              style={{
                width: 20,
                height: 1,
                background: "var(--text)",
                display: "block",
                transition: "opacity 0.2s",
                opacity: menuOpen ? 0 : 1,
              }}
            />
            <span
              style={{
                width: 20,
                height: 1,
                background: "var(--text)",
                display: "block",
                transition: "transform 0.2s",
                transform: menuOpen ? "rotate(-45deg) translateY(-3px)" : "none",
              }}
            />
          </button>
        </div>
      </motion.nav>

      {/* Mobile full-screen overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            key="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 99,
              background: "var(--bg)",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "center",
              padding: "0 32px",
              gap: 0,
            }}
          >
            {links.map((link, i) => (
              <motion.a
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="font-display"
                initial={prefersReduced ? {} : { opacity: 0, x: -16 }}
                animate={prefersReduced ? {} : { opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 + 0.04, duration: 0.22 }}
                style={{
                  fontSize: "clamp(36px, 8vw, 56px)",
                  fontWeight: 900,
                  color: "var(--text)",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.15,
                  paddingBottom: 4,
                  borderBottom: "1px solid var(--border)",
                  marginBottom: 20,
                  width: "100%",
                  display: "block",
                }}
              >
                {link.label}
              </motion.a>
            ))}

            <motion.a
              href="/piyushGarg.pdf"
              download="Piyush_Garg_Resume.pdf"
              onClick={() => setMenuOpen(false)}
              initial={prefersReduced ? {} : { opacity: 0, x: -16 }}
              animate={prefersReduced ? {} : { opacity: 1, x: 0 }}
              transition={{ delay: links.length * 0.06 + 0.04, duration: 0.22 }}
              className="font-mono"
              style={{
                marginTop: 8,
                fontSize: 13,
                color: "var(--accent)",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Download Resume
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
