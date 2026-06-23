import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BrainCircuit, AlertCircle } from 'lucide-react'
import Hero from './components/Hero'
import UploadArea from './components/UploadArea'
import AnalysisLoader from './components/AnalysisLoader'
import ResultCard from './components/ResultCard'
import { analyzeAudio } from './api'

function App() {
  const [status, setStatus] = useState('idle') // 'idle', 'uploading', 'analyzing', 'result', 'error'
  const [file, setFile] = useState(null)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const handleUpload = async (uploadedFile) => {
    setFile(uploadedFile)
    setError(null)
    setStatus('analyzing')

    try {
      // Appel réel au backend Spring Boot → Python IA
      const data = await analyzeAudio(uploadedFile)

      // Mapping de la réponse backend vers le format attendu par ResultCard
      // Backend retourne : { filename, score (logit brut), prediction ("SPOOF"/"BONAFIDE") }
      // Frontend attend :  { isDeepfake, confidence, fileName }
      //
      // Le score est un LOGIT brut (ex: 5.91, -3.2), pas un pourcentage.
      // - score < 0 → SPOOF (deepfake)
      // - score >= 0 → BONAFIDE (humain)
      // On utilise sigmoid pour convertir en probabilité [0-100%]
      const rawScore = data.score ?? 0
      const sigmoid = 1 / (1 + Math.exp(-rawScore)) // sigmoid = P(bonafide/humain)
      const isDeepfake = data.prediction?.toUpperCase() === 'SPOOF'
      // Si SPOOF → certitude = 1 - sigmoid (= P(spoof))
      // Si BONAFIDE → certitude = sigmoid (= P(bonafide))
      const confidence = Math.round((isDeepfake ? (1 - sigmoid) : sigmoid) * 100)

      setResult({
        isDeepfake,
        confidence,
        fileName: data.filename || uploadedFile.name,
      })
      setStatus('result')
    } catch (err) {
      console.error('Erreur lors de l\'analyse:', err)
      setError(err.message || 'Une erreur est survenue lors de l\'analyse.')
      setStatus('error')
    }
  }

  const resetApp = () => {
    setFile(null)
    setResult(null)
    setError(null)
    setStatus('idle')
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 relative overflow-hidden">
      
      {/* Background dynamique TRES VISIBLE (flux technologique et orbes néon) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute inset-[-50%] tech-grid opacity-100" />
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
      </div>

      {/* Navbar */}
      <nav className="w-full bg-white/80 backdrop-blur-xl px-6 py-4 flex justify-between items-center shadow-md z-10 border-b border-indigo-200">
        <div className="flex items-center gap-2 cursor-pointer" onClick={resetApp}>
          <div className="bg-gradient-to-r from-indigo-600 to-cyan-500 p-2 rounded-lg shadow-lg">
            <BrainCircuit className="w-6 h-6 text-white animate-pulse" />
          </div>
          <span className="text-2xl font-black text-slate-800 tracking-tight ml-2">DeepVoice<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500">Scanner</span></span>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 z-10 w-full max-w-5xl mx-auto">
        <AnimatePresence mode="wait">
          
          {status === 'idle' && (
            <motion.div 
              key="hero"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="w-full flex flex-col items-center"
            >
              <Hero onStart={() => setStatus('uploading')} />
            </motion.div>
          )}

          {status === 'uploading' && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="w-full max-w-2xl"
            >
              <UploadArea onUpload={handleUpload} onCancel={resetApp} />
            </motion.div>
          )}

          {status === 'analyzing' && (
            <motion.div
              key="analyze"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-xl"
            >
              <AnalysisLoader file={file} />
            </motion.div>
          )}

          {status === 'result' && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-2xl"
            >
              <ResultCard result={result} onReset={resetApp} />
            </motion.div>
          )}

          {status === 'error' && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-2xl"
            >
              <div className="w-full p-8 md:p-10 rounded-2xl shadow-xl border-2 bg-red-50/80 border-red-400 shadow-red-400/20 flex flex-col items-center">
                <div className="bg-red-100 p-5 rounded-full mb-5 shadow-inner">
                  <AlertCircle className="w-12 h-12 text-red-600" />
                </div>
                <h2 className="text-2xl font-extrabold text-red-700 mb-3">Erreur d'Analyse</h2>
                <p className="text-red-800 text-center mb-6 max-w-md leading-relaxed">
                  {error}
                </p>
                <p className="text-red-600/70 text-sm text-center mb-6 max-w-md">
                  Vérifiez que le backend Spring Boot (port 8080) et le microservice Python (port 8000) sont bien lancés.
                </p>
                <button
                  onClick={resetApp}
                  className="px-6 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors shadow-lg"
                >
                  Réessayer
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>
    </div>
  )
}

export default App
