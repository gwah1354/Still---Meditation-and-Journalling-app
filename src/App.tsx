import { Route, Switch, useLocation } from "wouter";
import { AnimatePresence, motion } from "framer-motion";
import { Toaster } from "sonner";
import Navigation from "./components/Navigation";
import Background from "./components/Background";
import AmbientParticles from "./components/AmbientParticles";
import CursorGlow from "./components/CursorGlow";
import { ThemeProvider } from "./contexts/ThemeContext";
import { useSmoothScroll } from "./hooks/useSmoothScroll";

import Home from "./pages/Home";
import Meditate from "./pages/Meditate";
import Journal from "./pages/Journal";
import Search from "./pages/Search";
import NotFound from "./pages/NotFound";

function PageTransition({ children, path }: { children: React.ReactNode; path: string }) {
  return (
    <motion.div
      key={path}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export default function App() {
  useSmoothScroll();
  const [location] = useLocation();

  return (
    <ThemeProvider>
      {/* Background orbs */}
      <Background />

      {/* Ambient floating particles */}
      <AmbientParticles />

      {/* Cursor glow effect */}
      <CursorGlow />

      {/* Navigation */}
      <Navigation />

      {/* Main content */}
      <main className="relative z-10">
        <AnimatePresence mode="wait">
          <Switch>
            <Route path="/">
              <PageTransition path="/">
                <Home />
              </PageTransition>
            </Route>
            <Route path="/meditate">
              <PageTransition path="/meditate">
                <Meditate />
              </PageTransition>
            </Route>
            <Route path="/journal">
              <PageTransition path="/journal">
                <Journal />
              </PageTransition>
            </Route>
            <Route path="/search">
              <PageTransition path="/search">
                <Search />
              </PageTransition>
            </Route>
            <Route>
              <PageTransition path={location}>
                <NotFound />
              </PageTransition>
            </Route>
          </Switch>
        </AnimatePresence>
      </main>

      {/* Toaster — styled for dark glass look */}
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: "rgba(0,0,0,0.8)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "12px",
            color: "#fff",
            fontSize: "14px",
          },
        }}
      />
    </ThemeProvider>
  );
}
