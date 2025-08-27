import { Routes, Route } from "react-router-dom";
import AnalyzePage from "./pages/AnalyzePage";

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-black text-slate-100 flex flex-col">
      <header className="px-6 py-6 text-center sticky top-0 bg-black/30 backdrop-blur border-b border-white/10">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-400">
            DocuScope AI
          </span>
        </h1>
        <p className="text-slate-300 mt-1">An AI-powered document analysis tool that parses your documents and provides insights.</p>
      </header>

      <main className="flex-1 w-full max-w-6xl mx-auto p-6 md:p-10">
        <Routes>
          <Route path="/" element={<AnalyzePage />} />
        </Routes>
      </main>

      <footer className="text-center text-xs text-slate-400 py-10">
        © {new Date().getFullYear()} DocuScope AI
      </footer>
    </div>
  );
}
