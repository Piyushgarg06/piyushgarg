import { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { springs } from "../constants/data";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

export default function CommandPalette({
  isOpen,
  query,
  setQuery,
  selectedIndex,
  setSelectedIndex,
  filtered,
  close,
  jumpTo,
  onKeyDown,
}) {
  const inputRef = useRef(null);
  const prefersReduced = usePrefersReducedMotion();

  /* Focus input when opening */
  useEffect(() => {
    if (isOpen && inputRef.current) {
      /* Small delay so the AnimatePresence mount happens first */
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [isOpen]);

  /* Panel variants */
  const panelVariants = prefersReduced
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.15 } },
        exit: { opacity: 0, transition: { duration: 0.15 } },
      }
    : {
        hidden: { opacity: 0, y: -12, scale: 0.97 },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: springs.snappy,
        },
        exit: {
          opacity: 0,
          y: -8,
          scale: 0.97,
          transition: { ...springs.precise, duration: 0.15 },
        },
      };

  /* Item variants for stagger */
  const itemVariants = prefersReduced
    ? {}
    : {
        hidden: { opacity: 0, y: 8 },
        visible: (i) => ({
          opacity: 1,
          y: 0,
          transition: { ...springs.snappy, delay: i * 0.03 },
        }),
      };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            key="cmd-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={close}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 200,
              background: "rgba(8, 8, 8, 0.85)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
            }}
          />

          {/* Panel */}
          <motion.div
            key="cmd-panel"
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{
              position: "fixed",
              top: "20%",
              left: "50%",
              transform: "translateX(-50%)",
              width: "min(560px, 90vw)",
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 4,
              zIndex: 201,
              overflow: "hidden",
            }}
          >
            {/* Input */}
            <motion.div
              initial={prefersReduced ? {} : { opacity: 0 }}
              animate={prefersReduced ? {} : { opacity: 1 }}
              transition={{ duration: 0.15, delay: 0.05 }}
            >
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Jump to..."
                style={{
                  width: "100%",
                  height: 48,
                  padding: "0 16px",
                  fontSize: 16,
                  fontFamily: "Inter, sans-serif",
                  color: "var(--text)",
                  background: "transparent",
                  border: "none",
                  borderBottom: "1px solid var(--border)",
                  outline: "none",
                }}
              />
            </motion.div>

            {/* Results */}
            <div style={{ padding: "4px 0" }}>
              {filtered.map((item, i) => (
                <motion.div
                  key={item.id}
                  custom={i}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  onClick={() => jumpTo(item.id)}
                  onMouseEnter={() => setSelectedIndex(i)}
                  style={{
                    height: 44,
                    display: "flex",
                    alignItems: "center",
                    padding: "0 16px",
                    fontSize: 14,
                    fontFamily: "Inter, sans-serif",
                    color:
                      selectedIndex === i ? "var(--text)" : "var(--muted)",
                    background:
                      selectedIndex === i ? "var(--border)" : "transparent",
                    borderLeft:
                      selectedIndex === i
                        ? "2px solid var(--accent)"
                        : "2px solid transparent",
                    cursor: "none",
                    transition: "background 0.1s, color 0.1s",
                  }}
                >
                  {item.label}
                </motion.div>
              ))}

              {filtered.length === 0 && (
                <div
                  style={{
                    height: 44,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 14,
                    color: "var(--muted)",
                  }}
                >
                  No results
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
