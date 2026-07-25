import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  life: number;
  maxLife: number;
}

const MAX_PARTICLES = 20;
const SPAWN_CHANCE = 0.3;

export default function AmbientParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Seed initial particles
    const w = canvas.width;
    const h = canvas.height;
    const initial: Particle[] = [];
    for (let i = 0; i < 15; i++) {
      initial.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.2,
        vy: -Math.random() * 0.15 - 0.05,
        size: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.3 + 0.05,
        life: 0,
        maxLife: Math.random() * 400 + 200,
      });
    }
    particlesRef.current = initial;

    // Throttled animation - don't run every frame
    let lastFrame = 0;

    const animate = (now: number) => {
      // Throttle to ~30fps for background particles
      if (now - lastFrame < 33) {
        rafRef.current = requestAnimationFrame(animate);
        return;
      }
      lastFrame = now;

      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const h = canvas.height;
      const w = canvas.width;
      const particles = particlesRef.current;

      // Slow spawn
      if (particles.length < MAX_PARTICLES && Math.random() < SPAWN_CHANCE) {
        particles.push({
          x: Math.random() * w,
          y: h + 5,
          vx: (Math.random() - 0.5) * 0.2,
          vy: -Math.random() * 0.15 - 0.05,
          size: Math.random() * 1.5 + 0.5,
          alpha: Math.random() * 0.3 + 0.05,
          life: 0,
          maxLife: Math.random() * 400 + 200,
        });
      }

      // Update and draw
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]!;
        p.life++;
        p.x += p.vx;
        p.y += p.vy;

        if (p.life >= p.maxLife || p.alpha < 0.01 || p.y < -10) {
          particles.splice(i, 1);
          continue;
        }

        const currentAlpha = p.alpha * (1 - p.life / p.maxLife);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(251, 191, 36, ${currentAlpha})`;
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[1]"
    />
  );
}
