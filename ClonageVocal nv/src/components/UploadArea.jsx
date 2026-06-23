import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { CloudUpload, FileAudio, X, AlertCircle } from 'lucide-react'

export default function UploadArea({ onUpload, onCancel }) {
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState(null)
  const fileInputRef = useRef(null)

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const validateAndUpload = (file) => {
    setError(null)
    if (!file) return

    const validTypes = ['audio/wav', 'audio/x-wav', 'audio/flac', 'audio/mpeg', 'audio/mp3']
    if (!validTypes.includes(file.type) && !file.name.match(/\.(wav|flac|mp3)$/i)) {
      setError('Format de fichier invalide. Veuillez importer un fichier .flac ou .wav.')
      return
    }

    if (file.size > 20 * 1024 * 1024) { // 20MB limit
      setError('La taille du fichier dépasse la limite de 20MB.')
      return
    }

    onUpload(file)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const files = e.dataTransfer.files
    if (files.length > 0) {
      validateAndUpload(files[0])
    }
  }

  const handleFileChange = (e) => {
    const files = e.target.files
    if (files.length > 0) {
      validateAndUpload(files[0])
    }
  }

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <FileAudio className="text-indigo-500" />
          Sélectionner un fichier audio
        </h2>
        <button 
          onClick={onCancel}
          className="p-2 rounded-full hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <motion.div
        className={`relative w-full p-16 rounded-2xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center cursor-pointer shadow-sm ${
          isDragging 
            ? 'border-indigo-500 bg-indigo-50/80 scale-[1.02]' 
            : 'border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50/30 bg-white/60 backdrop-blur-sm'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <input 
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".wav,.flac,.mp3,audio/*"
          className="hidden"
        />
        
        <div className="bg-indigo-100 p-5 rounded-full mb-5 shadow-inner">
          <CloudUpload className="w-12 h-12 text-indigo-600" />
        </div>
        
        <h3 className="text-xl font-semibold text-slate-800 mb-2">
          Glissez un fichier audio ici
        </h3>
        <p className="text-slate-500 text-sm font-medium bg-slate-100 px-3 py-1 rounded-md">
          Formats acceptés : .wav, .flac, .mp3
        </p>

      </motion.div>

      {error && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-red-600 bg-red-50 p-4 rounded-xl border border-red-200 shadow-sm"
        >
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </motion.div>
      )}
    </div>
  )
}
