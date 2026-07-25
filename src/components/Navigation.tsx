import { useLocation, Link } from "wouter";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Home, BookOpen, Search, Timer as TimerIcon } from "lucide-react";

const NAV_ITEMS = [
  { path: "/", label: "Home", icon: Home },
  { path: "/meditate", label: "Meditate", icon: TimerIcon },
  { path: "/journal", label: "Journal", icon: BookOpen },
  { path: "/search", label: "Search", icon: Search },
];

export default function Navigation() {
  const [location] = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-black/60 backdrop-blur-xl border-b border-white/[0.06]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-lg sm:text-xl font-bold tracking-widest text-white">
              STILL
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500/80 group-hover:bg-amber-400 transition-colors" />
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-1 sm:gap-2">
            {NAV_ITEMS.map((item) => {
              const isActive = location === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className="relative px-3 py-2 rounded-xl transition-all duration-200"
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-xl bg-white/[0.06] border border-amber-500/20"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative flex items-center gap-1.5 text-sm">
                    <Icon
                      size={16}
                      className={`transition-colors ${
                        isActive ? "text-amber-400" : "text-gray-400 group-hover:text-white"
                      }`}
                    />
                    <span
                      className={`hidden sm:inline transition-colors ${
                        isActive ? "text-white" : "text-gray-400"
                      }`}
                    >
                      {item.label}
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
