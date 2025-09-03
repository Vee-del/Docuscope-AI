// src/pages/AnalyzePage.jsx
/* eslint-disable-next-line no-unused-vars*/
import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Upload, FileText, BarChart2, CheckCircle2, AlertCircle } from "lucide-react";

export default function AnalyzePage() {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);
  const inputRef = useRef();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setAnalyzed(false);
    setError(null);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setAnalyzed(false);
      setError(null);
    }
  };

  const handleAnalyze = async () => {
    if (!file) {
      setError("Please select a file first.");
      return;
    }

    setAnalyzing(true);
    setAnalyzed(false);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://127.0.0.1:8000/analyze/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error: ${errorText}`);
      }

      const data = await response.json();
      setAnalysisResult(data);
      setAnalyzed(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
      {/* Gradient Background */}
      <motion.div
        className="absolute inset-0 -z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 40%, #7e22ce 100%)",
        }}
      />

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 text-6xl md:text-7xl font-extrabold text-center 
                   bg-gradient-to-r from-blue-400 via-fuchsia-400 to-pink-400 
                   bg-clip-text drop-shadow-xl"
      >
        DOCUSCOPE AI
      </motion.h1>

      {/* Subtitle */}
      <motion.h2
        className="relative z-10 text-2xl md:text-3xl font-bold 
                   bg-gradient-to-r from-cyan-300 via-blue-300 to-pink-400 
                   bg-clip-text text-black drop-shadow mt-1"
      >
        AI-powered Document Analysis
      </motion.h2>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9, delay: 0.3 }}
        className="relative z-10 mt-3 max-w-2xl text-center text-base md:text-lg text-white/80"
      >
        Upload or drag your document to receive{" "}
        <span className="text-cyan-300">summaries</span>,{" "}
        <span className="text-fuchsia-300">sentiment insights</span>,{" "}
        <span className="text-blue-300">key phrases</span>, and more — powered by AI.
      </motion.p>

      {/* Upload & Analyze Card */}
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="relative z-10 w-full max-w-xl mt-6"
      >
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 
                        rounded-3xl shadow-2xl p-6 flex flex-col items-center space-y-6">
          {/* Drag & Drop Upload */}
          <form
            className={`w-full flex flex-col items-center space-y-3 border-2 ${
              dragActive
                ? "border-fuchsia-400 bg-fuchsia-400/10"
                : "border-dashed border-blue-400/50"
            } rounded-2xl p-5 transition-all duration-200`}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={() => inputRef.current.click()}
            style={{ cursor: "pointer" }}
          >
            <motion.div
              animate={{
                scale: dragActive ? 1.15 : 1,
                rotate: dragActive ? 10 : 0,
                color: dragActive ? "#f472b6" : "#38bdf8",
              }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Upload className="w-14 h-14" />
            </motion.div>
            <p className="text-lg text-white/80">
              {file
                ? `Selected: ${file.name}`
                : dragActive
                ? "Drop your file here!"
                : "Click or drag a document to upload"}
            </p>
            <input
              ref={inputRef}
              type="file"
              className="hidden"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.txt"
            />
          </form>

          {/* Analyze Button */}
          <motion.button
            whileHover={{
              scale: 1.07,
              boxShadow: "0px 0px 20px rgba(129,140,248,0.6)",
            }}
            whileTap={{ scale: 0.97 }}
            disabled={!file || analyzing}
            onClick={handleAnalyze}
            className={`w-full flex items-center justify-center gap-2 
                        bg-gradient-to-r from-cyan-500 via-blue-500 to-fuchsia-500 
                        hover:from-cyan-600 hover:to-pink-600 
                        rounded-2xl py-3 text-lg font-bold shadow-lg 
                        transition-all duration-200 ${
                          !file || analyzing
                            ? "opacity-60 cursor-not-allowed"
                            : "cursor-pointer"
                        }`}
          >
            {analyzing ? (
              <motion.span
                className="animate-spin"
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1 }}
              >
                <BarChart2 className="w-5 h-5" />
              </motion.span>
            ) : analyzed ? (
              <CheckCircle2 className="w-5 h-5 text-green-400" />
            ) : (
              <BarChart2 className="w-5 h-5" />
            )}
            {analyzing
              ? "Analyzing..."
              : analyzed
              ? "Analysis Complete!"
              : "Analyze Document"}
          </motion.button>

          {/* Error message */}
          {error && (
            <div className="w-full flex items-center gap-2 bg-red-500/20 text-red-300 border border-red-400/50 p-3 rounded-xl mt-4">
              <AlertCircle className="w-5 h-5" />
              {error}
            </div>
          )}

          {/* Analysis Result */}
          <AnimatePresence>
            {analysisResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full bg-slate-900/70 backdrop-blur border border-white/10 rounded-xl p-5 mt-4 text-white shadow-lg"
              >
                <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-violet-300">
                  <FileText className="w-5 h-5" /> Analysis Result
                </h3>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-semibold text-cyan-300">Summary:</span>{" "}
                    {analysisResult.summary || "N/A"}
                  </p>
                  <p>
                    <span className="font-semibold text-cyan-300">Categories:</span>{" "}
                    {Array.isArray(analysisResult.categories)
                      ? analysisResult.categories.join(", ")
                      : analysisResult.categories || "N/A"}
                  </p>
                  <p>
                    <span className="font-semibold text-cyan-300">Key Phrases:</span>{" "}
                    {Array.isArray(analysisResult.key_phrases)
                      ? analysisResult.key_phrases.join(", ")
                      : analysisResult.key_phrases || "N/A"}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}