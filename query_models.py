import requests
import json
from huggingface_hub import HfApi
from config import HUGGINGFACE_API_KEY, OPENROUTER_API_KEY

# Load models from models.json
def load_models(path="models.json"):
    try:
        with open(path, "r") as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"❌ {path} not found")
        return []
    except json.JSONDecodeError:
        print(f"❌ Invalid JSON in {path}")
        return []

def get_huggingface_models():
    """Get Hugging Face models from API"""
    try:
        api = HfApi()
        models = api.list_models(cardData=True, limit=50)  # Limit for performance
        return [model.modelId for model in models]
    except Exception as e:
        print(f"❌ Error fetching Hugging Face models: {e}")
        return []

def get_openrouter_models():
    """Get OpenRouter models from API"""
    try:
        response = requests.get("https://openrouter.ai/api/v1/models")
        if response.status_code == 200:
            data = response.json()
            return [model['id'] for model in data['data']]
        return []
    except Exception as e:
        print(f"❌ Error fetching OpenRouter models: {e}")
        return []

def chat_with_openrouter_model(model_id, messages):
    """Query OpenRouter with chat format"""
    url = "https://openrouter.ai/api/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
        "HTTP-Referer": "https://your-local-dev",
        "X-Title": "LLMChatApp"
    }
    payload = {
        "model": model_id,
        "messages": messages
    }
    
    try:
        response = requests.post(url, headers=headers, json=payload)
        if response.status_code == 200:
            return response.json()["choices"][0]["message"]["content"]
        else:
            return f"❌ Error {response.status_code}: {response.text}"
    except Exception as e:
        return f"❌ Request failed: {str(e)}"

def chat_with_huggingface_model(model_id, message):
    """Query Hugging Face model"""
    url = f"https://api-inference.huggingface.co/models/{model_id}"
    headers = {
        "Authorization": f"Bearer {HUGGINGFACE_API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "inputs": message
    }
    
    try:
        response = requests.post(url, headers=headers, json=payload)
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list) and len(data) > 0:
                return data[0].get("generated_text", "No response generated")
            elif isinstance(data, dict):
                return data.get("generated_text", "No response generated")
            else:
                return "Unexpected response format"
        else:
            return f"❌ Error {response.status_code}: {response.text}"
    except Exception as e:
        return f"❌ Request failed: {str(e)}"

def get_all_models():
    """Get models from models.json (all OpenRouter models)"""
    openrouter_models = load_models()  # From models.json
    
    return {
        "openrouter": openrouter_models,
        "huggingface": []  # Keep structure but empty for now
    }
