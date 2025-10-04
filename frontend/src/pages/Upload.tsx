import React, { useState } from "react";
import { motion } from "framer-motion";

export default function Upload() {
  const [fileName, setFileName] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    if (!event.target.files?.length) return;
    const file = event.target.files[0];
    setFileName(file.name);

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      const response = await fetch("http://localhost:8000/analyze", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center text-white px-4 overflow-hidden">
      {/* === Local Video Background === */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover -z-20"
      >
        <source src="/background.mp4" type="video/mp4" />
      </video>
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 -z-10"></div>

      {/* === Title === */}
      <motion.h1
        className="text-6xl font-extrabold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent mb-3 drop-shadow-lg"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        TrueView
      </motion.h1>

      <motion.p
        className="text-gray-300 mb-12 text-center text-lg tracking-wide"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        Upload any media to verify its authenticity.
      </motion.p>

      {/* === Upload Box === */}
      <motion.div
        className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-xl p-10 w-full max-w-lg text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-400 rounded-xl py-10 cursor-pointer hover:border-purple-400 transition">
          <input
            type="file"
            onChange={handleUpload}
            className="hidden"
            id="fileInput"
          />
          <p className="text-gray-300 mb-4 text-sm">
            {fileName ? fileName : "Drag & drop a file or click to upload"}
          </p>
          <label
            htmlFor="fileInput"
            className="mt-2 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600
                       text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-purple-500/50 transition"
          >
            {loading ? "Analyzing..." : "Upload File"}
          </label>
        </label>
      </motion.div>

      {/* === Results === */}
      {result && (
        <motion.div
          className="mt-12 backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl shadow-lg p-6 w-full max-w-lg text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-purple-300 mb-4">
            Analysis Result
          </h2>
          <p className="text-gray-300 mb-2">
            <span className="font-semibold">File:</span> {result.filename}
          </p>
          <p className="text-gray-300 mb-2">
            <span className="font-semibold">Size:</span> {result.size} bytes
          </p>
          <p className="text-green-400 font-semibold mt-2">
            Status: {result.status}
          </p>
        </motion.div>
      )}

      {/* === Footer === */}
      <p className="mt-20 text-gray-400 text-sm">
        © 2025 TrueView — Built for the Trust & Integrity Hackathon
      </p>
    </div>
  );
}
