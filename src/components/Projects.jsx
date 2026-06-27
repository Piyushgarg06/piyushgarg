import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { data, springs } from "../constants/data";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

function ProjectRow({ project, index }) {
  const [hovered, setHovered] = useState(false);
  const prefersReduced = usePrefersReducedMotion();

  return (
    <motion.a
      href={project.github}
      target="_blank"
      rel="noopener noreferrer"
      variants={
        prefersReduced
          ? {}
          : {
              hidden: { opacity: 0, x: -16 },
              visible: {
                opacity: 1,
                x: 0,
                transition: { ...springs.snappy, delay: index * 0.06 },
              },
            }
      }
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "grid",
        gridTemplateColumns: "48px 1fr auto",
        alignItems: "center",
        gap: 24,
        padding: "28px 20px",
        textDecoration: "none",
        color: "inherit",
        borderBottom: "1px solid var(--border)",
        position: "relative",
        background: hovered ? "var(--surface)" : "transparent",
        transition: "background 0.15s",
        overflow: "hidden",
      }}
      className="project-row"
    >
      {/* Accent left border on hover */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 3,
          background: "var(--accent)",
          transformOrigin: "left",
          transform: `scaleX(${hovered ? 1 : 0})`,
          transition: "transform 0.2s ease-out",
        }}
      />

      {/* Number */}
      <span
        className="font-mono"
        style={{
          fontSize: 13,
          color: hovered ? "var(--text)" : "var(--muted)",
          transition: "color 0.15s",
        }}
      >
        {project.number}
      </span>

      {/* Name + description + tags */}
      <div>
        <h3
          className="font-display"
          style={{
            fontSize: 24,
            fontWeight: 700,
            color: "var(--text)",
            marginBottom: 6,
            lineHeight: 1.2,
          }}
        >
          {project.name}
        </h3>
        <p
          style={{
            fontSize: 14,
            color: "var(--muted)",
            marginBottom: 10,
            lineHeight: 1.5,
          }}
        >
          {project.description}
        </p>
        <span
          className="font-mono"
          style={{
            fontSize: 12,
            color: hovered ? "var(--text)" : "var(--muted)",
            transition: "color 0.15s",
            opacity: 0.7,
          }}
        >
          {project.tags.join(" · ")}
        </span>
      </div>

      {/* GitHub link — visible on hover */}
      <span
        className="desktop-only"
        style={{
          fontSize: 13,
          color: "var(--muted)",
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.15s",
          whiteSpace: "nowrap",
        }}
      >
        View on GitHub →
      </span>
    </motion.a>
  );
}

export default function Projects() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const prefersReduced = usePrefersReducedMotion();

  return (
    <section id="projects" style={{ padding: "120px 0" }}>
      <div className="container">
        {/* Section heading */}
        <p
          className="font-display"
          style={{
            fontSize: 13,
            color: "var(--muted)",
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            marginBottom: 48,
          }}
        >
          Selected work
        </p>

        {/* Project rows */}
        <motion.div
          ref={ref}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          style={{ borderTop: "1px solid var(--border)" }}
        >
          {data.projects.map((project, i) => (
            <ProjectRow key={project.number} project={project} index={i} />
          ))}
        </motion.div>

        {/* View all projects link */}
        <div style={{ marginTop: 40 }}>
          <a
            href="#all-projects"
            className="hero-link font-mono"
            style={{ fontSize: 13, color: "var(--text)" }}
          >
            View all projects →
          </a>
        </div>
      </div>
    </section>
  );
}
