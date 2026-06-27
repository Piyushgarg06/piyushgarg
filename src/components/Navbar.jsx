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
    { label: "About", href: "#about" },
    { label: "Projects", href: "#projects" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <>
      <motion.nav
        initial={prefersReduced ? {} : { opacity: 0 }}
        animate={prefersReduced ? {} : { opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.9 }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          borderBottom: `1px solid ${scrolled ? "var(--border)" : "transparent"}`,
          transition: "border-color 0.2s, background 0.2s",
          background: scrolled ? "rgba(8, 8, 8, 0.92)" : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(12px)" : "none",
        }}
      >
        <div
          className="container"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: 64,
          }}
        >
          {/* Name */}
          <a
            href="#"
            className="font-display"
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: "var(--text)",
              letterSpacing: "0.02em",
            }}
          >
            {data.name.line1} {data.name.line2}
          </a>

          {/* Desktop links */}
          <div
            className="desktop-only"
            style={{ display: "flex", gap: 32, alignItems: "center" }}
          >
            {links.map((link) => (
              <a key={link.label} href={link.href} className="nav-link">
                {link.label}
              </a>
            ))}
            <span className="nav-kbd font-mono">/</span>
          </div>

          {/* Mobile hamburger */}
          <button
            className="mobile-only"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
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
                transition: "transform 0.2s, opacity 0.2s",
                transform: menuOpen
                  ? "rotate(45deg) translateY(3px)"
                  : "none",
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
                transition: "transform 0.2s, opacity 0.2s",
                transform: menuOpen
                  ? "rotate(-45deg) translateY(-3px)"
                  : "none",
              }}
            />
          </button>
        </div>
      </motion.nav>

      {/* Mobile overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 99,
              background: "var(--bg)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 40,
            }}
          >
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="font-display"
                style={{
                  fontSize: 32,
                  fontWeight: 700,
                  color: "var(--text)",
                }}
              >
                {link.label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
