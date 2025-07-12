import { useState, useCallback } from 'react';
import axios from 'axios';
import { generateSessionId, formatAssistantMessage } from '../lib/utils';

export function useChat() {
  const [modelConversations, setModelConversations] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => generateSessionId());

  const addMessage = useCallback((sender, content, modelId, modelName = null, timestamp = new Date()) => {
    const message = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      sender,
      content,
      modelName,
      timestamp,
      formattedContent: sender === 'assistant' ? formatAssistantMessage(content) : content
    };

    if (modelId) {
      setModelConversations(prev => ({
        ...prev,
        [modelId]: [...(prev[modelId] || []), message]
      }));
    }
    return message.id;
  }, []);

  const removeMessage = useCallback((messageId, modelId) => {
    if (modelId) {
      setModelConversations(prev => ({
        ...prev,
        [modelId]: prev[modelId]?.filter(msg => msg.id !== messageId) || []
      }));
    }
  }, []);

  const sendMessage = useCallback(async (userMessage, selectedModel, provider = 'openrouter', modelName = null) => {
    if (!userMessage.trim() || !selectedModel) return;

    // Add user message
    addMessage('user', userMessage, selectedModel, modelName);

    // Add loading message
    const loadingId = addMessage('assistant', 'Thinking...', selectedModel, modelName);
    setIsLoading(true);

    try {
      const response = await axios.post('/api/chat', {
        message: userMessage,
        model: selectedModel,
        provider,
        sessionId: `${sessionId}-${selectedModel}`, // Model-specific session
        conversation: modelConversations[selectedModel] || []
      });

      // Remove loading message
      removeMessage(loadingId, selectedModel);

      if (response.data.response) {
        addMessage('assistant', response.data.response, selectedModel, modelName);
      } else {
        addMessage('system', 'No response received from the AI model', selectedModel);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Remove loading message
      removeMessage(loadingId, selectedModel);
      
      const errorMessage = error.response?.data?.error || 'Failed to send message. Please try again.';
      addMessage('system', `Error: ${errorMessage}`, selectedModel);
    } finally {
      setIsLoading(false);
    }
  }, [sessionId, addMessage, removeMessage, modelConversations]);

  const clearConversation = useCallback(async (selectedModel) => {
    if (!selectedModel) return;

    try {
      await axios.post('/api/clear-history', {
        sessionId: `${sessionId}-${selectedModel}`
      });

      setModelConversations(prev => ({
        ...prev,
        [selectedModel]: []
      }));
      addMessage('system', 'Conversation history cleared', selectedModel);
    } catch (error) {
      console.error('Error clearing conversation:', error);
      addMessage('system', 'Error clearing conversation history', selectedModel);
    }
  }, [sessionId, addMessage]);

  const getMessagesForModel = useCallback((modelId) => {
    return modelConversations[modelId] || [];
  }, [modelConversations]);

  return {
    getMessagesForModel,
    isLoading,
    sessionId,
    sendMessage,
    clearConversation,
    addMessage,
    modelConversations
  };
}
