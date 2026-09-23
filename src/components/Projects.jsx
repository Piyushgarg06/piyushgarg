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
      aria-label={`${project.name} — view on GitHub`}
      variants={
        prefersReduced
          ? {}
          : {
              hidden: { opacity: 0, x: -12 },
              visible: {
                opacity: 1,
                x: 0,
                transition: { ...springs.snappy, delay: index * 0.07 },
              },
            }
      }
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "grid",
        gridTemplateColumns: "40px 1fr auto",
        alignItems: "start",
        gap: "0 24px",
        padding: "32px 16px 32px 20px",
        textDecoration: "none",
        color: "inherit",
        borderBottom: "1px solid var(--border)",
        position: "relative",
        background: hovered ? "var(--surface)" : "transparent",
        transition: "background 0.18s",
        overflow: "hidden",
      }}
    >
      {/* Accent left border on hover */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 2,
          background: "var(--accent)",
          transformOrigin: "top",
          transform: `scaleY(${hovered ? 1 : 0})`,
          transition: "transform 0.22s ease-out",
        }}
      />

      {/* Number — tabular figures */}
      <span
        className="font-mono"
        style={{
          fontSize: 11,
          color: hovered ? "var(--accent)" : "var(--muted)",
          transition: "color 0.18s",
          letterSpacing: "0.06em",
          paddingTop: 4,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {project.number}
      </span>

      {/* Main content column */}
      <div>
        {/* Project name */}
        <h3
          className="font-display"
          style={{
            fontSize: "clamp(20px, 2.2vw, 28px)",
            fontWeight: 700,
            color: "var(--text)",
            marginBottom: 8,
            lineHeight: 1.15,
            letterSpacing: "-0.01em",
          }}
        >
          {project.name}
        </h3>

        {/* Problem statement — what's the challenge */}
        {project.problem && (
          <p
            style={{
              fontSize: 13,
              color: "var(--muted)",
              lineHeight: 1.6,
              marginBottom: 6,
              fontStyle: "italic",
            }}
          >
            {project.problem}
          </p>
        )}

        {/* Description — the approach */}
        <p
          style={{
            fontSize: 14,
            color: "var(--text-2)",
            lineHeight: 1.65,
            marginBottom: 14,
            fontWeight: 300,
          }}
        >
          {project.description}
        </p>

        {/* Tag pills */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="tag-pill"
              style={{
                color: hovered ? "var(--text-2)" : "var(--muted)",
                borderColor: hovered ? "var(--muted)" : "var(--border)",
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* GitHub arrow — right column, animated */}
      <div
        className="desktop-only"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: 6,
          paddingTop: 4,
          opacity: hovered ? 1 : 0,
          transform: hovered ? "translateX(0)" : "translateX(8px)",
          transition: "opacity 0.18s, transform 0.18s",
        }}
        aria-hidden="true"
      >
        <span
          style={{
            fontSize: 18,
            color: "var(--accent)",
            lineHeight: 1,
          }}
        >
          ↗
        </span>
        <span
          className="font-mono"
          style={{
            fontSize: 10,
            color: "var(--muted)",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
          }}
        >
          GitHub
        </span>
      </div>
    </motion.a>
  );
}

export default function Projects() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const prefersReduced = usePrefersReducedMotion();

  return (
    <section id="projects" style={{ padding: "96px 0" }}>
      <div className="container">
        {/* Section label */}
        <p className="section-label">Selected Work</p>

        {/* Project rows */}
        <motion.div
          ref={ref}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          style={{ borderTop: "1px solid var(--border)" }}
          role="list"
          aria-label="Selected projects"
        >
          {data.projects.map((project, i) => (
            <div key={project.number} role="listitem">
              <ProjectRow project={project} index={i} />
            </div>
          ))}
        </motion.div>

        {/* View all link */}
        <div style={{ marginTop: 36, display: "flex", alignItems: "center", gap: 16 }}>
          <a
            href="#all-projects"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              fontSize: 12,
              fontFamily: "JetBrains Mono, monospace",
              color: "var(--muted)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              transition: "color 0.15s",
              paddingBottom: 1,
              borderBottom: "1px solid transparent",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "var(--text)";
              e.currentTarget.style.borderBottomColor = "var(--border)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--muted)";
              e.currentTarget.style.borderBottomColor = "transparent";
            }}
          >
            View all repositories →
          </a>
        </div>
      </div>
    </section>
  );
}
