import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { springs } from "../constants/data";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

export default function AnimatedSection({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const prefersReduced = usePrefersReducedMotion();

  const variants = {
    hidden: prefersReduced ? {} : { opacity: 0, y: 24 },
    visible: prefersReduced
      ? {}
      : {
          opacity: 1,
          y: 0,
          transition: { ...springs.gentle, delay },
        },
  };

  return (
    <motion.div
      ref={ref}
      variants={variants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className={className}
    >
      {children}
    </motion.div>
  );
}
