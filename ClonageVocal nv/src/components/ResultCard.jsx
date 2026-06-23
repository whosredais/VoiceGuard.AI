import { motion } from 'framer-motion'
import { ShieldCheck, AlertOctagon, RefreshCcw, FileAudio } from 'lucide-react'

export default function ResultCard({ result, onReset }) {
  if (!result) return null

  const { isDeepfake, confidence, fileName } = result
  
  return (
    <div className={`w-full p-8 md:p-10 rounded-2xl shadow-xl border-2 flex flex-col items-center relative overflow-hidden ${
      isDeepfake 
        ? 'bg-red-50/80 border-red-500 shadow-red-500/20' 
        : 'bg-emerald-50/80 border-emerald-500 shadow-emerald-500/20'
    }`}>
      
      {/* Background Tech Pattern Overlay - very subtle */}
      <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdHRoIGQ9Ik0gNDAgMCBMIDAgMCAwIDQwIiBmaWxsPSJub25lIiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] pointer-events-none" />

      {/* Header */}
      <div className={`w-full flex justify-between items-center mb-8 border-b pb-4 z-10 ${isDeepfake ? 'border-red-200' : 'border-emerald-200'}`}>
        <div className="flex items-center gap-3">
          <FileAudio className={`w-5 h-5 ${isDeepfake ? 'text-red-400' : 'text-emerald-500'}`} />
          <span className={`font-medium text-sm truncate max-w-[200px] md:max-w-xs ${isDeepfake ? 'text-red-900' : 'text-emerald-900'}`}>{fileName}</span>
        </div>
        <button 
          onClick={onReset}
          className={`flex items-center gap-2 text-sm transition-colors px-3 py-1.5 rounded-md border ${
            isDeepfake 
              ? 'text-red-700 hover:bg-red-100 border-transparent hover:border-red-200' 
              : 'text-emerald-700 hover:bg-emerald-100 border-transparent hover:border-emerald-200'
          }`}
        >
          <RefreshCcw className="w-4 h-4" />
          Nouvelle Analyse
        </button>
      </div>

      {/* Main Result Icon */}
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-lg z-10 ${
          isDeepfake ? 'bg-red-500 text-white border-4 border-red-200' : 'bg-emerald-500 text-white border-4 border-emerald-200'
        }`}
      >
        {isDeepfake ? (
          <AlertOctagon className="w-12 h-12" />
        ) : (
          <ShieldCheck className="w-12 h-12" />
        )}
      </motion.div>

      {/* Result Text */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center mb-8 z-10"
      >
        <h2 className={`text-3xl md:text-4xl font-extrabold mb-3 tracking-tight ${isDeepfake ? 'text-red-600' : 'text-emerald-600'}`}>
          {isDeepfake ? 'Voix Générée par IA' : 'Voix Humaine'}
        </h2>
        <p className={`text-lg max-w-lg mx-auto leading-relaxed ${isDeepfake ? 'text-red-800' : 'text-emerald-800'}`}>
          {isDeepfake 
            ? "Attention : Cet enregistrement audio présente de fortes caractéristiques d'une voix synthétique ou clonée." 
            : "Bonne nouvelle : Cet enregistrement semble totalement naturel. Aucun signe de manipulation ou de génération par IA n'a été détecté."}
        </p>
      </motion.div>

      {/* Confidence Score Bar */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className={`w-full rounded-xl p-6 border z-10 ${
          isDeepfake ? 'bg-white/60 border-red-200' : 'bg-white/60 border-emerald-200'
        }`}
      >
        <div className="flex justify-between items-end mb-3">
          <span className={`font-semibold text-sm uppercase tracking-wider ${isDeepfake ? 'text-red-900' : 'text-emerald-900'}`}>
            Certitude du modèle
          </span>
          <div className={`text-3xl font-black ${isDeepfake ? 'text-red-600' : 'text-emerald-600'}`}>
            {confidence}%
          </div>
        </div>
        
        <div className={`w-full h-3 rounded-full overflow-hidden ${isDeepfake ? 'bg-red-200' : 'bg-emerald-200'}`}>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${confidence}%` }}
            transition={{ delay: 0.6, duration: 1.2, ease: "easeOut" }}
            className={`h-full rounded-full ${isDeepfake ? 'bg-red-600' : 'bg-emerald-600'}`}
          />
        </div>
      </motion.div>

    </div>
  )
}
