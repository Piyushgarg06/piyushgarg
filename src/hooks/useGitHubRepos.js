import { useState, useEffect, useMemo } from "react";

const GITHUB_USERNAME = "Piyushgarg06";
const API_URL = `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`;

export function useGitHubRepos() {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeLanguage, setActiveLanguage] = useState("All");

  useEffect(() => {
    let cancelled = false;

    async function fetchRepos() {
      try {
        setLoading(true);
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error(`GitHub API returned ${res.status}`);
        const data = await res.json();

        if (!cancelled) {
          /* Filter out forks and repos with no description, sort by stars then updated */
          const filtered = data
            .filter((r) => !r.fork)
            .sort((a, b) => b.stargazers_count - a.stargazers_count);
          setRepos(filtered);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchRepos();
    return () => { cancelled = true; };
  }, []);

  /* Extract unique languages for filter tabs */
  const languages = useMemo(() => {
    const langSet = new Set();
    repos.forEach((r) => {
      if (r.language) langSet.add(r.language);
    });
    return ["All", ...Array.from(langSet).sort()];
  }, [repos]);

  /* Filter repos by active language */
  const filteredRepos = useMemo(() => {
    if (activeLanguage === "All") return repos;
    return repos.filter((r) => r.language === activeLanguage);
  }, [repos, activeLanguage]);

  return {
    repos: filteredRepos,
    allRepos: repos,
    languages,
    activeLanguage,
    setActiveLanguage,
    loading,
    error,
  };
}
