from query_models import load_models, chat_with_openrouter_model, chat_with_huggingface_model, get_all_models

def main():
    print("\n🤖 Welcome to LLM Chat App with Multi-Provider Support")
    print("📚 Supports OpenRouter and Hugging Face models")
    
    # Get all available models
    all_models = get_all_models()
    openrouter_models = all_models["openrouter"]
    huggingface_models = all_models["huggingface"]
    
    if not openrouter_models and not huggingface_models:
        print("❌ No models found")
        return

    while True:
        print("\n" + "="*60)
        print("📚 Available AI Models:")
        
        # Show all OpenRouter models (no provider separation)
        for i, model in enumerate(openrouter_models, 1):
            print(f"  {i}. {model['name']} ({model['source']})")
            print(f"     📝 {model['description']}")

        print(f"\n0. Exit")
        print("="*60)

        try:
            choice = int(input("\nSelect a model by number: "))
            if choice == 0:
                print("👋 Goodbye!")
                break
            
            # All models are OpenRouter now
            if 1 <= choice <= len(openrouter_models):
                selected_model = openrouter_models[choice - 1]
                provider = "openrouter"
            else:
                print("❌ Invalid choice.")
                continue
                
        except (ValueError, IndexError):
            print("❌ Invalid choice. Please enter a number.")
            continue

        print(f"\n🟢 You are now chatting with: {selected_model['name']}")
        print(f"🏢 Source: {selected_model['source']}")
        print(f"📝 {selected_model['description']}")
        print("\nCommands:")
        print("  • Type 'switch' to change models")
        print("  • Type 'clear' to clear conversation history")
        print("  • Type 'exit' to quit")
        print("-" * 50)
        
        messages = []  # For conversation history

        while True:
            user_input = input("\n💬 You: ").strip()
            
            if user_input.lower() == "switch":
                print("🔄 Switching models...")
                break
            elif user_input.lower() == "exit":
                print("👋 Goodbye!")
                return
            elif user_input.lower() == "clear":
                messages = []
                print("🧹 Conversation history cleared!")
                continue
            elif not user_input:
                print("❌ Please enter a message.")
                continue

            print(f"\n🤔 {selected_model['name']} is thinking...")
            
            # All models use OpenRouter
            messages.append({"role": "user", "content": user_input})
            response = chat_with_openrouter_model(selected_model["id"], messages)
            if not response.startswith("❌"):
                messages.append({"role": "assistant", "content": response})
            
            print(f"\n🤖 {selected_model['name']}: {response}")
            
            if response.startswith("❌"):
                print("⚠️  There was an error. You can try again or switch models.")

def load_models_for_server():
    """Function to load models for the Node.js server"""
    try:
        all_models = get_all_models()
        return all_models
    except Exception as e:
        print(f"❌ Error loading models for server: {e}")
        return {"openrouter": [], "huggingface": []}

if __name__ == "__main__":
    main()
