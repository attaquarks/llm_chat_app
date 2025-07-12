import { motion } from 'framer-motion';
import { formatTimestamp } from '../lib/utils';
import { Bot, User } from 'lucide-react';

export function MessageBubble({ message, index }) {
  const { id, sender, content, modelName, timestamp, formattedContent } = message;

  const bubbleVariants = {
    hidden: { 
      opacity: 0, 
      y: 20, 
      x: sender === 'user' ? 50 : -50,
      scale: 0.8 
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      x: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut",
        delay: index * 0.1
      }
    }
  };

  const hoverVariants = {
    scale: 1.02,
    transition: { duration: 0.2 }
  };

  if (sender === 'system') {
    return (
      <motion.div
        key={id}
        className="flex justify-center my-4"
        variants={bubbleVariants}
        initial="hidden"
        animate="visible"
        whileHover={{ scale: 1.05 }}
      >
        <div className="message-bubble system text-xs px-3 py-2 font-medium">
          <em>{content}</em>
        </div>
      </motion.div>
    );
  }

  if (sender === 'user') {
    return (
      <motion.div
        key={id}
        className="flex justify-end mb-4"
        variants={bubbleVariants}
        initial="hidden"
        animate="visible"
        whileHover={hoverVariants}
      >
        <div className="flex items-end gap-2 max-w-[80%]">
          <div className="message-bubble user relative">
            <div className="flex items-center gap-2 mb-1">
              <User className="h-4 w-4 text-white/80" />
              <span className="text-xs font-medium text-white/80">You</span>
            </div>
            <div className="text-sm leading-relaxed">{content}</div>
            <div className="absolute -bottom-5 right-0 text-xs text-white/60">
              {formatTimestamp(timestamp)}
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  if (sender === 'assistant') {
    const isThinking = content === 'Thinking...';
    
    return (
      <motion.div
        key={id}
        className="flex justify-start mb-4"
        variants={bubbleVariants}
        initial="hidden"
        animate="visible"
        whileHover={hoverVariants}
      >
        <div className="flex items-end gap-2 max-w-[80%]">
          <div className={`message-bubble assistant ${isThinking ? 'animate-pulse-subtle' : ''}`}>
            <div className="flex items-center gap-2 mb-1">
              <Bot className="h-4 w-4 text-white/80" />
              <span className="text-xs font-medium text-white/80">
                {modelName || 'AI Assistant'}
              </span>
              <span className="text-xs text-white/60">
                {formatTimestamp(timestamp)}
              </span>
            </div>
            <div className="text-sm leading-relaxed">
              {isThinking ? (
                <div className="flex items-center gap-2">
                  <div className="typing-indicator">
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                  </div>
                  <span className="text-white/80">Thinking...</span>
                </div>
              ) : (
                <div dangerouslySetInnerHTML={{ __html: formattedContent }} />
              )}
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return null;
}