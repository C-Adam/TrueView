import React, { useState } from "react";
import { motion } from "framer-motion";

export default function Upload() {
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    if (!event.target.files?.length) return;
    const file = event.target.files[0];
    setFileName(file.name);

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      await fetch("http://localhost:8000/analyze", {
        method: "POST",
        body: formData,
      });
      // We are intentionally not setting result — no messages shown
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f9f9fb] text-gray-800 px-4">
      {/* Title */}
      <motion.h1
        className="text-5xl font-extrabold text-[#6C63FF] mb-2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        TrueView
      </motion.h1>
      <p className="text-gray-500 mb-10 text-center text-lg">
        See the truth behind every frame.
      </p>

      {/* Upload Box */}
      <motion.div
        className="bg-white border border-gray-200 rounded-2xl shadow-lg p-8 w-full max-w-lg text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl py-10 cursor-pointer hover:border-[#6C63FF] transition">
          <input
            type="file"
            onChange={handleUpload}
            className="hidden"
            id="fileInput"
          />
          <p className="text-gray-400 mb-2">
            {fileName ? fileName : "Drag & drop a file or click to upload"}
          </p>
          <label
            htmlFor="fileInput"
            className="mt-3 bg-[#6C63FF] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#5b54e5] transition"
          >
            {loading ? "Analyzing..." : "Upload File"}
          </label>
        </label>
      </motion.div>

      {/* Footer */}
      <p className="mt-16 text-gray-400 text-sm">
        Created for the Trust & Integrity Hackathon · 2025
      </p>
    </div>
  );
}
