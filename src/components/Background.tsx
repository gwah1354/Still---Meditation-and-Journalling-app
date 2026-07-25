import { motion } from "framer-motion";

// ─── Floating glass panels (reduced from 8 → 4) ───
const GLASS_PANELS = [
  { w: 200, h: 280, x: 0.08, y: 0.2, blur: 40, alpha: 0.04, rotate: -10, driftX: 30, driftY: -20 },
  { w: 160, h: 220, x: 0.82, y: 0.7, blur: 50, alpha: 0.025, rotate: 8, driftX: -40, driftY: 30 },
  { w: 180, h: 150, x: 0.3, y: 0.75, blur: 35, alpha: 0.03, rotate: -5, driftX: 25, driftY: -15 },
  { w: 140, h: 200, x: 0.88, y: 0.3, blur: 45, alpha: 0.02, rotate: 12, driftX: -20, driftY: 25 },
];

// ─── Gradient orbs (reduced from 6 → 4) ───
const ORBS = [
  { color: "rgba(251, 191, 36, 0.12)", size: 600, x: 0.2, y: 0.25, driftX: 80, driftY: -60 },
  { color: "rgba(147, 51, 234, 0.06)", size: 450, x: 0.8, y: 0.6, driftX: -90, driftY: 40 },
  { color: "rgba(20, 184, 166, 0.05)", size: 400, x: 0.5, y: 0.8, driftX: 60, driftY: -70 },
  { color: "rgba(245, 158, 11, 0.06)", size: 350, x: 0.1, y: 0.7, driftX: -40, driftY: 50 },
];

// ─── Decorative glass shapes (reduced from 5 → 3) ───
const DECORATIVE_SHAPES = [
  { size: 60, x: 0.95, y: 0.08, blur: 20, alpha: 0.05 },
  { size: 45, x: 0.04, y: 0.55, blur: 15, alpha: 0.04 },
  { size: 80, x: 0.5, y: 0.92, blur: 25, alpha: 0.03 },
];

export default function Background() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-black" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-amber-900/5" />

      {/* Gradient orbs */}
      {ORBS.map((orb, i) => (
        <motion.div
          key={`orb-${i}`}
          className="absolute rounded-full pointer-events-none will-change-transform"
          style={{
            width: orb.size,
            height: orb.size,
            background: `radial-gradient(circle at 30% 30%, ${orb.color}, transparent 70%)`,
            left: `${orb.x * 100}%`,
            top: `${orb.y * 100}%`,
            translateX: "-50%",
            translateY: "-50%",
            filter: "blur(100px)",
          }}
          animate={{
            x: [orb.driftX, orb.driftX + 50, orb.driftX - 30, orb.driftX],
            y: [orb.driftY, orb.driftY - 50, orb.driftY + 35, orb.driftY],
            scale: [1, 1.08, 0.94, 1],
          }}
          transition={{
            duration: 18 + i * 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.8,
          }}
        />
      ))}

      {/* Glass panels — using filter:blur instead of backdrop-filter:blur for performance */}
      {GLASS_PANELS.map((p, i) => (
        <motion.div
          key={`panel-${i}`}
          className="absolute pointer-events-none rounded-2xl will-change-transform"
          style={{
            width: p.w,
            height: p.h,
            left: `${p.x * 100}%`,
            top: `${p.y * 100}%`,
            rotate: `${p.rotate}deg`,
            background: `rgba(255, 255, 255, ${p.alpha})`,
            filter: `blur(${p.blur}px)`,
            border: `1px solid rgba(255, 255, 255, ${p.alpha * 1.5})`,
          }}
          animate={{
            x: [p.driftX, p.driftX + 25, p.driftX - 15, p.driftX],
            y: [p.driftY, p.driftY - 30, p.driftY + 20, p.driftY],
            opacity: [p.alpha * 10, p.alpha * 12, p.alpha * 8, p.alpha * 10],
          }}
          transition={{
            duration: 25 + i * 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 1.5,
          }}
        />
      ))}

      {/* Decorative circles */}
      {DECORATIVE_SHAPES.map((s, i) => (
        <motion.div
          key={`shape-${i}`}
          className="absolute pointer-events-none will-change-transform"
          style={{
            width: s.size,
            height: s.size,
            left: `${s.x * 100}%`,
            top: `${s.y * 100}%`,
            borderRadius: "50%",
            background: `rgba(251, 191, 36, ${s.alpha * 0.5})`,
            filter: `blur(${s.blur}px)`,
            border: `1px solid rgba(251, 191, 36, ${s.alpha * 0.6})`,
          }}
          animate={{
            scale: [1, 1.12, 0.92, 1],
            opacity: [s.alpha * 10, s.alpha * 13, s.alpha * 8, s.alpha * 10],
          }}
          transition={{
            duration: 10 + i * 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.8,
          }}
        />
      ))}

      {/* Single radial spotlight instead of multiple light effects */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(ellipse, rgba(251,191,36,0.025) 0%, transparent 70%)",
        }}
      />

      {/* One glass accent line instead of two */}
      <div className="absolute top-2/3 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/4 to-transparent" />
    </div>
  );
}
