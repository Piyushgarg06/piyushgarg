import { useEffect, useState, useRef, useCallback } from "react";
import { motion, useSpring } from "framer-motion";
import { springs } from "../constants/data";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

export default function CustomCursor() {
  const [isTouch, setIsTouch] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const prefersReduced = usePrefersReducedMotion();
  const cursorRef = useRef(null);

  /* Detect touch device — don't render at all */
  useEffect(() => {
    const checkTouch = () => {
      return (
        window.matchMedia("(pointer: coarse)").matches ||
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0
      );
    };
    setIsTouch(checkTouch());
  }, []);

  /* Spring-driven cursor position */
  const cursorX = useSpring(0, { stiffness: 500, damping: 35 });
  const cursorY = useSpring(0, { stiffness: 500, damping: 35 });

  const onMouseMove = useCallback(
    (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    },
    [cursorX, cursorY]
  );

  /* Check if target is interactive */
  const isInteractive = useCallback((el) => {
    if (!el) return false;
    return !!el.closest('a, button, [role="button"], input, textarea, select, label');
  }, []);

  const onMouseOver = useCallback(
    (e) => {
      setHovered(isInteractive(e.target));
    },
    [isInteractive]
  );

  const onMouseDown = useCallback(() => setClicked(true), []);
  const onMouseUp = useCallback(() => setClicked(false), []);

  useEffect(() => {
    if (isTouch) return;
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mouseover", onMouseOver, { passive: true });
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseover", onMouseOver);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [isTouch, onMouseMove, onMouseOver, onMouseDown, onMouseUp]);

  if (isTouch) return null;

  /* Determine visual size & style */
  const size = hovered ? 24 : 6;
  const scaleValue = clicked ? 0.6 : 1;

  return (
    <motion.div
      ref={cursorRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        x: cursorX,
        y: cursorY,
        translateX: "-50%",
        translateY: "-50%",
        pointerEvents: "none",
        zIndex: 9999,
        willChange: "transform",
      }}
    >
      <motion.div
        animate={
          prefersReduced
            ? {}
            : {
                width: size,
                height: size,
                scale: scaleValue,
                backgroundColor: hovered
                  ? "rgba(200, 251, 74, 0)"
                  : "rgba(200, 251, 74, 1)",
                borderWidth: hovered ? 1 : 0,
              }
        }
        transition={clicked ? springs.precise : springs.snappy}
        style={{
          borderRadius: "50%",
          borderStyle: "solid",
          borderColor: "var(--accent)",
          width: 6,
          height: 6,
          backgroundColor: "rgba(200, 251, 74, 1)",
          borderWidth: 0,
          pointerEvents: "none",
        }}
      />
    </motion.div>
  );
}
