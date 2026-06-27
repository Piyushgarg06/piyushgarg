import { useState, useEffect, useCallback } from "react";

const ITEMS = [
  { id: "about", label: "About" },
  { id: "projects", label: "Selected Work" },
  { id: "all-projects", label: "All Projects" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
];

function fuzzyMatch(query, text) {
  const q = query.toLowerCase();
  const t = text.toLowerCase();
  let qi = 0;
  for (let ti = 0; ti < t.length && qi < q.length; ti++) {
    if (t[ti] === q[qi]) qi++;
  }
  return qi === q.length;
}

export function useCommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const filtered = query
    ? ITEMS.filter((item) => fuzzyMatch(query, item.label))
    : ITEMS;

  const open = useCallback(() => {
    setIsOpen(true);
    setQuery("");
    setSelectedIndex(0);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setQuery("");
    setSelectedIndex(0);
  }, []);

  const jumpTo = useCallback(
    (id) => {
      window.location.hash = `#${id}`;
      close();
    },
    [close]
  );

  /* Global "/" to open, ESC to close */
  useEffect(() => {
    const onKeyDown = (e) => {
      if (
        e.key === "/" &&
        !isOpen &&
        !["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName)
      ) {
        e.preventDefault();
        open();
      }

      if (e.key === "Escape" && isOpen) {
        e.preventDefault();
        close();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, open, close]);

  /* Arrow keys + Enter inside palette */
  const onKeyDown = useCallback(
    (e) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter" && filtered[selectedIndex]) {
        e.preventDefault();
        jumpTo(filtered[selectedIndex].id);
      }
    },
    [filtered, selectedIndex, jumpTo]
  );

  /* Reset selected index when filter changes */
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  return {
    isOpen,
    query,
    setQuery,
    selectedIndex,
    setSelectedIndex,
    filtered,
    open,
    close,
    jumpTo,
    onKeyDown,
  };
}
