import { useState, useEffect, useMemo } from "react";

const GITHUB_USERNAME = "Piyushgarg06";
const API_URL = `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`;
const CACHE_KEY = "github_repos_cache";
const CACHE_TTL = 60 * 60 * 1000; // 1 hour — matches GitHub's unauthenticated rate window

/**
 * Read cached repos from localStorage.
 * Returns the data array or null if expired / missing.
 */
function readCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { data, timestamp } = JSON.parse(raw);
    if (Date.now() - timestamp < CACHE_TTL && Array.isArray(data) && data.length) {
      return data;
    }
  } catch {
    /* ignore parse errors */
  }
  return null;
}

function writeCache(data) {
  try {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ data, timestamp: Date.now() })
    );
  } catch {
    /* ignore quota errors */
  }
}

/**
 * Read stale (expired) cache as a last-resort fallback.
 */
function readStaleCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { data } = JSON.parse(raw);
    if (Array.isArray(data) && data.length) return data;
  } catch {
    /* ignore */
  }
  return null;
}

/**
 * Fetch with automatic retry + exponential back-off.
 */
async function fetchWithRetry(url, retries = 2, delay = 1500) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url);
      if (res.status === 403 || res.status === 429) {
        const retryAfter = res.headers.get("Retry-After");
        const waitMs = retryAfter ? parseInt(retryAfter, 10) * 1000 : delay;
        await new Promise((r) => setTimeout(r, waitMs));
        delay *= 2;
        continue;
      }
      if (!res.ok) throw new Error(`GitHub API returned ${res.status}`);
      return await res.json();
    } catch (err) {
      if (i === retries - 1) throw err;
      await new Promise((r) => setTimeout(r, delay));
      delay *= 2;
    }
  }
}

export function useGitHubRepos() {
  const [repos, setRepos] = useState(() => readCache() || []);
  const [loading, setLoading] = useState(() => !readCache());
  const [error, setError] = useState(null);
  const [activeLanguage, setActiveLanguage] = useState("All");

  useEffect(() => {
    let cancelled = false;

    async function fetchRepos() {
      // Serve from cache — skip the network entirely
      const cached = readCache();
      if (cached) {
        if (!cancelled) {
          setRepos(cached);
          setError(null);
          setLoading(false);
        }
        return;
      }

      try {
        setLoading(true);
        const data = await fetchWithRetry(API_URL);

        if (!cancelled) {
          const filtered = data
            .filter((r) => !r.fork)
            .sort((a, b) => b.stargazers_count - a.stargazers_count);
          setRepos(filtered);
          setError(null);
          writeCache(filtered);
        }
      } catch (err) {
        if (!cancelled) {
          // Fallback: serve stale cache instead of showing an error
          const stale = readStaleCache();
          if (stale) {
            setRepos(stale);
            setError(null);
          } else {
            setError(err.message);
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchRepos();
    return () => {
      cancelled = true;
    };
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
