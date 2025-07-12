import { useState } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { ModelSelector } from '../components/ModelSelector';
import { ChatWindow } from '../components/ChatWindow';
import { ThemeToggle } from '../components/ThemeToggle';
import { useChat } from '../hooks/useChat';
import { Sparkles, Zap, Heart } from 'lucide-react';

export default function Home() {
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedModelInfo, setSelectedModelInfo] = useState(null);
  const { getMessagesForModel, isLoading, sendMessage, clearConversation } = useChat();

  const handleModelSelect = (modelId, modelInfo) => {
    setSelectedModel(modelId);
    setSelectedModelInfo(modelInfo);
  };

  const handleSendMessage = (message) => {
    if (selectedModel && selectedModelInfo) {
      sendMessage(message, selectedModel, selectedModelInfo.provider, selectedModelInfo.name);
    }
  };

  const handleClearConversation = () => {
    clearConversation(selectedModel);
  };

  // Get messages for the currently selected model
  const currentMessages = selectedModel ? getMessagesForModel(selectedModel) : [];

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const headerVariants = {
    initial: { opacity: 0, y: -30 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        delay: 0.2
      }
    }
  };

  return (
    <>
      <Head>
        <title>LLM Chat App - Multi-Provider AI Chat</title>
        <meta name="description" content="Multi-Provider LLM Chat Application with OpenRouter and Hugging Face support" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <motion.div
        className="min-h-screen bg-background"
        variants={pageVariants}
        initial="initial"
        animate="animate"
      >
        <div className="container mx-auto p-4 h-screen">
          {/* Header */}
          <motion.div
            className="mb-6 text-center relative"
            variants={headerVariants}
            initial="initial"
            animate="animate"
          >
            {/* Theme Toggle */}
            <div className="absolute top-0 right-0">
              <ThemeToggle />
            </div>

            <div className="flex items-center justify-center gap-3 mb-2">
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Sparkles className="h-10 w-10 text-yellow-400" />
              </motion.div>
              <h1 className="text-4xl font-poppins font-extrabold text-foreground">
                AI Chat Hub
              </h1>
              <motion.div
                animate={{
                  rotate: [0, -10, 10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1.5
                }}
              >
                <Zap className="h-10 w-10 text-blue-400" />
              </motion.div>
            </div>
            
            <motion.p
              className="text-muted-foreground text-lg font-inter"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Experience the future of AI conversations
            </motion.p>
          </motion.div>

          {/* Main Content */}
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {/* Model Selector Sidebar */}
            <motion.div
              className="lg:col-span-1"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <ModelSelector
                onModelSelect={handleModelSelect}
                selectedModel={selectedModel}
                selectedModelInfo={selectedModelInfo}
              />
            </motion.div>

            {/* Chat Window */}
            <motion.div
              className="lg:col-span-3"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <ChatWindow
                messages={currentMessages}
                onSendMessage={handleSendMessage}
                onClearConversation={handleClearConversation}
                isLoading={isLoading}
                selectedModel={selectedModel}
                selectedModelInfo={selectedModelInfo}
              />
            </motion.div>
          </motion.div>

          {/* Footer */}
          <motion.div
            className="mt-6 text-center text-muted-foreground text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <span>Built with</span>
              <Heart className="h-4 w-4 text-red-400 animate-pulse" />
              <span>using Next.js • Powered by OpenRouter & Hugging Face</span>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
}
