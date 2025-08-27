// src/pages/AnalyzePage.jsx
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Upload, BarChart2, CheckCircle2 } from "lucide-react";

export default function AnalyzePage() {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const inputRef = useRef();
  const [analysisResult, setAnalysisResult] = useState(null);


  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setAnalyzed(false);
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
    }
  };

  const handleAnalyze = async () => {
  if (!file) return;

  setAnalyzing(true);
  setAnalyzed(false);

  let formData = new FormData();
  formData.append("file", file);


  try {
    const response = await fetch("/api/analyze-doc/", {
      method: "POST",
      body: formData,
    });

    let result;
    try {
      result = await response.json();
    } catch {
      throw new Error("Server did not return JSON. Check backend logs.");
    }

    if (response.ok) {
      setAnalyzed(true);
      setAnalysisResult(result); // store backend result
    } else {
      alert(result.error || result.detail || "Analysis failed");
    }
  } catch (err) {
    alert("Server error: " + err.message);
  } finally {
    setAnalyzing(false);
  }
};


  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
      {/* Animated blurred background */}
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          background:
            "radial-gradient(ellipse at 70% 30%, #38bdf8 0%, #818cf8 40%, #f472b6 100%)",
          filter: "blur(90px)",
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
        Upload or drag your document to instantly receive summaries, sentiment
        insights, entity extraction, and more — powered by AI.
      </motion.p>

      {/* Card */}
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="relative z-10 w-full max-w-xl mt-6"
      >
        <div className="bg-white/10 backdrop-blur-2xl border border-white/20 
                        rounded-3xl shadow-2xl p-6 flex flex-col items-center space-y-6">
          {/* Drag & Drop Upload */}
          <form
            className={`w-full flex flex-col items-center space-y-3 border-2 ${
              dragActive
                ? "border-fuchsia-400 bg-fuchsia-400/10"
                : "border-dashed border-blue-400"
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

          {/* Analysis Result (demo) */}
          <AnimatePresence>
  {analysisResult && (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="w-full bg-white/20 backdrop-blur rounded-xl p-4 mt-4 text-white shadow"
  >
    <h3 className="font-bold text-lg mb-2">Analysis Result</h3>
    <p><span className="font-semibold">Summary:</span> {analysisResult.summary}</p>
    <p><span className="font-semibold">Categories:</span> {analysisResult.categories}</p>
    <p><span className="font-semibold">Sentiment:</span> {analysisResult.sentiment}</p>
    <p><span className="font-semibold">Key Phrases:</span> {analysisResult.key_phrases}</p>
  </motion.div>
)}

</AnimatePresence>

        </div>
      </motion.div>
    </div>
  );
}