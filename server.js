const express = require('express');
const axios = require('axios');
const { spawn } = require('child_process');
require('dotenv').config();

const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(express.json());

// Store available models and conversation histories
let availableModels = {
  openrouter: [],
  huggingface: []
};

// Store conversation histories for each session
let conversationHistories = {};

// Load models from Python script on startup
function loadModelsFromPython() {
  return new Promise((resolve, reject) => {
    const python = spawn('python', ['-c', `
import sys
sys.path.append('.')
from query_models import get_all_models
import json
models = get_all_models()
print(json.dumps(models))
`]);
    
    let output = '';
    python.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    python.stderr.on('data', (data) => {
      console.error('Python error:', data.toString());
    });
    
    python.on('close', (code) => {
      if (code === 0) {
        try {
          const models = JSON.parse(output.trim());
          availableModels = models;
          console.log('✅ Models loaded successfully');
          console.log(`📊 OpenRouter models: ${models.openrouter.length}`);
          console.log(`📊 Hugging Face models: ${models.huggingface.length}`);
          resolve(models);
        } catch (error) {
          console.error('❌ Error parsing Python output:', error);
          reject(error);
        }
      } else {
        reject(new Error(`Python script exited with code ${code}`));
      }
    });
  });
}

// API endpoint to get available models
app.get('/api/models', (req, res) => {
  res.json(availableModels);
});

// API endpoint to send chat messages
app.post('/api/chat', async (req, res) => {
  const { message, model, provider, sessionId = 'default' } = req.body;
  
  try {
    // Initialize conversation history for this session if it doesn't exist
    if (!conversationHistories[sessionId]) {
      conversationHistories[sessionId] = {
        openrouter: [],
        huggingface: ""
      };
    }
    
    let response;
    
    if (provider === 'openrouter') {
      // Add user message to conversation history
      conversationHistories[sessionId].openrouter.push({
        role: 'user',
        content: message
      });
      
      response = await chatWithOpenRouter(message, model, conversationHistories[sessionId].openrouter);
      
      // Add assistant response to conversation history
      if (!response.startsWith('❌')) {
        conversationHistories[sessionId].openrouter.push({
          role: 'assistant',
          content: response
        });
      }
    } else if (provider === 'huggingface') {
      response = await chatWithHuggingFace(message, model, conversationHistories[sessionId].huggingface);
      
      // Update conversation history for Hugging Face
      if (!response.startsWith('❌')) {
        conversationHistories[sessionId].huggingface += `User: ${message}\nAssistant: ${response}\n`;
      }
    } else {
      return res.status(400).json({ error: 'Invalid provider' });
    }
    
    res.json({ response });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to get response from AI model' });
  }
});

// API endpoint to clear conversation history
app.post('/api/clear-history', (req, res) => {
  const { sessionId = 'default' } = req.body;
  
  if (conversationHistories[sessionId]) {
    conversationHistories[sessionId] = {
      openrouter: [],
      huggingface: ""
    };
  }
  
  res.json({ success: true, message: 'Conversation history cleared' });
});

async function chatWithOpenRouter(message, model, conversationHistory = []) {
  try {
    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      model: model,
      messages: conversationHistory.length > 0 ? conversationHistory : [{ role: 'user', content: message }]
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://your-local-dev',
        'X-Title': 'LLMChatApp'
      }
    });
    
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('OpenRouter API error:', error.response?.data || error.message);
    return `❌ Error ${error.response?.status || 'Unknown'}: ${error.response?.data?.error?.message || error.message}`;
  }
}

async function chatWithHuggingFace(message, model, conversationHistory = "") {
  try {
    const fullInput = conversationHistory ? `${conversationHistory}User: ${message}\nAssistant:` : message;
    
    const response = await axios.post(`https://api-inference.huggingface.co/models/${model}`, {
      inputs: fullInput,
      parameters: {
        max_new_tokens: 150,
        temperature: 0.7,
        do_sample: true
      }
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    let generatedText = '';
    if (Array.isArray(response.data) && response.data.length > 0) {
      generatedText = response.data[0].generated_text || '';
    } else if (response.data.generated_text) {
      generatedText = response.data.generated_text;
    }
    
    // Clean up the response by removing the input part
    if (generatedText.includes(fullInput)) {
      generatedText = generatedText.replace(fullInput, '').trim();
    }
    
    return generatedText || 'No response generated';
  } catch (error) {
    console.error('Hugging Face API error:', error.response?.data || error.message);
    return `❌ Error ${error.response?.status || 'Unknown'}: ${error.response?.data?.error || error.message}`;
  }
}

// Endpoint to manually reload models
app.post('/api/reload-models', async (req, res) => {
  try {
    await loadModelsFromPython();
    res.json({ success: true, models: availableModels });
  } catch (error) {
    console.error('Error reloading models:', error);
    res.status(500).json({ error: 'Failed to reload models' });
  }
});

// Start server and load models
async function startServer() {
  try {
    console.log('🚀 Starting LLM Chat App server...');
    await loadModelsFromPython();
    
    app.listen(port, () => {
      console.log(`✅ LLM Chat App listening at http://localhost:${port}`);
      console.log('🌐 Open your browser and navigate to the URL above');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    console.log('⚠️  Starting server without models. You can reload them later.');
    
    app.listen(port, () => {
      console.log(`⚠️  LLM Chat App listening at http://localhost:${port} (models not loaded)`);
    });
  }
}

startServer();
