let availableModels = { openrouter: [], huggingface: [] };
let currentProvider = 'openrouter';
let selectedModel = '';
let selectedModelInfo = null;
let sessionId = 'session-' + Date.now(); // Unique session ID

const chatLog = document.getElementById('chat-log');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');
const modelDropdown = document.getElementById('model-dropdown');
const selectedModelSpan = document.getElementById('selected-model');
const tabButtons = document.querySelectorAll('.tab-button');

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    loadModels();
    setupEventListeners();
    addClearButton();
    
    // Add reload models button
    const reloadButton = document.createElement('button');
    reloadButton.textContent = '🔄 Reload Models';
    reloadButton.className = 'reload-button';
    reloadButton.onclick = reloadModels;
    
    const modelSelector = document.getElementById('model-selector');
    modelSelector.appendChild(reloadButton);
});

function setupEventListeners() {
    sendButton.addEventListener('click', sendMessage);
    userInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            sendMessage();
        }
    });

    modelDropdown.addEventListener('change', (event) => {
        selectedModel = event.target.value;
        const selectedOption = event.target.selectedOptions[0];
        selectedModelInfo = {
            id: selectedModel,
            name: selectedOption.textContent,
            description: selectedOption.dataset.description || '',
            provider: 'openrouter', // All models are OpenRouter now
            source: selectedOption.dataset.source || 'openrouter'
        };
        updateSelectedModelDisplay();
        toggleChatInput();
    });

    tabButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            switchProvider(event.target.dataset.provider);
        });
    });
}

async function loadModels() {
    try {
        const response = await fetch('/api/models');
        availableModels = await response.json();
        
        // If models are empty, try to load them from Python script
        if (availableModels.openrouter.length === 0 && availableModels.huggingface.length === 0) {
            appendMessage('system', 'Loading models... This may take a moment.');
            // You'll need to run the Python script separately to populate models
        }
        
        populateModelDropdown();
    } catch (error) {
        console.error('Error loading models:', error);
        appendMessage('system', 'Error loading models. Please check your API keys and try again.');
    }
}

function switchProvider(provider) {
    currentProvider = provider;
    
    // Update tab appearance
    tabButtons.forEach(button => {
        button.classList.toggle('active', button.dataset.provider === provider);
    });
    
    populateModelDropdown();
    selectedModel = '';
    updateSelectedModelDisplay();
    toggleChatInput();
}

function populateModelDropdown() {
    // Combine all models from OpenRouter (ignore Hugging Face for now)
    const allModels = availableModels.openrouter || [];
    modelDropdown.innerHTML = '';
    
    if (allModels.length === 0) {
        modelDropdown.innerHTML = '<option value="">No models available</option>';
        return;
    }
    
    modelDropdown.innerHTML = '<option value="">Select a model...</option>';
    allModels.forEach(model => {
        const option = document.createElement('option');
        option.value = model.id || model;
        option.textContent = `${model.name} (${model.source})` || model;
        option.dataset.description = model.description || '';
        option.dataset.source = model.source || 'openrouter';
        modelDropdown.appendChild(option);
    });
}

function updateSelectedModelDisplay() {
    if (selectedModel && selectedModelInfo) {
        selectedModelSpan.innerHTML = `
            <strong>${selectedModelInfo.name}</strong><br>
            <small>${selectedModelInfo.description}</small>
        `;
    } else {
        selectedModelSpan.textContent = 'No model selected';
    }
}

function toggleChatInput() {
    const hasModel = selectedModel !== '';
    userInput.disabled = !hasModel;
    sendButton.disabled = !hasModel;
    
    if (hasModel) {
        userInput.placeholder = 'Type your message here...';
        userInput.focus();
    } else {
        userInput.placeholder = 'Please select a model first';
    }
}

async function sendMessage() {
    const userMessage = userInput.value.trim();
    if (!userMessage || !selectedModel) return;
    
    appendMessage('user', userMessage);
    userInput.value = '';
    
    // Show loading message
    const loadingId = appendMessage('assistant', 'Thinking...');
    sendButton.disabled = true;
    userInput.disabled = true;
    
    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: userMessage,
                model: selectedModel,
                provider: 'openrouter', // All models use OpenRouter now
                sessionId: sessionId
            })
        });
        
        const data = await response.json();
        
        // Remove loading message
        document.getElementById(loadingId).remove();
        
        if (response.ok) {
            appendMessage('assistant', data.response, selectedModelInfo?.name || 'AI');
        } else {
            appendMessage('system', `Error: ${data.error}`);
        }
    } catch (error) {
        console.error('Error sending message:', error);
        document.getElementById(loadingId).remove();
        appendMessage('system', 'Error: Failed to send message. Please try again.');
    } finally {
        sendButton.disabled = false;
        userInput.disabled = false;
        userInput.focus();
    }
}

function appendMessage(sender, message, modelName = null) {
    const messageElement = document.createElement('div');
    const messageId = 'msg-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    messageElement.id = messageId;
    messageElement.classList.add('message', `${sender}-message`);
    
    if (sender === 'system') {
        messageElement.innerHTML = `<em>${message}</em>`;
    } else if (sender === 'assistant' && modelName) {
        messageElement.innerHTML = `
            <div class="message-header">
                <strong>${modelName}</strong>
                <span class="timestamp">${new Date().toLocaleTimeString()}</span>
            </div>
            <div class="message-content">${message}</div>
        `;
    } else {
        const content = document.createElement('div');
        content.className = 'message-content';
        content.textContent = message;
        
        if (sender === 'user') {
            const timestamp = document.createElement('span');
            timestamp.className = 'timestamp';
            timestamp.textContent = new Date().toLocaleTimeString();
            messageElement.appendChild(timestamp);
        }
        
        messageElement.appendChild(content);
    }
    
    chatLog.appendChild(messageElement);
    chatLog.scrollTop = chatLog.scrollHeight;
    
    return messageId;
}

// Add clear conversation functionality
function addClearButton() {
    const clearButton = document.createElement('button');
    clearButton.textContent = '🧹 Clear Chat';
    clearButton.className = 'clear-button';
    clearButton.onclick = clearConversation;
    
    const inputContainer = document.getElementById('input-container');
    inputContainer.appendChild(clearButton);
}

async function clearConversation() {
    try {
        await fetch('/api/clear-history', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                sessionId: sessionId
            })
        });
        
        chatLog.innerHTML = '';
        appendMessage('system', 'Conversation history cleared');
    } catch (error) {
        console.error('Error clearing conversation:', error);
        appendMessage('system', 'Error clearing conversation history');
    }
}

// Add reload models functionality
async function reloadModels() {
    try {
        appendMessage('system', 'Reloading models...');
        const response = await fetch('/api/reload-models', {
            method: 'POST'
        });
        
        if (response.ok) {
            const data = await response.json();
            availableModels = data.models;
            populateModelDropdown();
            appendMessage('system', 'Models reloaded successfully');
        } else {
            appendMessage('system', 'Failed to reload models');
        }
    } catch (error) {
        console.error('Error reloading models:', error);
        appendMessage('system', 'Error reloading models');
    }
}

// Add some sample models for testing if API fails
function addSampleModels() {
    availableModels = {
        openrouter: [
            'openai/gpt-3.5-turbo',
            'openai/gpt-4',
            'anthropic/claude-3-haiku',
            'meta-llama/llama-2-70b-chat'
        ],
        huggingface: [
            'microsoft/DialoGPT-medium',
            'facebook/blenderbot-400M-distill',
            'microsoft/DialoGPT-large'
        ]
    };
    populateModelDropdown();
}
