import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { springs } from "../constants/data";
import { useGitHubRepos } from "../hooks/useGitHubRepos";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import AnimatedSection from "./AnimatedSection";

/* ─── Language color map (matches GitHub) ────── */
const LANG_COLORS = {
  Python: "#3572A5",
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  Jupyter: "#DA5B0B",
  "Jupyter Notebook": "#DA5B0B",
  HTML: "#e34c26",
  CSS: "#563d7c",
  C: "#555555",
  "C++": "#f34b7d",
  Java: "#b07219",
  Go: "#00ADD8",
  Rust: "#dea584",
  Shell: "#89e051",
  Ruby: "#701516",
  Dart: "#00B4AB",
  Kotlin: "#A97BFF",
  Swift: "#F05138",
};

function getLangColor(lang) {
  return LANG_COLORS[lang] || "var(--muted)";
}

/* ─── Relative time formatter ────────────────── */
function timeAgo(dateStr) {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = Math.floor((now - then) / 1000);

  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`;
  if (diff < 31536000) return `${Math.floor(diff / 2592000)}mo ago`;
  return `${Math.floor(diff / 31536000)}y ago`;
}

/* ─── Single repo card ───────────────────────── */
function RepoCard({ repo, index }) {
  const [hovered, setHovered] = useState(false);
  const prefersReduced = usePrefersReducedMotion();

  return (
    <motion.a
      href={repo.html_url}
      target="_blank"
      rel="noopener noreferrer"
      variants={
        prefersReduced
          ? {}
          : {
              hidden: { opacity: 0, y: 16 },
              visible: {
                opacity: 1,
                y: 0,
                transition: springs.snappy,
              },
            }
      }
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "block",
        padding: "20px 24px",
        border: "1px solid var(--border)",
        borderRadius: 4,
        background: hovered ? "var(--surface)" : "transparent",
        transition: "background 0.15s, border-color 0.15s",
        borderColor: hovered ? "var(--muted)" : "var(--border)",
        textDecoration: "none",
        color: "inherit",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Top row: name + arrow */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 8,
          gap: 12,
        }}
      >
        <h3
          className="font-display"
          style={{
            fontSize: 16,
            fontWeight: 700,
            color: "var(--text)",
            lineHeight: 1.3,
            wordBreak: "break-word",
          }}
        >
          {repo.name}
        </h3>
        <span
          style={{
            fontSize: 14,
            color: "var(--muted)",
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.15s",
            flexShrink: 0,
          }}
        >
          ↗
        </span>
      </div>

      {/* Description */}
      {repo.description && (
        <p
          style={{
            fontSize: 13,
            color: "var(--muted)",
            lineHeight: 1.5,
            marginBottom: 16,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {repo.description}
        </p>
      )}

      {/* Bottom row: language + stats */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        {/* Language dot + name */}
        {repo.language && (
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 12,
              color: "var(--muted)",
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: getLangColor(repo.language),
                flexShrink: 0,
              }}
            />
            {repo.language}
          </span>
        )}

        {/* Stars */}
        {repo.stargazers_count > 0 && (
          <span
            className="font-mono"
            style={{ fontSize: 11, color: "var(--muted)" }}
          >
            ★ {repo.stargazers_count}
          </span>
        )}

        {/* Forks */}
        {repo.forks_count > 0 && (
          <span
            className="font-mono"
            style={{ fontSize: 11, color: "var(--muted)" }}
          >
            ⑂ {repo.forks_count}
          </span>
        )}

        {/* Last updated */}
        <span
          className="font-mono"
          style={{
            fontSize: 11,
            color: "var(--muted)",
            marginLeft: "auto",
          }}
        >
          {timeAgo(repo.pushed_at)}
        </span>
      </div>
    </motion.a>
  );
}

/* ─── Loading skeleton ───────────────────────── */
function SkeletonCard() {
  return (
    <div
      style={{
        padding: "20px 24px",
        border: "1px solid var(--border)",
        borderRadius: 4,
      }}
    >
      <div
        style={{
          height: 16,
          width: "60%",
          background: "var(--border)",
          borderRadius: 2,
          marginBottom: 12,
          animation: "pulse 1.5s ease-in-out infinite",
        }}
      />
      <div
        style={{
          height: 12,
          width: "90%",
          background: "var(--border)",
          borderRadius: 2,
          marginBottom: 8,
          animation: "pulse 1.5s ease-in-out infinite",
          animationDelay: "0.1s",
        }}
      />
      <div
        style={{
          height: 12,
          width: "40%",
          background: "var(--border)",
          borderRadius: 2,
          animation: "pulse 1.5s ease-in-out infinite",
          animationDelay: "0.2s",
        }}
      />
    </div>
  );
}

/* ─── Main component ─────────────────────────── */
export default function AllProjects() {
  const {
    repos,
    allRepos,
    languages,
    activeLanguage,
    setActiveLanguage,
    loading,
    error,
  } = useGitHubRepos();

  const prefersReduced = usePrefersReducedMotion();

  return (
    <section id="all-projects" style={{ padding: "120px 0" }}>
      <div className="container">
        <AnimatedSection>
          {/* Back to home */}
          <div style={{ marginBottom: 32 }}>
            <a
              href="#"
              className="hero-link font-mono"
              style={{ fontSize: 12, color: "var(--muted)" }}
            >
              ← Back to home
            </a>
          </div>

          {/* Header row */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              marginBottom: 12,
              flexWrap: "wrap",
              gap: 8,
            }}
          >
            <p
              className="font-display"
              style={{
                fontSize: 13,
                color: "var(--muted)",
                textTransform: "uppercase",
                letterSpacing: "0.12em",
              }}
            >
              All Projects
            </p>
            <span
              className="font-mono"
              style={{ fontSize: 11, color: "var(--muted)" }}
            >
              {loading
                ? "Loading..."
                : `${allRepos.length} repositories · ${languages.length - 1} languages`}
            </span>
          </div>

          {/* Language filter pills */}
          {!loading && !error && (
            <div
              style={{
                display: "flex",
                gap: 6,
                flexWrap: "wrap",
                marginBottom: 40,
                paddingBottom: 24,
                borderBottom: "1px solid var(--border)",
              }}
            >
              {languages.map((lang) => {
                const isActive = lang === activeLanguage;
                const count =
                  lang === "All"
                    ? allRepos.length
                    : allRepos.filter((r) => r.language === lang).length;

                return (
                  <button
                    key={lang}
                    onClick={() => setActiveLanguage(lang)}
                    style={{
                      padding: "6px 14px",
                      fontSize: 12,
                      fontFamily: "'Inter', sans-serif",
                      color: isActive ? "var(--bg)" : "var(--muted)",
                      background: isActive ? "var(--text)" : "transparent",
                      border: `1px solid ${isActive ? "var(--text)" : "var(--border)"}`,
                      borderRadius: 3,
                      cursor: "none",
                      transition: "all 0.15s",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    {lang !== "All" && (
                      <span
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          background: getLangColor(lang),
                          flexShrink: 0,
                        }}
                      />
                    )}
                    {lang}
                    <span
                      style={{
                        fontSize: 10,
                        opacity: 0.6,
                      }}
                      className="font-mono"
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Error state */}
          {error && (
            <div
              style={{
                padding: "40px 0",
                textAlign: "center",
                color: "var(--muted)",
                fontSize: 14,
              }}
            >
              <p style={{ marginBottom: 8 }}>Failed to load repositories</p>
              <p className="font-mono" style={{ fontSize: 12 }}>
                {error}
              </p>
            </div>
          )}

          {/* Loading state */}
          {loading && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                gap: 12,
              }}
            >
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          )}

          {/* Repo grid */}
          {!loading && !error && (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={
                prefersReduced
                  ? {}
                  : {
                      hidden: { opacity: 0 },
                      visible: {
                        opacity: 1,
                        transition: {
                          staggerChildren: 0.03,
                        },
                      },
                    }
              }
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                gap: 12,
              }}
            >
              {repos.map((repo, i) => (
                <RepoCard key={repo.id} repo={repo} index={i} />
              ))}

              {repos.length === 0 && (
                <p style={{ fontSize: 14, color: "var(--muted)", padding: 24 }}>
                  No repositories found for this language.
                </p>
              )}
            </motion.div>
          )}
        </AnimatedSection>
      </div>

      {/* Skeleton pulse animation */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
      `}</style>
    </section>
  );
}
