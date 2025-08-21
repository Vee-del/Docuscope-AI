// src/pages/AnalyzePage.jsx
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Upload, BarChart2 } from "lucide-react";

export default function AnalyzePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white flex flex-col items-center justify-center px-6">
      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-bold mb-6 text-center bg-gradient-to-r from-blue-400 to-teal-300 bg-clip-text text-transparent"
      >
        Docuscope AI – Smart Document Analyzer
      </motion.h1>

      {/* Card container */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-lg"
      >
        <div className="bg-gray-800/80 backdrop-blur-md border border-gray-700 rounded-2xl shadow-xl p-6 flex flex-col items-center space-y-6">
          {/* Upload Section */}
          <div className="w-full flex flex-col items-center space-y-3">
            <Upload className="w-12 h-12 text-blue-400" />
            <p className="text-lg text-gray-300">
              Upload your document to begin analysis
            </p>
            <input
              type="file"
              className="file:bg-blue-500 file:text-white file:rounded-xl file:px-4 file:py-2 file:border-none hover:file:bg-blue-600 cursor-pointer text-gray-300"
            />
          </div>

          {/* Analyze Button */}
          <button
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-teal-400 hover:from-blue-600 hover:to-teal-500 rounded-xl py-3 text-lg shadow-lg transition-all"
          >
            <BarChart2 className="w-5 h-5" />
            Analyze Document
          </button>
        </div>
      </motion.div>
    </div>
  );
}
