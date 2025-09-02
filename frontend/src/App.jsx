import { Routes, Route } from "react-router-dom";
import AnalyzePage from "./pages/AnalyzePage";

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-black text-slate-100 flex flex-col">
      <header className="px-6 py-6 text-center sticky top-0 bg-black/30 backdrop-blur border-b border-white/10">
        
        
      </header>

      <main className="flex-grow">
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
