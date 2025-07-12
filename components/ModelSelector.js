import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/Select';
import { RefreshCw, Bot, Cpu, Zap, CheckCircle } from 'lucide-react';
import axios from 'axios';

export function ModelSelector({ onModelSelect, selectedModel, selectedModelInfo }) {
  const [availableModels, setAvailableModels] = useState({ openrouter: [], huggingface: [] });
  const [currentProvider, setCurrentProvider] = useState('openrouter');
  const [isLoading, setIsLoading] = useState(false);
  const [isReloading, setIsReloading] = useState(false);

  useEffect(() => {
    loadModels();
  }, []);

  const loadModels = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('/api/models');
      setAvailableModels(response.data);
    } catch (error) {
      console.error('Error loading models:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const reloadModels = async () => {
    setIsReloading(true);
    try {
      const response = await axios.post('/api/reload-models');
      setAvailableModels(response.data.models);
    } catch (error) {
      console.error('Error reloading models:', error);
    } finally {
      setIsReloading(false);
    }
  };

  const handleModelChange = (modelId) => {
    // Ignore the "no-models" placeholder value
    if (modelId === 'no-models') return;
    
    const allModels = availableModels.openrouter || [];
    const selectedModelData = allModels.find(model => (model.id || model) === modelId);
    
    const modelInfo = {
      id: modelId,
      name: selectedModelData?.name || modelId,
      description: selectedModelData?.description || '',
      provider: 'openrouter',
      source: selectedModelData?.source || 'openrouter'
    };

    onModelSelect(modelId, modelInfo);
  };

  const allModels = availableModels.openrouter || [];

  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const buttonVariants = {
    idle: { scale: 1 },
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
    >
      <Card className="w-full max-w-sm card-elevated">
        <CardHeader className="pb-4 border-b border-border/50">
          <CardTitle className="flex items-center gap-2 text-lg">
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
              <Bot className="h-5 w-5 text-gradient-ai" />
            </motion.div>
            <span className="font-poppins font-bold text-gradient-ai">AI Models</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="relative">
              <Select value={selectedModel || ''} onValueChange={handleModelChange} disabled={isLoading}>
                <SelectTrigger className="bg-background/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-colors">
                  <SelectValue placeholder={isLoading ? "Loading models..." : "Choose your AI companion..."} />
                </SelectTrigger>
                <SelectContent className="bg-background/95 backdrop-blur-sm border border-primary/20">
                  {allModels.length === 0 ? (
                    <SelectItem value="no-models" disabled>
                      No models available
                    </SelectItem>
                  ) : (
                    allModels.map((model) => {
                      const modelId = model.id || model;
                      const modelName = model.name || model;
                      const modelSource = model.source || 'openrouter';
                      
                      return (
                        <SelectItem key={modelId} value={modelId} className="hover:bg-primary/10">
                          <div className="flex items-center gap-2">
                            <Cpu className="h-4 w-4 text-primary" />
                            <span>{modelName}</span>
                            <span className="text-xs text-muted-foreground">({modelSource})</span>
                          </div>
                        </SelectItem>
                      );
                    })
                  )}
                </SelectContent>
              </Select>
            </div>

            <motion.div
              variants={buttonVariants}
              initial="idle"
              whileHover="hover"
              whileTap="tap"
            >
              <Button
                variant="outline"
                size="sm"
                className="w-full gradient-button text-white hover:shadow-lg border-0"
                onClick={reloadModels}
                disabled={isReloading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isReloading ? 'animate-spin' : ''}`} />
                {isReloading ? 'Refreshing...' : 'Refresh Models'}
              </Button>
            </motion.div>
          </div>

          {selectedModelInfo && (
            <motion.div
              className="p-4 bg-gradient-ai/10 rounded-xl border border-primary/20 backdrop-blur-sm"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <div className="font-medium text-sm text-gradient-ai font-poppins">
                  {selectedModelInfo.name}
                </div>
              </div>
              {selectedModelInfo.description && (
                <div className="text-xs text-muted-foreground mb-2 line-clamp-3">
                  {selectedModelInfo.description}
                </div>
              )}
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Zap className="h-3 w-3 text-yellow-500" />
                <span>Provider: {selectedModelInfo.source}</span>
              </div>
            </motion.div>
          )}

          {!selectedModel && (
            <motion.div
              className="text-center py-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <motion.div
                className="w-12 h-12 mx-auto mb-3 bg-gradient-ai/20 rounded-full flex items-center justify-center"
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Bot className="h-6 w-6 text-primary" />
              </motion.div>
              <p className="text-sm text-muted-foreground font-medium">
                Select an AI model to begin
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Choose from powerful language models
              </p>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
