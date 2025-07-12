import { spawn } from 'child_process';

// Store available models (shared with models.js)
let availableModels = {
  openrouter: [],
  huggingface: []
};

// Load models from Python script
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
          console.log('✅ Models reloaded successfully');
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

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      await loadModelsFromPython();
      res.status(200).json({ success: true, models: availableModels });
    } catch (error) {
      console.error('Error reloading models:', error);
      res.status(500).json({ error: 'Failed to reload models' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
