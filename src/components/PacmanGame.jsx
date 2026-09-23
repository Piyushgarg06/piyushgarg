import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ─── Maze layout (20 cols x 16 rows) ───────────
   1 = wall, 0 = lang dot, 3 = power pellet, 2 = corridor/empty
─────────────────────────────────────────────── */
const COLS = 20;
const ROWS = 16;

const INITIAL_MAZE = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 3, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 3, 1],
  [1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1],
  [1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 0, 1, 1, 1, 2, 2, 2, 2, 1, 1, 1, 0, 1, 1, 1, 1],
  [1, 2, 2, 1, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 1, 2, 2, 1],
  [1, 1, 1, 1, 0, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 0, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1],
  [1, 3, 0, 1, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 1, 0, 3, 1],
  [1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1],
  [1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

/* ─── Coding Languages ─── */
const LANG_MAP = ["JS", "Py", "TS", "Go", "Rs", "C+", "Kt", "Rb"];
const LANG_COLORS = {
  JS: "#f1e05a",
  Py: "#3878b4",
  TS: "#3178c6",
  Go: "#00ADD8",
  Rs: "#dea584",
  "C+": "#f34b7d",
  Kt: "#A97BFF",
  Rb: "#cc342d",
};

const getCellLang = (r, c) => LANG_MAP[(r * 7 + c * 13) % LANG_MAP.length];

function countDots(maze) {
  let n = 0;
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++)
      if (maze[r][c] === 0 || maze[r][c] === 3) n++;
  return n;
}
const TOTAL_DOTS = countDots(INITIAL_MAZE);

const DIR_MAP = {
  ArrowUp:    { dx: 0,  dy: -1 },
  ArrowDown:  { dx: 0,  dy:  1 },
  ArrowLeft:  { dx: -1, dy:  0 },
  ArrowRight: { dx: 1,  dy:  0 },
  w: { dx: 0,  dy: -1 },
  s: { dx: 0,  dy:  1 },
  a: { dx: -1, dy:  0 },
  d: { dx: 1,  dy:  0 },
  W: { dx: 0,  dy: -1 },
  S: { dx: 0,  dy:  1 },
  A: { dx: -1, dy:  0 },
  D: { dx: 1,  dy:  0 },
};

function makeGhosts() {
  return [
    { x: 9,  y: 8, targetX: 9,  targetY: 7, dirX: 0, dirY: -1, color: "#E06666", speed: 0.075 },
    { x: 10, y: 8, targetX: 10, targetY: 7, dirX: 0, dirY: -1, color: "#8FAADC", speed: 0.070 },
    { x: 11, y: 8, targetX: 11, targetY: 7, dirX: 0, dirY: -1, color: "#F6C177", speed: 0.065 },
  ];
}

function makeCollection() {
  return Object.fromEntries(LANG_MAP.map((l) => [l, 0]));
}

export default function PacmanGame({ onClose }) {
  const canvasRef = useRef(null);
  const gameRef   = useRef(null);
  const rafRef    = useRef(null);
  const touchRef  = useRef({ x: 0, y: 0 });

  const [score,      setScore]      = useState(0);
  const [lives,      setLives]      = useState(3);
  const [status,     setStatus]     = useState("playing");
  const [progress,   setProgress]   = useState(0);
  const [popups,     setPopups]     = useState([]);
  const [flashRed,   setFlashRed]   = useState(false);
  const [collection, setCollection] = useState(makeCollection());
  const [isPower,    setIsPower]    = useState(false);

  /* ─── Initialize game state ─── */
  const initGame = useCallback(() => {
    gameRef.current = {
      maze: INITIAL_MAZE.map((r) => [...r]),
      pacman: {
        x: 9, y: 12, targetX: 9, targetY: 12,
        dirX: 0, dirY: 0, nextDirX: 0, nextDirY: 0,
        speed: 0.12, mouthAngle: 0.25, mouthDir: 1,
      },
      ghosts: makeGhosts(),
      dotsLeft: TOTAL_DOTS,
      score: 0,
      lives: 3,
      frightenUntil: 0,
      damageUntil: 0,
      collection: makeCollection(),
    };
  }, []);

  const restartGame = useCallback(() => {
    initGame();
    setScore(0);
    setLives(3);
    setProgress(0);
    setCollection(makeCollection());
    setIsPower(false);
    setStatus("playing");
  }, [initGame]);

  /* Init on mount */
  useEffect(() => {
    initGame();
  }, [initGame]);

  /* ─── Keyboard input ─── */
  useEffect(() => {
    const handleKey = (e) => {
      const dir = DIR_MAP[e.key];
      if (dir) {
        if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
          e.preventDefault();
        }
        if (gameRef.current) {
          gameRef.current.pacman.nextDirX = dir.dx;
          gameRef.current.pacman.nextDirY = dir.dy;
        }
      }
    };
    window.addEventListener("keydown", handleKey, { passive: false });
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  /* ─── Touch swipe ─── */
  const onTouchStart = (e) => {
    touchRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const onTouchEnd = (e) => {
    const dx = e.changedTouches[0].clientX - touchRef.current.x;
    const dy = e.changedTouches[0].clientY - touchRef.current.y;
    if (Math.abs(dx) < 12 && Math.abs(dy) < 12) return;
    if (!gameRef.current) return;
    const p = gameRef.current.pacman;
    if (Math.abs(dx) > Math.abs(dy)) {
      p.nextDirX = dx > 0 ? 1 : -1; p.nextDirY = 0;
    } else {
      p.nextDirX = 0; p.nextDirY = dy > 0 ? 1 : -1;
    }
  };

  /* ─── Main Animation Loop ─── */
  useEffect(() => {
    if (status !== "playing") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const CW = canvas.width / COLS;
    const CH = canvas.height / ROWS;

    const isWall = (gx, gy) => {
      const c = Math.round(gx);
      const r = Math.round(gy);
      if (c < 0 || c >= COLS || r < 0 || r >= ROWS) return true;
      return gameRef.current.maze[r][c] === 1;
    };

    let pulsePhase = 0;

    const step = () => {
      if (!gameRef.current) return;
      const g = gameRef.current;
      const { maze, pacman, ghosts } = g;
      const now = Date.now();
      pulsePhase += 0.08;

      const frightened = now < g.frightenUntil;
      const frightEnding = frightened && (g.frightenUntil - now < 1500);

      /* ── 1. Clear Canvas ── */
      ctx.fillStyle = "#050505";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      /* ── 2. Draw Maze & Coding Language Dots ── */
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const cell = maze[r][c];
          const cx = c * CW + CW / 2;
          const cy = r * CH + CH / 2;

          if (cell === 1) {
            /* Wall tile with sleek border */
            ctx.fillStyle = "#141414";
            ctx.fillRect(c * CW + 1, r * CH + 1, CW - 2, CH - 2);

            ctx.strokeStyle = "#222222";
            ctx.lineWidth = 1;
            ctx.strokeRect(c * CW + 1, r * CH + 1, CW - 2, CH - 2);

          } else if (cell === 0) {
            /* Regular Language Dot: Pill with colored badge and text */
            const lang = getCellLang(r, c);
            const color = LANG_COLORS[lang] || "#C8FB4A";

            /* Pill Background */
            const pw = CW * 0.82;
            const ph = CH * 0.58;
            ctx.fillStyle = color + "20"; // ~12% opacity
            ctx.beginPath();
            if (ctx.roundRect) {
              ctx.roundRect(cx - pw / 2, cy - ph / 2, pw, ph, 3);
            } else {
              ctx.rect(cx - pw / 2, cy - ph / 2, pw, ph);
            }
            ctx.fill();

            /* Language Text */
            ctx.fillStyle = color;
            ctx.font = `bold ${Math.round(CW * 0.42)}px 'JetBrains Mono', monospace`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(lang, cx, cy + 0.5);

          } else if (cell === 3) {
            /* Power Pellet: Pulsing glowing coin with language */
            const lang = getCellLang(r, c);
            const color = LANG_COLORS[lang] || "#C8FB4A";
            const scale = 0.88 + 0.16 * Math.sin(pulsePhase);

            /* Outer glow */
            const grad = ctx.createRadialGradient(cx, cy, 2, cx, cy, CW * 0.55 * scale);
            grad.addColorStop(0, color + "aa");
            grad.addColorStop(1, color + "00");
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(cx, cy, CW * 0.55 * scale, 0, Math.PI * 2);
            ctx.fill();

            /* Solid circle */
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(cx, cy, CW * 0.34 * scale, 0, Math.PI * 2);
            ctx.fill();

            /* Inner text */
            ctx.fillStyle = "#000000";
            ctx.font = `bold ${Math.round(CW * 0.36)}px 'JetBrains Mono', monospace`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(lang, cx, cy + 0.5);
          }
        }
      }

      /* ── 3. Move Pacman ── */
      pacman.mouthAngle += 0.05 * pacman.mouthDir;
      if (pacman.mouthAngle >= 0.32 || pacman.mouthAngle <= 0.02) pacman.mouthDir *= -1;

      if (pacman.x !== pacman.targetX || pacman.y !== pacman.targetY) {
        const dx = pacman.targetX - pacman.x;
        const dy = pacman.targetY - pacman.y;
        pacman.x += Math.sign(dx) * Math.min(pacman.speed, Math.abs(dx));
        pacman.y += Math.sign(dy) * Math.min(pacman.speed, Math.abs(dy));
      }

      /* When at grid center, check eating & next turn */
      if (Math.abs(pacman.x - pacman.targetX) < 0.01 && Math.abs(pacman.y - pacman.targetY) < 0.01) {
        pacman.x = pacman.targetX;
        pacman.y = pacman.targetY;
        const col = Math.round(pacman.x);
        const row = Math.round(pacman.y);
        const cell = maze[row]?.[col];

        if (cell === 0 || cell === 3) {
          const lang = getCellLang(row, col);
          const color = LANG_COLORS[lang] || "#C8FB4A";
          const pts = cell === 3 ? 50 : 10;

          maze[row][col] = 2; // eaten
          g.dotsLeft--;
          g.score += pts;
          g.collection[lang] = (g.collection[lang] || 0) + 1;

          setScore(g.score);
          setProgress(Math.round(((TOTAL_DOTS - g.dotsLeft) / TOTAL_DOTS) * 100));
          setCollection({ ...g.collection });

          /* Power pellet eaten */
          if (cell === 3) {
            g.frightenUntil = now + 6000;
            setIsPower(true);
            setTimeout(() => {
              if (Date.now() >= g.frightenUntil) setIsPower(false);
            }, 6000);
          }

          /* Floating score popup */
          const pid = Math.random();
          setPopups((prev) => [
            ...prev,
            { id: pid, text: `+${pts} ${lang}`, x: col * CW + CW / 2, y: row * CH + CH / 2, color },
          ]);
          setTimeout(() => setPopups((prev) => prev.filter((p) => p.id !== pid)), 750);

          if (g.dotsLeft === 0) {
            setStatus("won");
            return;
          }
        }

        /* Try moving in next desired direction */
        const nx = pacman.x + pacman.nextDirX;
        const ny = pacman.y + pacman.nextDirY;
        if (!isWall(nx, ny)) {
          pacman.dirX = pacman.nextDirX;
          pacman.dirY = pacman.nextDirY;
          pacman.targetX = nx;
          pacman.targetY = ny;
        } else {
          /* Continue in current direction */
          const cx2 = pacman.x + pacman.dirX;
          const cy2 = pacman.y + pacman.dirY;
          if (!isWall(cx2, cy2)) {
            pacman.targetX = cx2;
            pacman.targetY = cy2;
          } else {
            pacman.dirX = 0;
            pacman.dirY = 0;
          }
        }
      }

      /* ── 4. Render Pacman ── */
      const px = pacman.x * CW + CW / 2;
      const py = pacman.y * CH + CH / 2;
      const pr = CW / 2.15;

      let rot = 0;
      if (pacman.dirX === 1)  rot = 0;
      if (pacman.dirX === -1) rot = Math.PI;
      if (pacman.dirY === 1)  rot = Math.PI / 2;
      if (pacman.dirY === -1) rot = -Math.PI / 2;

      /* Pacman Body */
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.arc(px, py, pr, rot + pacman.mouthAngle, rot + Math.PI * 2 - pacman.mouthAngle);
      ctx.closePath();
      ctx.fillStyle = "#C8FB4A";
      ctx.fill();

      /* Pacman Eye */
      const eyeX = px + Math.cos(rot - Math.PI / 3.2) * pr * 0.48;
      const eyeY = py + Math.sin(rot - Math.PI / 3.2) * pr * 0.48;
      ctx.beginPath();
      ctx.arc(eyeX, eyeY, pr * 0.12, 0, Math.PI * 2);
      ctx.fillStyle = "#000000";
      ctx.fill();

      /* ── 5. Move & Render Ghosts ── */
      ghosts.forEach((ghost) => {
        const curSpeed = frightened ? ghost.speed * 0.55 : ghost.speed;

        if (ghost.x !== ghost.targetX || ghost.y !== ghost.targetY) {
          const dx = ghost.targetX - ghost.x;
          const dy = ghost.targetY - ghost.y;
          ghost.x += Math.sign(dx) * Math.min(curSpeed, Math.abs(dx));
          ghost.y += Math.sign(dy) * Math.min(curSpeed, Math.abs(dy));
        }

        if (Math.abs(ghost.x - ghost.targetX) < 0.01 && Math.abs(ghost.y - ghost.targetY) < 0.01) {
          ghost.x = ghost.targetX;
          ghost.y = ghost.targetY;

          const options = [
            { dx: 1,  dy: 0 },
            { dx: -1, dy: 0 },
            { dx: 0,  dy: 1 },
            { dx: 0,  dy: -1 },
          ].filter((d) => (d.dx !== -ghost.dirX || d.dy !== -ghost.dirY))
           .filter((d) => !isWall(ghost.x + d.dx, ghost.y + d.dy));

          const pick = options.length > 0
            ? options[Math.floor(Math.random() * options.length)]
            : { dx: -ghost.dirX, dy: -ghost.dirY };

          ghost.dirX = pick.dx;
          ghost.dirY = pick.dy;
          ghost.targetX = ghost.x + pick.dx;
          ghost.targetY = ghost.y + pick.dy;
        }

        /* Ghost Canvas Coordinates */
        const gx = ghost.x * CW + CW / 2;
        const gy = ghost.y * CH + CH / 2;
        const gr = CW / 2.15;

        let bodyColor = ghost.color;
        if (frightened) {
          bodyColor = frightEnding && Math.floor(now / 180) % 2 === 0 ? "#e0e0e0" : "#3b82f6";
        }

        /* Ghost Body with wavy base */
        ctx.beginPath();
        ctx.arc(gx, gy - gr * 0.1, gr, Math.PI, 0, false);
        const segments = 4;
        const sw = (gr * 2) / segments;
        for (let i = 0; i <= segments; i++) {
          const wx = gx + gr - i * sw;
          const wy = gy + gr * 0.9 + (i % 2 === 0 ? gr * 0.2 : 0);
          ctx.lineTo(wx, wy);
        }
        ctx.closePath();
        ctx.fillStyle = bodyColor;
        ctx.fill();

        if (!frightened) {
          /* Normal Eyes */
          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.ellipse(gx - gr * 0.32, gy - gr * 0.15, gr * 0.26, gr * 0.32, 0, 0, Math.PI * 2);
          ctx.ellipse(gx + gr * 0.32, gy - gr * 0.15, gr * 0.26, gr * 0.32, 0, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = "#1a365d";
          ctx.beginPath();
          ctx.arc(gx - gr * 0.32 + ghost.dirX * gr * 0.1, gy - gr * 0.15 + ghost.dirY * gr * 0.1, gr * 0.13, 0, Math.PI * 2);
          ctx.arc(gx + gr * 0.32 + ghost.dirX * gr * 0.1, gy - gr * 0.15 + ghost.dirY * gr * 0.1, gr * 0.13, 0, Math.PI * 2);
          ctx.fill();
        } else {
          /* Frightened Face */
          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.arc(gx - gr * 0.28, gy - gr * 0.1, gr * 0.1, 0, Math.PI * 2);
          ctx.arc(gx + gr * 0.28, gy - gr * 0.1, gr * 0.1, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          const mx = gx - gr * 0.35;
          const mw = (gr * 0.7) / 3;
          ctx.moveTo(mx, gy + gr * 0.2);
          ctx.lineTo(mx + mw, gy + gr * 0.1);
          ctx.lineTo(mx + mw * 2, gy + gr * 0.2);
          ctx.lineTo(mx + mw * 3, gy + gr * 0.1);
          ctx.stroke();
        }

        /* ── 6. Collision Check ── */
        const dist = Math.hypot(pacman.x - ghost.x, pacman.y - ghost.y);
        if (dist < 0.65) {
          if (frightened) {
            /* Eat Ghost */
            ghost.x = 9;
            ghost.y = 8;
            ghost.targetX = 9;
            ghost.targetY = 7;
            ghost.dirX = 0;
            ghost.dirY = -1;

            g.score += 200;
            setScore(g.score);

            const pid = Math.random();
            setPopups((prev) => [
              ...prev,
              { id: pid, text: "+200 👻", x: gx, y: gy, color: "#38bdf8" },
            ]);
            setTimeout(() => setPopups((prev) => prev.filter((p) => p.id !== pid)), 800);

          } else if (now > g.damageUntil) {
            /* Pacman Takes Damage */
            g.damageUntil = now + 600;
            setFlashRed(true);
            setTimeout(() => setFlashRed(false), 500);

            g.lives--;
            setLives(g.lives);

            if (g.lives <= 0) {
              setStatus("over");
              return;
            }

            /* Reset Pacman to Starting Position */
            pacman.x = 9;
            pacman.y = 12;
            pacman.targetX = 9;
            pacman.targetY = 12;
            pacman.dirX = 0;
            pacman.dirY = 0;
            pacman.nextDirX = 0;
            pacman.nextDirY = 0;
          }
        }
      });

      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [status]);

  /* D-pad handler for mobile / touch controls */
  const dPad = (key) => {
    const dir = DIR_MAP[key];
    if (gameRef.current && dir) {
      gameRef.current.pacman.nextDirX = dir.dx;
      gameRef.current.pacman.nextDirY = dir.dy;
    }
  };

  const livesArr = Array.from({ length: 3 }, (_, i) => i < lives);

  return (
    <div
      style={{
        width: "100%",
        background: "var(--surface)",
        border: `1px solid ${flashRed ? "#ef4444" : "var(--border)"}`,
        borderRadius: 4,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        transition: "border-color 0.15s ease-out",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.75)",
        userSelect: "none",
      }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* ── Title Bar ── */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "8px 14px",
          borderBottom: "1px solid var(--border)",
          background: "rgba(0, 0, 0, 0.4)",
        }}
      >
        {/* Retro Window Dots */}
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#ff5f56" }} />
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#ffbd2e" }} />
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#27c93f" }} />
        </div>

        {/* Status Indicators */}
        <div
          className="font-mono"
          style={{
            fontSize: 11,
            color: "var(--muted)",
            display: "flex",
            gap: 14,
            alignItems: "center",
          }}
        >
          <span style={{ letterSpacing: "0.08em", fontWeight: 700 }}>PAC-MAN.exe</span>
          <span style={{ color: "var(--accent)", fontVariantNumeric: "tabular-nums" }}>
            SCORE: {score.toString().padStart(5, "0")}
          </span>

          {/* Lives */}
          <span style={{ display: "flex", gap: 3, alignItems: "center" }}>
            {livesArr.map((alive, i) => (
              <svg key={i} width="11" height="11" viewBox="0 0 10 10">
                <path
                  d="M5 5 L9 2 A4.5 4.5 0 1 1 9 8 Z"
                  fill={alive ? "var(--accent)" : "rgba(255,255,255,0.15)"}
                />
              </svg>
            ))}
          </span>

          {/* Power pellet active badge */}
          {isPower && (
            <span
              style={{
                color: "#38bdf8",
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: "0.1em",
                animation: "pulsePower 0.6s infinite alternate",
              }}
            >
              POWER
            </span>
          )}
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close Pacman game"
          style={{
            background: "none",
            border: "none",
            color: "var(--muted)",
            fontSize: 13,
            cursor: "pointer",
            padding: "2px 4px",
            lineHeight: 1,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted)")}
        >
          ✕
        </button>
      </div>

      {/* ── Progress Bar ── */}
      <div style={{ height: 2, background: "rgba(255,255,255,0.06)" }}>
        <div
          style={{
            height: "100%",
            width: `${progress}%`,
            background: "var(--accent)",
            transition: "width 0.2s ease-out",
          }}
        />
      </div>

      {/* ── Canvas Area & Overlays ── */}
      <div style={{ position: "relative", width: "100%", background: "#050505" }}>
        <canvas
          ref={canvasRef}
          width={500}
          height={400}
          style={{
            display: "block",
            width: "100%",
            height: "auto",
            aspectRatio: "5/4",
            background: "#050505",
          }}
        />

        {/* Floating popups */}
        {popups.map((p) => (
          <span
            key={p.id}
            className="font-mono"
            style={{
              position: "absolute",
              left: `${(p.x / 500) * 100}%`,
              top: `${(p.y / 400) * 100}%`,
              transform: "translate(-50%, -50%)",
              fontSize: 10,
              color: p.color,
              fontWeight: 700,
              animation: "floatUp 0.75s ease-out forwards",
              pointerEvents: "none",
              textShadow: "0 1px 4px rgba(0,0,0,0.9)",
              whiteSpace: "nowrap",
            }}
          >
            {p.text}
          </span>
        ))}

        {/* End Game Overlays */}
        <AnimatePresence>
          {status !== "playing" && (
            <motion.div
              key={status}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: "absolute",
                inset: 0,
                background: "rgba(0, 0, 0, 0.88)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
                padding: 20,
                textAlign: "center",
              }}
            >
              {status === "won" && (
                <>
                  <span
                    className="font-display"
                    style={{ fontSize: 28, color: "var(--accent)", fontWeight: 900 }}
                  >
                    YOU WIN!
                  </span>
                  <span className="font-mono" style={{ fontSize: 11, color: "var(--muted)" }}>
                    All programming languages collected! Final score: {score}
                  </span>
                  <button
                    onClick={restartGame}
                    className="font-mono"
                    style={{
                      marginTop: 8,
                      padding: "8px 24px",
                      background: "var(--accent)",
                      color: "#000",
                      border: "none",
                      borderRadius: 2,
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      cursor: "pointer",
                    }}
                  >
                    Play Again
                  </button>
                </>
              )}

              {status === "over" && (
                <>
                  <span
                    className="font-display"
                    style={{ fontSize: 28, color: "#ef4444", fontWeight: 900 }}
                  >
                    GAME OVER
                  </span>
                  <span className="font-mono" style={{ fontSize: 11, color: "var(--muted)" }}>
                    Caught by ghosts! Final score: {score}
                  </span>
                  <button
                    onClick={restartGame}
                    className="font-mono"
                    style={{
                      marginTop: 8,
                      padding: "8px 24px",
                      background: "transparent",
                      color: "var(--text)",
                      border: "1px solid var(--border)",
                      borderRadius: 2,
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      cursor: "pointer",
                    }}
                  >
                    Try Again
                  </button>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Live Language Collection Bar ── */}
      <div
        style={{
          display: "flex",
          borderTop: "1px solid var(--border)",
          background: "rgba(0, 0, 0, 0.25)",
          overflowX: "auto",
        }}
      >
        {LANG_MAP.map((lang) => {
          const count = collection[lang] || 0;
          const active = count > 0;
          return (
            <div
              key={lang}
              style={{
                flex: "1 0 auto",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "6px 4px",
                borderRight: "1px solid var(--border)",
                minWidth: 42,
                opacity: active ? 1 : 0.25,
                transition: "opacity 0.2s, background 0.2s",
                background: active ? `${LANG_COLORS[lang]}0a` : "transparent",
              }}
            >
              <span
                className="font-mono"
                style={{
                  fontSize: 10,
                  color: LANG_COLORS[lang],
                  fontWeight: 700,
                  lineHeight: 1.2,
                }}
              >
                {lang}
              </span>
              <span
                className="font-mono"
                style={{
                  fontSize: 9,
                  color: "var(--muted)",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {active ? `×${count}` : "·"}
              </span>
            </div>
          );
        })}
      </div>

      {/* ── Footer controls hint & mobile D-pad ── */}
      <div
        style={{
          padding: "8px 14px",
          borderTop: "1px solid var(--border)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 8,
          background: "rgba(0, 0, 0, 0.4)",
        }}
      >
        <span
          className="font-mono"
          style={{ fontSize: 10, color: "var(--muted)", letterSpacing: "0.04em" }}
        >
          Use <kbd style={{ border: "1px solid var(--border)", padding: "1px 4px", borderRadius: 2 }}>Arrow keys</kbd> or <kbd style={{ border: "1px solid var(--border)", padding: "1px 4px", borderRadius: 2 }}>WASD</kbd> · Corners frighten ghosts
        </span>

        {/* Mobile-only Quick D-Pad */}
        <div
          className="mobile-only"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 30px)",
            gridTemplateRows: "repeat(2, 26px)",
            gap: 4,
            marginLeft: "auto",
          }}
        >
          {[
            { key: "ArrowUp",    label: "↑", col: 2, row: 1 },
            { key: "ArrowLeft",  label: "←", col: 1, row: 2 },
            { key: "ArrowDown",  label: "↓", col: 2, row: 2 },
            { key: "ArrowRight", label: "→", col: 3, row: 2 },
          ].map(({ key, label, col, row }) => (
            <button
              key={key}
              onPointerDown={() => dPad(key)}
              style={{
                gridColumn: col,
                gridRow: row,
                background: "var(--raised)",
                border: "1px solid var(--border)",
                borderRadius: 2,
                color: "var(--text)",
                fontSize: 12,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                lineHeight: 1,
              }}
              aria-label={key}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes floatUp {
          0%   { transform: translate(-50%, -50%) translateY(0); opacity: 1; }
          100% { transform: translate(-50%, -50%) translateY(-22px); opacity: 0; }
        }
        @keyframes pulsePower {
          0%   { opacity: 0.6; }
          100% { opacity: 1; filter: drop-shadow(0 0 6px #38bdf8); }
        }
      `}</style>
    </div>
  );
}
