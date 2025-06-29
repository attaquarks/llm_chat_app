# 🤖 LLM Chat App - Multi-Provider AI Chat

A comprehensive chat application that supports multiple AI providers including OpenRouter and Hugging Face models. Chat with various AI models, switch between them seamlessly, and maintain individual conversation histories for each model.

## ✨ Features

### 🎯 Core Features
- **Multi-Provider Support**: OpenRouter and Hugging Face models
- **Seamless Model Switching**: Change models anytime during conversation
- **Per-Model Chat History**: Each model maintains its own conversation history
- **Structured Responses**: ChatGPT/Gemini-like formatted responses
- **Both CLI and Web Interface**: Use via command line or web browser
- **Real-time Chat**: Instant responses with loading indicators
- **Model Information**: Detailed descriptions for each model
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **Context Preservation**: Each model remembers its own conversation context

## 🚀 Quick Start

### Prerequisites

- Python 3.7+
- Node.js 14+
- OpenRouter API Key (get from [OpenRouter](https://openrouter.ai/keys))
- Hugging Face API Key (optional - get from [Hugging Face](https://huggingface.co/settings/tokens))

### Installation

1. **Clone or download the project files**

2. **Set up environment variables**:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and add your API keys:
   ```
   OPENROUTER_API_KEY=your_openrouter_api_key_here
   HUGGINGFACE_API_KEY=your_huggingface_api_key_here
   ```

3. **Install Python dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Install Node.js dependencies**:
   ```bash
   npm install
   ```

## 🎯 Usage

### Web Interface (Recommended)

1. **Start the web server**:
   ```bash
   node server.js
   ```

2. **Open your browser** and navigate to:
   ```
   http://localhost:3000
   ```

3. **Select a model** from the dropdown and start chatting!

### Command Line Interface

Run the Python CLI version:
```bash
python main.py
```

## 🔧 Available Models

### OpenRouter Models (Currently Active)
- **Mistral Small 3.2**: Balanced open-weight model for general purpose tasks
- **DevStral Small**: Fast inference model for chat and reasoning
- **DeepSeek R1 Qwen3**: Advanced version with Qwen integration
- **DeepSeek Chat**: Conversational model tuned for friendly multi-turn dialogue
- **DeepSeek R1T Chimera**: Hybrid model optimized for multi-domain reasoning
- **Gemma 3n**: Multilingual model fine-tuned on instruction datasets
- **Microsoft MAI DS R1**: Microsoft's model optimized for instruction following
- **LLaMA 4 Maverick**: Meta's instruction-tuned LLaMA 4 variant for creative tasks
- **LLaMA 4 Scout**: Faster, smaller variant optimized for low-latency tasks
- **Qwen 3**: Advanced large model with instruction fine-tuning


## 🎮 Web Interface Features

### Model Selection
- **Model Dropdown**: Select from available models with detailed descriptions
- **Model Info Display**: View comprehensive information about selected model

### Chat Features

- **Real-Time Messaging**: Enjoy instant responses with smooth typing indicators for a seamless chat experience.
- **Message Timestamps**: View when each message was sent to keep track of your conversation timeline.
- **Model Attribution**: Easily identify which model generated each response for better transparency.
- **Per-Model History**: Maintain separate chat histories for each model to preserve context across conversations.
- **Smart Model Switching**: Switch between models without losing individual conversation threads.
- **Clear Chat**: Reset the conversation history for the current model at any time.
- **Reload Models**: Refresh the list of available models instantly for updated access.


## 🖥️ CLI Features

### Interactive Commands
- `switch`: Change to a different model (preserves individual model histories)
- `clear`: Clear current model's conversation history
- `exit`: Quit the application

### Enhanced Display
- Numbered list of all available models with descriptions
- Provider identification and model capabilities
- Professional formatting with emojis and clear organization
- Model-specific conversation context preservation

## 📁 Project Structure

```
llm_chat_app/
├── main.py              # Enhanced CLI interface with per-model history
├── query_models.py      # Model management and API calls
├── config.py           # Configuration and environment variables
├── server.js           # Node.js web server with advanced features
├── models.json         # OpenRouter model definitions (updated)
├── requirements.txt    # Python dependencies
├── package.json        # Node.js dependencies
├── .env.example        # Environment variables template
├── public/
│   ├── index.html      # Web interface HTML
│   ├── script.js       # Enhanced frontend with structured responses
│   └── style.css       # Professional styling with response formatting
└── README.md           # This comprehensive guide
```

## 🔑 API Keys Setup

### OpenRouter API Key (Required)
1. Visit [OpenRouter](https://openrouter.ai/keys)
2. Sign up or log in
3. Generate an API key
4. Add to your `.env` file

### Hugging Face API Key (Optional)
1. Visit [Hugging Face Tokens](https://huggingface.co/settings/tokens)
2. Sign up or log in
3. Create a new token with read permissions
4. Add to your `.env` file

## 🛠️ Troubleshooting

### Common Issues

**Models not loading**:
- Check your OpenRouter API key in `.env` file
- Ensure you have internet connection
- Try clicking "🔄 Reload Models" in web interface

**Formatting issues**:
- Clear browser cache and refresh
- Check that JavaScript is enabled
- Ensure all files are properly saved

**Python errors**:
- Install required packages: `pip install -r requirements.txt`
- Check Python version (3.7+ required)

**Node.js errors**:
- Install dependencies: `npm install`
- Check Node.js version (14+ required)
- Kill any existing processes on port 3000

**API errors**:
- Verify OpenRouter API key is correct and active
- Check API rate limits
- Some models may have usage restrictions


## 🤝 Contributing

Feel free to contribute by:
- Adding new model providers
- Improving response formatting
- Enhancing the user interface
- Adding new features (image support, file uploads, etc.)
- Fixing bugs and improving performance
- Improving documentation

## 📄 License

This project is open source and available under the MIT License.

## 🎯 Future Roadmap

- [ ] Image generation support
- [ ] File upload and analysis
- [ ] Voice chat integration
- [ ] Custom model fine-tuning
- [ ] Team collaboration features
- [ ] Advanced prompt templates
- [ ] Export conversation history
- [ ] Dark/light theme toggle

---

**Happy Chatting! 🎉**

