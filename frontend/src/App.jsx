import { Routes, Route, Link } from "react-router-dom";
/* eslint-disable-next-line no-unused-vars*/
import { motion } from "framer-motion";
import AnalyzePage from "./pages/AnalyzePage";
import { BrainCircuit } from "lucide-react";

export default function App() {
  return (
    <div className="relative min-h-screen flex flex-col text-slate-100 overflow-hidden">
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0 -z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          background:
            "linear-gradient(135deg, #0f172a 0%, #1e3a8a 40%, #7e22ce 100%)",
        }}
      />

      {/* Floating overlay for texture */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.1),transparent_70%)]" />

      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between sticky top-0 bg-black/40 backdrop-blur-xl border-b border-white/10 z-20">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg">
          <BrainCircuit className="w-6 h-6 text-violet-400" />
          <span>DocuScope AI</span>
        </Link>
        <nav className="flex gap-6 text-sm text-slate-300">
          <Link to="/" className="hover:text-violet-400 transition">
            Analyze
          </Link>
          <a
            href="https://github.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-violet-400 transition"
          >
            GitHub
          </a>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-grow px-6 py-10">
        <Routes>
          <Route path="/" element={<AnalyzePage />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-slate-400 py-6 border-t border-white/10">
        © {new Date().getFullYear()} DocuScope AI · Built with ❤️ and AI
      </footer>
    </div>
  );
}