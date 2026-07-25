import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-md"
      >
        <div className="text-8xl font-light text-white/10 mb-6 tracking-[0.15em]">
          404
        </div>
        <h1 className="text-2xl font-light text-white mb-3 tracking-wider">
          Lost your stillness?
        </h1>
        <p className="text-gray-400 mb-8 text-sm leading-relaxed">
          This page has wandered off. But you can always return to center.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 glass glass-hover px-6 py-3 rounded-xl text-sm text-gray-300 transition-all duration-300"
        >
          <ArrowLeft size={16} />
          Return Home
        </Link>
      </motion.div>
    </div>
  );
}
