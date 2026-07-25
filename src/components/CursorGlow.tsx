import { useEffect, useRef } from "react";

export default function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const glow = glowRef.current;
    if (!glow) return;

    let mouseX = -200;
    let mouseY = -200;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      // Use CSS transform with smooth transition instead of RAF lerp
      glow!.style.transform = `translate(${mouseX - 150}px, ${mouseY - 150}px)`;
      glow!.style.opacity = "1";
    };

    const onMouseLeave = () => {
      glow!.style.opacity = "0";
      // Move off-screen after fading
      setTimeout(() => {
        glow!.style.transform = "translate(-200px, -200px)";
      }, 500);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return (
    <div
      ref={glowRef}
      className="fixed top-0 left-0 w-[300px] h-[300px] rounded-full pointer-events-none z-[0] opacity-0"
      style={{
        background:
          "radial-gradient(circle, rgba(251,191,36,0.06) 0%, rgba(251,191,36,0.02) 40%, transparent 70%)",
        transition: "opacity 0.5s ease, transform 0.3s ease-out",
      }}
    />
  );
}
