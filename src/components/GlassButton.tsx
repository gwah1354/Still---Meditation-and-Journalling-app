import { type ReactNode, useRef, useState } from "react";
import { motion } from "framer-motion";

interface GlassButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: "default" | "primary" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  disabled?: boolean;
  active?: boolean;
  type?: "button" | "submit";
}

export default function GlassButton({
  children,
  onClick,
  variant = "default",
  size = "md",
  className = "",
  disabled = false,
  active = false,
  type = "button",
}: GlassButtonProps) {
  const [shimmerX, setShimmerX] = useState(0);
  const [shimmerY, setShimmerY] = useState(0);
  const [showShimmer, setShowShimmer] = useState(false);
  const ref = useRef<HTMLButtonElement>(null);

  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-7 py-3.5 text-base",
  };

  const variantStyles = {
    default: `
      glass glass-hover
      ${active ? "bg-white/10 border-amber-500/30 shadow-[0_0_20px_rgba(251,191,36,0.1)]" : ""}
    `,
    primary: `
      bg-amber-500/15 border-amber-500/30 text-amber-300
      hover:bg-amber-500/25 hover:border-amber-500/50
      shadow-[0_0_25px_rgba(251,191,36,0.1)]
    `,
    ghost: "bg-transparent border-transparent hover:bg-white/5",
  };

  return (
    <motion.button
      ref={ref}
      type={type}
      onClick={onClick}
      disabled={disabled}
      onMouseMove={(e) => {
        const rect = ref.current?.getBoundingClientRect();
        if (rect) {
          setShimmerX(e.clientX - rect.left);
          setShimmerY(e.clientY - rect.top);
        }
      }}
      onMouseEnter={() => setShowShimmer(true)}
      onMouseLeave={() => setShowShimmer(false)}
      whileTap={disabled ? undefined : { scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className={`
        relative overflow-hidden rounded-xl border font-medium
        transition-colors duration-200
        disabled:opacity-40 disabled:cursor-not-allowed
        ${sizeStyles[size]}
        ${variantStyles[variant]}
        ${className}
      `}
    >
      {/* Shimmer effect on hover */}
      {showShimmer && variant !== "ghost" && (
        <motion.span
          className="absolute pointer-events-none w-32 h-32 rounded-full bg-white/[0.06] blur-xl"
          style={{
            left: shimmerX - 64,
            top: shimmerY - 64,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      )}
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </motion.button>
  );
}
