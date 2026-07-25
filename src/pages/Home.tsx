import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Link } from "wouter";
import { Timer, BookOpen, Search, ArrowRight, Sparkles } from "lucide-react";
import GlassCard from "../components/GlassCard";
import ZenQuotes from "../components/ZenQuotes";
import SessionStats from "../components/SessionStats";

const FEATURES = [
  {
    icon: Timer,
    title: "Meditate",
    desc: "Set a timer with ambient sounds — rain, ocean, forest, and more. Find your stillness.",
    color: "rgba(251, 191, 36, 0.3)",
    link: "/meditate",
  },
  {
    icon: BookOpen,
    title: "Journal",
    desc: "Write daily entries, track your mood, and build a streak. Your private space.",
    color: "rgba(96, 165, 250, 0.3)",
    link: "/journal",
  },
  {
    icon: Search,
    title: "Archive",
    desc: "Search through your history by keyword or mood. Reflect on your journey.",
    color: "rgba(74, 222, 128, 0.3)",
    link: "/search",
  },
];

const staggerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.1 + i * 0.15,
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.8], [1, 0.95]);
  const heroY = useTransform(scrollYProgress, [0, 0.8], [0, -50]);

  return (
    <div className="min-h-screen">
      {/* ─── Hero Section ─── */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6"
      >
        <motion.div
          style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
          className="text-center max-w-3xl mx-auto"
        >
          {/* Decorative element */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="mb-8"
          >
            <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-xs text-amber-400/70 tracking-wider">
              <Sparkles size={12} />
              <span>Begin your practice</span>
            </div>
          </motion.div>

          {/* Main title */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-7xl sm:text-8xl md:text-9xl font-light tracking-[0.15em] text-white mb-6"
          >
            STILL
          </motion.h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-lg sm:text-xl text-gray-400 font-light tracking-wide max-w-xl mx-auto leading-relaxed"
          >
            A quiet space for meditation and journaling.
            <br />
            <span className="text-gray-500">Pause. Breathe. Reflect.</span>
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/meditate"
              className="glass glass-hover px-8 py-3.5 rounded-xl text-sm font-medium text-white border border-amber-500/20 transition-all duration-300 flex items-center gap-2 group"
            >
              Begin Meditating
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/journal"
              className="glass glass-hover px-8 py-3.5 rounded-xl text-sm font-medium text-gray-300 transition-all duration-300"
            >
              Write in Journal
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-6 h-10 rounded-full border border-white/10 flex items-start justify-center p-1.5">
            <motion.div className="w-1 h-2 rounded-full bg-amber-500/50" />
          </div>
        </motion.div>
      </section>

      {/* ─── Features Section ─── */}
      <section ref={featuresRef} className="px-4 sm:px-6 pb-32">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-2xl sm:text-3xl font-light text-white tracking-wider mb-3">
              The Practice
            </h2>
            <div className="w-12 h-[1px] bg-amber-500/30 mx-auto" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {FEATURES.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  variants={staggerVariants}
                >
                  <Link href={feature.link}>
                    <GlassCard glow className="h-full group cursor-pointer">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110"
                        style={{
                          background: `linear-gradient(135deg, ${feature.color}, transparent)`,
                          boxShadow: `0 0 20px ${feature.color}20`,
                        }}
                      >
                        <Icon size={22} className="text-white/80" />
                      </div>
                      <h3 className="text-lg font-medium text-white mb-2 tracking-wide">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-gray-400 leading-relaxed">
                        {feature.desc}
                      </p>
                    </GlassCard>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Session Stats ─── */}
      <section className="px-4 sm:px-6 pb-20">
        <div className="max-w-3xl mx-auto">
          <SessionStats />
        </div>
      </section>

      {/* ─── Zen Quotes ─── */}
      <section className="px-4 sm:px-6 pb-32">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="max-w-2xl mx-auto"
        >
          <ZenQuotes />
        </motion.div>
      </section>
    </div>
  );
}
