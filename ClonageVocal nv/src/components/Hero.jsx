import { motion } from 'framer-motion'
import { Brain, ArrowRight } from 'lucide-react'

export default function Hero({ onStart }) {
  return (
    <div className="flex flex-col items-center text-center space-y-8 py-12">
      
      {/* Badge */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="px-4 py-1.5 rounded-full border border-indigo-200 bg-indigo-50 text-indigo-700 text-sm font-medium flex items-center gap-2 shadow-sm"
      >
        <Brain className="w-4 h-4" />
        <span>Propulsé par l'Intelligence Artificielle</span>
      </motion.div>

      {/* Main Title */}
      <motion.h1 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-800 max-w-4xl leading-tight"
      >
        Vérification <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500">d'Authenticité Vocale</span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-lg md:text-xl text-slate-600 max-w-3xl leading-relaxed"
      >
        Détectez instantanément les voix générées par Intelligence Artificielle. Un outil simple et rapide pour vérifier si un enregistrement audio est authentique ou s'il s'agit d'un deepfake.
      </motion.p>

      {/* CTA Button */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onStart}
        className="mt-8 group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-semibold rounded-xl text-lg transition-all shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-300"
      >
        <span>Analyser un enregistrement</span>
        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </motion.button>
      
    </div>
  )
}
