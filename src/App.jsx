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

  // Ensure scroll works when hash changes back to a home section
  useEffect(() => {
    if (!isAllProjects && currentHash && currentHash.startsWith("#") && currentHash !== "#all-projects") {
      const id = currentHash.slice(1);
      const timer = setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
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
              transition={{ duration: 0.25 }}
            >
              <AllProjects />
            </motion.div>
          ) : (
            <motion.div
              key="home-page"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <Hero />

              <div className="section-divider" />
              <About />

              <div className="section-divider" />
              <Projects />

              <div className="section-divider" />
              <Experience />

              <div className="section-divider" />
              <Contact />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer — minimal, static */}
      <footer
        style={{
          padding: "40px 0",
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
            gap: 16,
          }}
        >
          <span
            style={{ fontSize: 12, color: "var(--muted)" }}
            className="font-mono"
          >
            © {new Date().getFullYear()} Piyush Garg
          </span>
          <span
            style={{ fontSize: 12, color: "var(--muted)" }}
            className="font-mono"
          >
            Press{" "}
            <kbd
              style={{
                border: "1px solid var(--border)",
                borderRadius: 3,
                padding: "1px 5px",
                fontSize: 11,
              }}
            >
              /
            </kbd>{" "}
            to navigate
          </span>
        </div>
      </footer>

      <CommandPalette {...palette} />
    </>
  );
}
