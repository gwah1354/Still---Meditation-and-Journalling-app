import { type ReactNode } from "react";
import { motion } from "framer-motion";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  onClick?: () => void;
}

export default function GlassCard({
  children,
  className = "",
  hover = true,
  glow = false,
  onClick,
}: GlassCardProps) {
  return (
    <motion.div
      onClick={onClick}
      whileHover={hover ? { y: -2, transition: { duration: 0.2 } } : undefined}
      className={`
        glass
        ${hover ? "glass-hover" : ""}
        ${onClick ? "cursor-pointer" : ""}
        ${glow ? "shadow-[0_0_30px_rgba(251,191,36,0.08)]" : ""}
        p-5 sm:p-6
        transition-shadow duration-300
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}
