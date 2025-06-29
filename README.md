# 🤖 LLM Chat App - Multi-Provider AI Chat

A comprehensive chat application that supports multiple AI providers including OpenRouter and Hugging Face models. Chat with various AI models, switch between them seamlessly, and maintain conversation history.

## ✨ Features

- **Multi-Provider Support**: OpenRouter and Hugging Face models
- **Model Switching**: Change models anytime during conversation
- **Conversation History**: Maintains context across messages
- **Both CLI and Web Interface**: Use via command line or web browser
- **Real-time Chat**: Instant responses with loading indicators
- **Model Information**: Detailed descriptions for each model
- **Responsive Design**: Works on desktop and mobile devices
- **Session Management**: Multiple conversation sessions
- **Clear History**: Reset conversations anytime

## 🚀 Quick Start

### Prerequisites

- Python 3.7+
- Node.js 14+
- OpenRouter API Key (get from [OpenRouter](https://openrouter.ai/keys))
- Hugging Face API Key (get from [Hugging Face](https://huggingface.co/settings/tokens))

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

### OpenRouter Models
- **Mistral Small 3.2**: Balanced open-weight model for general purpose tasks
- **DeepSeek R1**: Strong code and reasoning model by DeepSeek
- **DeepSeek R1 Qwen3**: Advanced version with Qwen integration
- **DevStral Small**: Fast inference model for chat and reasoning
- **Gemma 3n**: Multilingual model fine-tuned on instruction datasets
- **Qwen 3**: Advanced large model with instruction fine-tuning

### Hugging Face Models
- **DialoGPT Medium**: Conversational AI model by Microsoft
- **BlenderBot 400M**: Facebook's conversational AI model
- **DialoGPT Large**: Large conversational model by Microsoft
- **Flan-T5 Base**: Google's instruction-tuned T5 model

## 🎮 Web Interface Features

### Model Selection
- **Provider Tabs**: Switch between OpenRouter and Hugging Face
- **Model Dropdown**: Select from available models with descriptions
- **Model Info**: View detailed information about selected model

### Chat Features
- **Real-time Messaging**: Instant responses with typing indicators
- **Message Timestamps**: Track when messages were sent
- **Model Attribution**: See which model generated each response
- **Clear History**: Reset conversation anytime
- **Reload Models**: Refresh available models

### Commands
- **🧹 Clear Chat**: Remove all messages and reset conversation
- **🔄 Reload Models**: Refresh the list of available models

## 🖥️ CLI Features

### Interactive Commands
- `switch`: Change to a different model
- `clear`: Clear conversation history
- `exit`: Quit the application

### Model Display
- Numbered list of all available models
- Provider identification (OpenRouter/Hugging Face)
- Model descriptions and capabilities

## 📁 Project Structure

```
llm_chat_app/
├── main.py              # CLI interface
├── query_models.py      # Model management and API calls
├── config.py           # Configuration and environment variables
├── server.js           # Node.js web server
├── models.json         # OpenRouter model definitions
├── requirements.txt    # Python dependencies
├── package.json        # Node.js dependencies
├── .env.example        # Environment variables template
├── public/
│   ├── index.html      # Web interface HTML
│   ├── script.js       # Frontend JavaScript
│   └── style.css       # Styling and responsive design
└── README.md           # This file
```

## 🔑 API Keys Setup

### OpenRouter API Key
1. Visit [OpenRouter](https://openrouter.ai/keys)
2. Sign up or log in
3. Generate an API key
4. Add to your `.env` file

### Hugging Face API Key
1. Visit [Hugging Face Tokens](https://huggingface.co/settings/tokens)
2. Sign up or log in
3. Create a new token with read permissions
4. Add to your `.env` file

## 🛠️ Troubleshooting

### Common Issues

**Models not loading**:
- Check your API keys in `.env` file
- Ensure you have internet connection
- Try clicking "🔄 Reload Models" in web interface

**Python errors**:
- Install required packages: `pip install -r requirements.txt`
- Check Python version (3.7+ required)

**Node.js errors**:
- Install dependencies: `npm install`
- Check Node.js version (14+ required)

**API errors**:
- Verify API keys are correct and active
- Check API rate limits
- Some models may have usage restrictions

## 🔄 Adding New Models

### OpenRouter Models
Edit `models.json` to add new OpenRouter models:
```json
{
  "id": "provider/model-name",
  "name": "Display Name",
  "source": "openrouter",
  "description": "Model description"
}
```

### Hugging Face Models
Edit the `popular_hf_models` list in `query_models.py`:
```python
{
  "id": "username/model-name",
  "name": "Display Name", 
  "source": "huggingface",
  "description": "Model description"
}
```

## 🤝 Contributing

Feel free to contribute by:
- Adding new model providers
- Improving the user interface
- Adding new features
- Fixing bugs
- Improving documentation

## 📄 License

This project is open source and available under the MIT License.

## 🆘 Support

If you encounter any issues:
1. Check the troubleshooting section
2. Verify your API keys and internet connection
3. Check the console/terminal for error messages
4. Ensure all dependencies are installed correctly

---

**Happy Chatting! 🎉**
