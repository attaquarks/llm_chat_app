import { motion } from 'framer-motion';

export function TypingIndicator({ className = '' }) {
  const dotVariants = {
    initial: { y: 0 },
    animate: { y: -10 },
  };

  const containerVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: {
        duration: 0.2,
        ease: "easeIn"
      }
    }
  };

  return (
    <motion.div
      className={`flex justify-start mb-4 ${className}`}
      variants={containerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="gradient-ai-bubble text-white max-w-[80%] rounded-2xl px-4 py-3 shadow-lg backdrop-blur-sm mr-auto rounded-bl-md">
        <div className="flex items-center gap-2">
          <div className="text-xs text-white/80 font-medium">AI is thinking</div>
          <div className="flex items-center gap-1">
            {[0, 1, 2].map((index) => (
              <motion.div
                key={index}
                className="w-2 h-2 bg-white/60 rounded-full"
                variants={dotVariants}
                animate="animate"
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut",
                  delay: index * 0.2,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}