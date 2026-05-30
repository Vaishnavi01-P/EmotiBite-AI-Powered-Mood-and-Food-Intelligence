import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Loader2 } from 'lucide-react';

const MoodAnalysis: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="glass-card p-12 text-center"
    >
      {/* Brain Icon */}
      <div className="flex items-center justify-center mb-8">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Brain className="h-16 w-16 text-purple-400" />
        </motion.div>
      </div>

      {/* Title */}
      <h2 className="text-3xl font-bold text-white mb-4">
        Analyzing Your Mood...
      </h2>

      {/* Description */}
      <p className="text-gray-300 text-lg mb-8 max-w-md mx-auto">
        Our AI is processing your emotions and finding the perfect food recommendations
      </p>

      {/* Loading Animation */}
      <div className="flex items-center justify-center space-x-2">
        <motion.div
          className="w-3 h-3 bg-purple-500 rounded-full"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity, delay: 0 }}
        />
        <motion.div
          className="w-3 h-3 bg-purple-500 rounded-full"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
        />
        <motion.div
          className="w-3 h-3 bg-purple-500 rounded-full"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
        />
      </div>

      {/* Processing Steps */}
      <div className="mt-8 space-y-3">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-center space-x-2 text-gray-300"
        >
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Processing emotional context...</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1 }}
          className="flex items-center justify-center space-x-2 text-gray-300"
        >
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Analyzing nutritional needs...</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.5 }}
          className="flex items-center justify-center space-x-2 text-gray-300"
        >
          <Loader2 className="h-4 w-4 animate-spin text-purple-400" />
          <span>Generating recommendations...</span>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default MoodAnalysis;
