import axios from 'axios';

// Store conversation histories for each session
let conversationHistories = {};

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

export default async function handler(req, res) {
  if (req.method === 'POST') {
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
      
      res.status(200).json({ response });
    } catch (error) {
      console.error('Chat error:', error);
      res.status(500).json({ error: 'Failed to get response from AI model' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
