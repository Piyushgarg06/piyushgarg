import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Projects from "./components/Projects";
import AllProjects from "./components/AllProjects";
import Experience from "./components/Experience";
import Contact from "./components/Contact";
import CommandPalette from "./components/CommandPalette";
import CustomCursor from "./components/CustomCursor";
import { useCommandPalette } from "./hooks/useCommandPalette";
import { data } from "./constants/data";

export default function App() {
  const palette = useCommandPalette();
  const [currentHash, setCurrentHash] = useState(window.location.hash);

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash);
      if (window.location.hash === "#all-projects" || !window.location.hash) {
        window.scrollTo(0, 0);
      }
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const isAllProjects = currentHash === "#all-projects";

  useEffect(() => {
    if (
      !isAllProjects &&
      currentHash &&
      currentHash.startsWith("#") &&
      currentHash !== "#all-projects"
    ) {
      const id = currentHash.slice(1);
      const timer = setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 80);
      return () => clearTimeout(timer);
    }
  }, [isAllProjects, currentHash]);

  return (
    <>
      <CustomCursor />
      <Navbar />

      <main style={{ minHeight: "100vh" }}>
        <AnimatePresence mode="wait">
          {isAllProjects ? (
            <motion.div
              key="all-projects-page"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
            >
              <AllProjects />
            </motion.div>
          ) : (
            <motion.div
              key="home-page"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
            >
              <Hero />
              <About />
              <Experience />
              <Projects />
              <Contact />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer — minimal, static */}
      <footer
        style={{
          padding: "36px 0",
          borderTop: "1px solid var(--border)",
        }}
      >
        <div
          className="container"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <span
            className="font-mono"
            style={{ fontSize: 11, color: "var(--muted)", letterSpacing: "0.04em" }}
          >
            © {new Date().getFullYear()} Piyush Garg
          </span>

          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            {/* Social links */}
            <a
              href={data.contact.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub profile"
              className="font-mono"
              style={{
                fontSize: 11,
                color: "var(--muted)",
                letterSpacing: "0.04em",
                transition: "color 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted)")}
            >
              GitHub
            </a>
            <a
              href={data.contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn profile"
              className="font-mono"
              style={{
                fontSize: 11,
                color: "var(--muted)",
                letterSpacing: "0.04em",
                transition: "color 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted)")}
            >
              LinkedIn
            </a>

            {/* Command palette hint */}
            <span
              className="font-mono"
              style={{ fontSize: 11, color: "var(--muted)", letterSpacing: "0.04em" }}
            >
              Press{" "}
              <kbd
                style={{
                  border: "1px solid var(--border)",
                  borderRadius: 2,
                  padding: "1px 5px",
                  fontSize: 10,
                  fontFamily: "JetBrains Mono, monospace",
                }}
              >
                /
              </kbd>{" "}
              to navigate
            </span>
          </div>
        </div>
      </footer>

      <CommandPalette {...palette} />
    </>
  );
}
