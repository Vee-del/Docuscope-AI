import { Routes, Route } from "react-router-dom";
import AnalyzePage from "./pages/AnalyzePage";

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex flex-col items-center p-8">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold text-cyan-400 drop-shadow-lg">
          Docuscope AI
        </h1>
        <p className="text-gray-300 mt-2">AI-powered document analysis</p>
      </header>

      <main className="w-full max-w-3xl bg-gray-800/60 rounded-2xl shadow-lg p-6 backdrop-blur-lg border border-gray-700">
        <Routes>
          <Route path="/" element={<AnalyzePage />} />
        </Routes>
      </main>
    </div>
  );
}
