import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ActivitySquare, FileAudio, BrainCircuit } from 'lucide-react'

const phrases = [
  "Extraction de l'empreinte vocale...",
  "Analyse des fréquences audio...",
  "Recherche de traces synthétiques...",
  "Comparaison avec les modèles d'IA...",
  "Génération du rapport final..."
]

export default function AnalysisLoader({ file }) {
  const [phraseIndex, setPhraseIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % phrases.length)
    }, 900) // Change phrase every 0.9s (total ~4.5s simulation)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="w-full flex flex-col items-center justify-center p-12 bg-white/80 backdrop-blur-md shadow-xl rounded-2xl border border-indigo-100 relative overflow-hidden">
      
      {/* Background AI Grid decoration */}
      <div className="absolute inset-0 opacity-[0.02] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdHRoIGQ9Ik0gNDAgMCBMIDAgMCAwIDQwIiBmaWxsPSJub25lIiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] pointer-events-none" />

      {/* Main Icon */}
      <motion.div 
        className="relative mb-8 z-10"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="absolute inset-0 bg-indigo-500 rounded-full blur-[30px] opacity-20" />
        <div className="relative bg-white border border-indigo-200 p-6 rounded-full shadow-lg">
          <BrainCircuit className="w-12 h-12 text-indigo-600 animate-pulse" />
        </div>
      </motion.div>

      {/* File Info */}
      <div className="text-center mb-8 w-full z-10">
        <div className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-lg mb-6 shadow-sm">
          <FileAudio className="w-4 h-4 text-indigo-500" />
          <span className="text-indigo-900 font-medium text-sm truncate max-w-[200px]">
            {file?.name || "audio_sample.wav"}
          </span>
        </div>
      </div>

      {/* Progress Bar Container */}
      <div className="w-full max-w-md bg-slate-100 rounded-full h-3 mb-6 overflow-hidden border border-slate-200 z-10 shadow-inner">
        <motion.div 
          className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 4.5, ease: "linear" }}
        />
      </div>

      {/* Dynamic Text */}
      <div className="h-6 flex items-center justify-center z-10">
        <motion.div
          key={phraseIndex}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          className="flex items-center gap-2 text-slate-700 font-semibold text-sm"
        >
          <ActivitySquare className="w-4 h-4 animate-pulse text-cyan-500" />
          {phrases[phraseIndex]}
        </motion.div>
      </div>

    </div>
  )
}
