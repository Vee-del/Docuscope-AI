import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { API_BASE } from "./config";

export default function App() {
  const [step, setStep] = useState("landing"); // landing | predict
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch(`${API_BASE}/api/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Prediction failed");
      setResult(data.prediction);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
      <AnimatePresence mode="wait">
        {/* 🚀 Landing Section */}
        {step === "landing" && (
          <motion.div
            key="landing"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.6 }}
            className="bg-gray-900 text-white rounded-2xl shadow-xl p-10 max-w-2xl w-full text-center border border-gray-800"
          >
            <motion.h1
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-5xl font-extrabold mb-6 bg-gradient-to-r from-indigo-400 to-purple-500 text-transparent bg-clip-text"
            >
              🚀 Welcome to DocuscopeAI
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-gray-300 mb-8 text-lg"
            >
              AI-powered document intelligence — modern, sleek, and built with
              Tailwind + Framer Motion.
            </motion.p>

            <motion.button
              whileHover={{ scale: 1.1, boxShadow: "0px 0px 15px rgba(99,102,241,0.6)" }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 rounded-xl bg-indigo-600 text-white font-semibold shadow-lg hover:bg-indigo-700 transition text-lg"
              onClick={() => setStep("predict")}
            >
              Try it Now
            </motion.button>
          </motion.div>
        )}

        {/* 📄 Predict Section */}
        {step === "predict" && (
          <motion.div
            key="predict"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5 }}
            className="bg-white text-gray-900 rounded-2xl shadow-xl p-10 max-w-2xl w-full"
          >
            <motion.h2
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="text-3xl font-bold mb-6"
            >
              Paste your document
            </motion.h2>

            <form onSubmit={handleSubmit} className="grid gap-4">
              <motion.textarea
                rows={6}
                className="p-4 border rounded-xl outline-none focus:ring-4 focus:ring-indigo-200"
                placeholder="Paste text to classify..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              />
              <div className="flex gap-3">
                <motion.button
                  type="submit"
                  disabled={busy || !text.trim()}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 disabled:opacity-50"
                >
                  {busy ? "Analyzing..." : "Analyze"}
                </motion.button>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-3 rounded-xl border"
                  onClick={() => {
                    setText("");
                    setResult(null);
                    setError("");
                  }}
                >
                  Reset
                </motion.button>
              </div>
            </form>

            <div className="mt-6">
              <AnimatePresence>
                {error && (
                  <motion.div
                    className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {result && (
                  <motion.div
                    className="mt-4 bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <p className="text-lg">
                      Predicted Category:{" "}
                      <span className="font-bold">{result}</span>
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
