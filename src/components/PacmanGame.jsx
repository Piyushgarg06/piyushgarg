import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { springs } from "../constants/data";

const COLS = 20;
const ROWS = 16;

const INITIAL_MAZE = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1],
  [1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 0, 1, 1, 1, 2, 2, 2, 2, 1, 1, 1, 0, 1, 1, 1, 1],
  [1, 2, 2, 1, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 1, 2, 2, 1],
  [1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1],
  [1, 0, 0, 1, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 1, 0, 0, 1],
  [1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1],
  [1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

// Map of coding languages to collect
const LANG_MAP = ["JS", "Py", "TS", "Go", "Rs", "C+", "H", "C"];

const LANG_COLORS = {
  Py: "#3572A5",
  JS: "#f1e05a",
  TS: "#3178c6",
  Go: "#00ADD8",
  Rs: "#dea584",
  "C+": "#f34b7d",
  H: "#e34c26",
  C: "#563d7c",
};

// Deterministically assign a language to each dot position
const getCellLanguage = (r, c) => {
  return LANG_MAP[(r * 7 + c * 13) % LANG_MAP.length];
};

export default function PacmanGame({ onClose }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState("playing"); // playing, won
  const [flashRed, setFlashRed] = useState(false);

  // Score popups for floating "+10" anim
  const [popups, setPopups] = useState([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let animationFrameId;
    let maze = INITIAL_MAZE.map((row) => [...row]);

    // Resolve color tokens dynamically (safe fallback if document is missing them)
    const getCSSColor = (varName, fallback) => {
      if (typeof window === "undefined") return fallback;
      const val = window
        .getComputedStyle(document.documentElement)
        .getPropertyValue(varName);
      return val.trim() || fallback;
    };

    const wallColor = getCSSColor("--border", "#1A1A1A");
    const accentColor = getCSSColor("--accent", "#C8FB4A");

    // Dimensions
    const cellW = canvas.width / COLS;
    const cellH = canvas.height / ROWS;

    // Pacman Entity (Grid-locked tile movement engine)
    const pacman = {
      x: 9,
      y: 12,
      targetX: 9,
      targetY: 12,
      dirX: 0,
      dirY: 0,
      nextDirX: 0,
      nextDirY: 0,
      speed: 0.1, // cell step fraction
      mouthOpen: true,
      lastMouthToggle: Date.now(),
    };

    // Ghosts
    const ghosts = [
      {
        x: 9,
        y: 8,
        targetX: 9,
        targetY: 8,
        dirX: 0,
        dirY: -1,
        color: "#E06666",
        speed: 0.08,
      },
      {
        x: 10,
        y: 8,
        targetX: 10,
        targetY: 8,
        dirX: 0,
        dirY: -1,
        color: "#8FAADC",
        speed: 0.08,
      },
    ];

    // Confetti particles
    let confetti = [];

    // Keyboard handlers
    const handleKeyDown = (e) => {
      if (
        ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)
      ) {
        e.preventDefault(); // Lock screen scroll
        if (e.key === "ArrowUp") {
          pacman.nextDirX = 0;
          pacman.nextDirY = -1;
        } else if (e.key === "ArrowDown") {
          pacman.nextDirX = 0;
          pacman.nextDirY = 1;
        } else if (e.key === "ArrowLeft") {
          pacman.nextDirX = -1;
          pacman.nextDirY = 0;
        } else if (e.key === "ArrowRight") {
          pacman.nextDirX = 1;
          pacman.nextDirY = 0;
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown, { passive: false });

    // Wall checker
    const isWall = (gx, gy) => {
      const col = Math.round(gx);
      const row = Math.round(gy);
      if (col < 0 || col >= COLS || row < 0 || row >= ROWS) return true;
      return maze[row][col] === 1;
    };

    // Main Game Loop
    const loop = () => {
      // Toggle mouth state
      if (Date.now() - pacman.lastMouthToggle > 150) {
        pacman.mouthOpen = !pacman.mouthOpen;
        pacman.lastMouthToggle = Date.now();
      }

      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Check win condition
      let hasDots = false;
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          if (maze[r][c] === 0) hasDots = true;
        }
      }

      if (!hasDots && gameState === "playing") {
        setGameState("won");
        setTimeout(() => {
          setScore(0);
          setGameState("playing");
        }, 3000);
        for (let i = 0; i < 20; i++) {
          confetti.push({
            x: canvas.width / 2,
            y: canvas.height / 2,
            vx: (Math.random() - 0.5) * 8,
            vy: (Math.random() - 0.7) * 8 - 2,
            size: Math.random() * 6 + 4,
            rotation: Math.random() * Math.PI,
          });
        }
      }

      // ─── Render Maze and Language Dot Icons ───
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          if (maze[r][c] === 1) {
            ctx.fillStyle = wallColor;
            ctx.fillRect(c * cellW + 1, r * cellH + 1, cellW - 2, cellH - 2);
          } else if (maze[r][c] === 0) {
            // Draw language icon abbreviation as collectible point
            const lang = getCellLanguage(r, c);
            ctx.fillStyle = LANG_COLORS[lang] || accentColor;
            ctx.font = "bold 9px 'JetBrains Mono', monospace";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(lang, c * cellW + cellW / 2, r * cellH + cellH / 2);
          }
        }
      }

      if (hasDots) {
        // ─── Update Pacman Position (Tile Movement) ───
        if (pacman.x !== pacman.targetX || pacman.y !== pacman.targetY) {
          const dx = pacman.targetX - pacman.x;
          const dy = pacman.targetY - pacman.y;

          if (Math.abs(dx) > pacman.speed) {
            pacman.x += Math.sign(dx) * pacman.speed;
          } else {
            pacman.x = pacman.targetX;
          }

          if (Math.abs(dy) > pacman.speed) {
            pacman.y += Math.sign(dy) * pacman.speed;
          } else {
            pacman.y = pacman.targetY;
          }
        }

        // Check turn options at node centers
        if (pacman.x === pacman.targetX && pacman.y === pacman.targetY) {
          // Eat dot
          const col = pacman.x;
          const row = pacman.y;
          if (maze[row]?.[col] === 0) {
            const langEaten = getCellLanguage(row, col);
            maze[row][col] = 2; // Empty
            setScore((s) => s + 10);

            // Pop score floating text
            const popupId = Math.random();
            setPopups((prev) => [
              ...prev,
              {
                id: popupId,
                text: `+10 ${langEaten}`,
                x: col * cellW + cellW / 2,
                y: row * cellH + cellH / 2,
                color: LANG_COLORS[langEaten] || accentColor,
              },
            ]);
            setTimeout(() => {
              setPopups((prev) => prev.filter((p) => p.id !== popupId));
            }, 800);
          }

          // Decide next step direction
          const nextTargetX = pacman.x + pacman.nextDirX;
          const nextTargetY = pacman.y + pacman.nextDirY;

          if (!isWall(nextTargetX, nextTargetY)) {
            pacman.dirX = pacman.nextDirX;
            pacman.dirY = pacman.nextDirY;
            pacman.targetX = nextTargetX;
            pacman.targetY = nextTargetY;
          } else {
            const continueTargetX = pacman.x + pacman.dirX;
            const continueTargetY = pacman.y + pacman.dirY;
            if (!isWall(continueTargetX, continueTargetY)) {
              pacman.targetX = continueTargetX;
              pacman.targetY = continueTargetY;
            } else {
              pacman.dirX = 0;
              pacman.dirY = 0;
            }
          }
        }

        // ─── Update & Render Ghosts ───
        ghosts.forEach((ghost) => {
          if (ghost.x !== ghost.targetX || ghost.y !== ghost.targetY) {
            const dx = ghost.targetX - ghost.x;
            const dy = ghost.targetY - ghost.y;

            if (Math.abs(dx) > ghost.speed) {
              ghost.x += Math.sign(dx) * ghost.speed;
            } else {
              ghost.x = ghost.targetX;
            }

            if (Math.abs(dy) > ghost.speed) {
              ghost.y += Math.sign(dy) * ghost.speed;
            } else {
              ghost.y = ghost.targetY;
            }
          }

          if (ghost.x === ghost.targetX && ghost.y === ghost.targetY) {
            const options = [
              { dx: 1, dy: 0 },
              { dx: -1, dy: 0 },
              { dx: 0, dy: 1 },
              { dx: 0, dy: -1 },
            ].filter((d) => {
              if (d.dx === -ghost.dirX && d.dy === -ghost.dirY) return false;
              return !isWall(ghost.x + d.dx, ghost.y + d.dy);
            });

            const pick =
              options.length > 0
                ? options[Math.floor(Math.random() * options.length)]
                : { dx: -ghost.dirX, dy: -ghost.dirY };

            ghost.dirX = pick.dx;
            ghost.dirY = pick.dy;
            ghost.targetX = ghost.x + pick.dx;
            ghost.targetY = ghost.y + pick.dy;
          }

          // Draw Ghost Blob
          ctx.beginPath();
          const gx = ghost.x * cellW + cellW / 2;
          const gy = ghost.y * cellH + cellH / 2;
          ctx.arc(gx, gy, cellW / 2.2, Math.PI, 0, false);
          ctx.lineTo(gx + cellW / 2.2, gy + cellH / 2.2);
          ctx.lineTo(gx - cellW / 2.2, gy + cellH / 2.2);
          ctx.closePath();
          ctx.fillStyle = ghost.color;
          ctx.fill();

          // Eyes
          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.arc(gx - 3, gy - 2, 2.5, 0, Math.PI * 2);
          ctx.arc(gx + 3, gy - 2, 2.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "#000000";
          ctx.beginPath();
          ctx.arc(gx - 3 + ghost.dirX, gy - 2 + ghost.dirY, 1, 0, Math.PI * 2);
          ctx.arc(gx + 3 + ghost.dirX, gy - 2 + ghost.dirY, 1, 0, Math.PI * 2);
          ctx.fill();

          // Collision check
          const dist = Math.hypot(pacman.x - ghost.x, pacman.y - ghost.y);
          if (dist < 0.6) {
            setFlashRed(true);
            setTimeout(() => setFlashRed(false), 300);

            // Reset
            pacman.x = 9;
            pacman.y = 12;
            pacman.targetX = 9;
            pacman.targetY = 12;
            pacman.dirX = 0;
            pacman.dirY = 0;
            pacman.nextDirX = 0;
            pacman.nextDirY = 0;
          }
        });

        // ─── Render Pacman ───
        ctx.beginPath();
        const px = pacman.x * cellW + cellW / 2;
        const py = pacman.y * cellH + cellH / 2;
        const radius = cellW / 2.1;

        let rotation = 0;
        if (pacman.dirX === 1) rotation = 0;
        else if (pacman.dirX === -1) rotation = Math.PI;
        else if (pacman.dirY === 1) rotation = Math.PI / 2;
        else if (pacman.dirY === -1) rotation = -Math.PI / 2;

        if (pacman.mouthOpen) {
          ctx.arc(
            px,
            py,
            radius,
            rotation + Math.PI / 6,
            rotation + Math.PI * 1.83,
            false
          );
          ctx.lineTo(px, py);
        } else {
          ctx.arc(px, py, radius, rotation, rotation + Math.PI * 2, false);
        }

        ctx.fillStyle = accentColor;
        ctx.fill();
      } else {
        // Draw Win Panel
        ctx.fillStyle = accentColor;
        ctx.font = "bold 24px Syne";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("YOU WIN", canvas.width / 2, canvas.height / 2);

        // Update Confetti
        confetti.forEach((p) => {
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.2;
          p.rotation += 0.05;

          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.fillStyle = "rgba(200, 251, 74, 0.8)";
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
          ctx.restore();
        });
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [gameState]);

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={springs.snappy}
      ref={containerRef}
      style={{
        width: "100%",
        background: "var(--surface)",
        border: `1px solid ${flashRed ? "#ff4444" : "var(--border)"}`,
        borderRadius: 4,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        transition: "border-color 0.15s ease-out",
        boxShadow: "none",
      }}
    >
      {/* Header bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "8px 12px",
          borderBottom: "1px solid var(--border)",
          background: "rgba(0, 0, 0, 0.2)",
          userSelect: "none",
        }}
      >
        <div style={{ display: "flex", gap: 5 }}>
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#ff5f56",
            }}
          />
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#ffbd2e",
            }}
          />
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#27c93f",
            }}
          />
        </div>

        <div
          className="font-mono"
          style={{
            fontSize: 11,
            color: "var(--muted)",
            display: "flex",
            gap: 16,
            alignItems: "center",
          }}
        >
          <span>PAC-MAN.exe</span>
          <span style={{ color: "var(--text)" }}>SCORE: {score}</span>
        </div>

        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            color: "var(--muted)",
            fontSize: 12,
            cursor: "none",
            padding: 2,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted)")}
        >
          ✕
        </button>
      </div>

      {/* Game canvas area */}
      <div
        style={{ position: "relative", width: "100%", background: "#000000" }}
      >
        <canvas
          ref={canvasRef}
          width={400}
          height={320}
          style={{
            display: "block",
            width: "100%",
            height: "auto",
            aspectRatio: "5/4",
            background: "#000000",
          }}
        />

        {/* Floating popups */}
        {popups.map((p) => (
          <span
            key={p.id}
            className="font-mono"
            style={{
              position: "absolute",
              left: p.x,
              top: p.y,
              transform: "translate(-50%, -50%)",
              fontSize: 10,
              color: p.color,
              animation: "floatUp 0.8s ease-out forwards",
              pointerEvents: "none",
              fontWeight: "bold",
              textShadow: "0 0 2px #000",
            }}
          >
            {p.text}
          </span>
        ))}
      </div>

      <style>{`
        @keyframes floatUp {
          0% {
            transform: translate(-50%, -50%) translateY(0);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) translateY(-24px);
            opacity: 0;
          }
        }
      `}</style>
    </motion.div>
  );
}
