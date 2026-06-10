import { useCallback, useEffect, useRef, useState } from "react";
import "./App.css";
const FISH_EMOJIS = ["🦈"];
const FISH_COUNT = 30;
const FLEE_RADIUS = 200;
const FLEE_FORCE = 300;

interface Fish {
  id: number;
  emoji: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
}

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function createFish(id: number, w: number, h: number): Fish {
  return {
    id,
    emoji: FISH_EMOJIS[Math.floor(Math.random() * FISH_EMOJIS.length)],
    x: randomBetween(40, w - 40),
    y: randomBetween(40, h - 40),
    vx: randomBetween(-60, 60),
    vy: randomBetween(-30, 30),
    size: randomBetween(24, 48),
  };
}

export default function App() {
  const [fish, setFish] = useState<Fish[]>([]);
  const fishRef = useRef<Fish[]>([]);
  const sizeRef = useRef({ w: window.innerWidth, h: window.innerHeight });
  const rafRef = useRef(0);
  const lastTimeRef = useRef(0);
  const clickRef = useRef<{ x: number; y: number; t: number } | null>(null);

  // Initialize fish
  useEffect(() => {
    const { w, h } = sizeRef.current;
    const initial = Array.from({ length: FISH_COUNT }, (_, i) =>
      createFish(i, w, h)
    );
    fishRef.current = initial;
    setFish(initial);
  }, []);

  // Track window resize
  useEffect(() => {
    const onResize = () => {
      sizeRef.current = { w: window.innerWidth, h: window.innerHeight };
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Animation loop
  useEffect(() => {
    const tick = (time: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = time;
      const dt = Math.min((time - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = time;

      const { w, h } = sizeRef.current;
      const click = clickRef.current;

      const updated = fishRef.current.map((f) => {
        let { x, y, vx, vy } = f;

        // Flee from click
        if (click && time - click.t < 1500) {
          const dx = x - click.x;
          const dy = y - click.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < FLEE_RADIUS && dist > 0) {
            const strength = (1 - dist / FLEE_RADIUS) * FLEE_FORCE;
            vx += (dx / dist) * strength * dt * 8;
            vy += (dy / dist) * strength * dt * 8;
          }
        }

        // Gentle wander — small random nudges
        vx += randomBetween(-20, 20) * dt;
        vy += randomBetween(-10, 10) * dt;

        // Damping
        vx *= 0.995;
        vy *= 0.995;

        // Clamp speed
        const speed = Math.sqrt(vx * vx + vy * vy);
        const maxSpeed = 200;
        if (speed > maxSpeed) {
          vx = (vx / speed) * maxSpeed;
          vy = (vy / speed) * maxSpeed;
        }

        // Move
        x += vx * dt;
        y += vy * dt;

        // Bounce off edges
        if (x < 10) { x = 10; vx = Math.abs(vx); }
        if (x > w - 10) { x = w - 10; vx = -Math.abs(vx); }
        if (y < 10) { y = 10; vy = Math.abs(vy); }
        if (y > h - 10) { y = h - 10; vy = -Math.abs(vy); }

        return { ...f, x, y, vx, vy };
      });

      fishRef.current = updated;
      setFish(updated);
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const handleClick = useCallback((e: React.MouseEvent) => {
    clickRef.current = { x: e.clientX, y: e.clientY, t: performance.now() };
  }, []);

  // Bubbles (static decorative)
  const bubbles = useRef(
    Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: randomBetween(5, 95),
      delay: randomBetween(0, 10),
      duration: randomBetween(6, 14),
      size: randomBetween(6, 20),
    }))
  );

  return (
    <div
      className="relative w-full h-screen cursor-pointer select-none"
      style={{
        background: "linear-gradient(180deg, #0a3d62 0%, #0c5076 30%, #0a6e8a 60%, #0b4f6c 100%)",
      }}
      onClick={handleClick}
    >
      {/* Bubbles */}
      {bubbles.current.map((b) => (
        <div
          key={b.id}
          className="absolute rounded-full opacity-40"
          style={{
            width: b.size,
            height: b.size,
            left: `${b.left}%`,
            bottom: -20,
            animation: `rise ${b.duration}s linear ${b.delay}s infinite`,
            background: `radial-gradient(circle, rgba(255,255,255,0.8), rgba(173,216,230,0.4) 60%, transparent)`,
            boxShadow: `0 0 ${b.size}px rgba(255,255,255,0.3)`,
          }}
        />
      ))}

      {/* Fish */}
      {fish.map((f) => (
        <span
          key={f.id}
          className="absolute pointer-events-none"
          style={{
            left: f.x,
            top: f.y,
            fontSize: f.size,
            transform: `translate(-50%, -50%) scaleX(${f.vx < 0 ? -1 : 1})`,
            transition: "transform 0.3s ease",
            filter: "drop-shadow(0 0 4px rgba(255,255,255,0.3))",
          }}
        >
          {f.emoji}
        </span>
      ))}

      {/* Title */}
      <div
        className="absolute top-8 left-1/2 -translate-x-1/2 text-2xl font-light tracking-widest pointer-events-none"
        style={{
          color: "rgba(173, 216, 230, 0.8)",
          opacity: 0.6,
          textShadow: "0 0 10px rgba(173,216,230,0.5)",
        }}
      >
        🦈 click anywhere 🦈
      </div>

      <style>{`
        @keyframes rise {
          0% { transform: translateY(0); opacity: 0.3; }
          50% { opacity: 0.6; }
          100% { transform: translateY(-105vh); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
