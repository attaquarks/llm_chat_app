// Store conversation histories for each session (shared with chat.js)
// In a production app, this would be stored in a database
let conversationHistories = {};

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { sessionId = 'default' } = req.body;
    
    if (conversationHistories[sessionId]) {
      conversationHistories[sessionId] = {
        openrouter: [],
        huggingface: ""
      };
    }
    
    res.status(200).json({ success: true, message: 'Conversation history cleared' });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
