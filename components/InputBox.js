import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Paperclip } from 'lucide-react';

export function InputBox({
  onSendMessage,
  isLoading,
  disabled,
  selectedModel,
  placeholder = "Type your message..."
}) {
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [inputValue]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim() || !selectedModel || isLoading) return;

    onSendMessage(inputValue.trim());
    setInputValue('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const buttonVariants = {
    idle: { scale: 1 },
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  };

  const containerVariants = {
    focused: {
      boxShadow: "0 8px 32px rgba(139, 92, 246, 0.25), 0 4px 16px rgba(139, 92, 246, 0.15)",
      scale: 1.02,
      transition: { duration: 0.3 }
    },
    unfocused: {
      boxShadow: "0 4px 16px rgba(0, 0, 0, 0.06), 0 2px 8px rgba(0, 0, 0, 0.04)",
      scale: 1,
      transition: { duration: 0.3 }
    }
  };

  return (
    <div className="border-t-2 border-border/50 p-6 bg-background">
      <form onSubmit={handleSubmit} className="flex gap-4 items-end">
        <motion.div
          className="flex-1 relative"
          variants={containerVariants}
          animate={isFocused ? "focused" : "unfocused"}
        >
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={
                selectedModel
                  ? placeholder
                  : "Please select a model first"
              }
              disabled={!selectedModel || isLoading}
              className="w-full min-h-[52px] max-h-[120px] px-7 py-4 rounded-full border-3 border-input-border bg-background text-base font-medium placeholder:text-muted-foreground/70 focus:outline-none focus:ring-4 focus:ring-input-focused/20 focus:border-input-focused transition-all duration-300 resize-none scrollbar-hide shadow-lg hover:shadow-xl"
              rows="1"
              style={{
                borderWidth: '3px',
                fontWeight: '500'
              }}
            />
          </div>
        </motion.div>

        {/* Attachment Button - Enhanced */}
        <motion.button
          type="button"
          className="h-14 w-14 rounded-full border-3 border-input-focused bg-attachment-bg hover:bg-input-focused/10 hover:border-input-focused flex items-center justify-center text-muted-foreground hover:text-input-focused transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl font-semibold hover:scale-105"
          variants={buttonVariants}
          initial="idle"
          whileHover="hover"
          whileTap="tap"
          disabled={!selectedModel || isLoading}
        >
          <Paperclip className="h-6 w-6" />
        </motion.button>

        {/* Send Button - Enhanced Vibrant Design */}
        <motion.button
          type="submit"
          disabled={!selectedModel || !inputValue.trim() || isLoading}
          className="h-16 w-16 rounded-full btn-vibrant flex items-center justify-center text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-bold hover:scale-105 disabled:hover:scale-100"
          variants={buttonVariants}
          initial="idle"
          whileHover="hover"
          whileTap="tap"
        >
          {isLoading ? (
            <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Send className="h-6 w-6" />
          )}
        </motion.button>
      </form>
    </div>
  );
}