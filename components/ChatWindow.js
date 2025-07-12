import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { MessageCircle, Trash2, Sparkles } from 'lucide-react';
import { MessageBubble } from './MessageBubble';
import { InputBox } from './InputBox';
import { TypingIndicator } from './TypingIndicator';

export function ChatWindow({
  messages,
  onSendMessage,
  onClearConversation,
  isLoading,
  selectedModel,
  selectedModelInfo
}) {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const emptyStateVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <Card className="flex flex-col h-full card-elevated">
      <CardHeader className="pb-4 border-b border-border/50">
        <CardTitle className="flex items-center justify-between">
          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Sparkles className="h-5 w-5 text-gradient" />
            <span className="text-gradient font-poppins font-bold">AI Chat</span>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="outline"
              size="sm"
              onClick={onClearConversation}
              disabled={messages.length === 0}
              className="hover:bg-destructive hover:text-destructive-foreground transition-colors"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear Chat
            </Button>
          </motion.div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex flex-col flex-1 p-0">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar chat-bg-pattern">
          {messages.length === 0 ? (
            <motion.div
              className="flex items-center justify-center h-full text-center"
              variants={emptyStateVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="text-muted-foreground max-w-md">
                <motion.div
                  className="relative mb-6"
                  animate={{
                    rotate: [0, 5, -5, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <MessageCircle className="h-16 w-16 mx-auto text-primary/30" />
                  <motion.div
                    className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-user rounded-full"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                </motion.div>
                <h3 className="text-xl font-poppins font-bold mb-3 text-gradient">
                  Ready to Chat!
                </h3>
                <p className="text-sm leading-relaxed">
                  {selectedModel
                    ? "Start a conversation with your AI assistant. Ask questions, get help, or just chat about anything!"
                    : "Select an AI model from the sidebar to begin your conversation"
                  }
                </p>
                {selectedModel && (
                  <motion.div
                    className="mt-4 p-3 bg-gradient-ai/10 rounded-lg border border-primary/20"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <p className="text-xs font-medium text-primary">
                      💡 Tip: Try asking about anything - from coding help to creative writing!
                    </p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              className="space-y-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <AnimatePresence mode="popLayout">
                {messages.map((message, index) => (
                  <MessageBubble key={message.id} message={message} index={index} />
                ))}
                {isLoading && (
                  <TypingIndicator key="typing" />
                )}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </motion.div>
          )}
        </div>

        {/* Input Area */}
        <InputBox
          onSendMessage={onSendMessage}
          isLoading={isLoading}
          selectedModel={selectedModel}
          placeholder={
            selectedModel
              ? "Type your message here..."
              : "Please select a model first"
          }
        />
        
        {selectedModelInfo && (
          <motion.div
            className="px-4 pb-2 text-xs text-muted-foreground text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center justify-center gap-2">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span>Connected to {selectedModelInfo.name}</span>
              </div>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
