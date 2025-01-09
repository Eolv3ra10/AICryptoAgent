import React, { useState, useRef, useEffect } from 'react';
import OpenAI from 'openai';
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  CircularProgress
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

const CryptoAIAssistant = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatBoxRef = useRef(null);

  const scrollToBottom = () => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a helpful cryptocurrency expert assistant. Provide concise, accurate information about crypto trends, analysis, and general guidance."
          },
          {
            role: "user",
            content: userMessage
          }
        ]
      });

      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: completion.choices[0].message.content 
      }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.' 
      }]);
    }
    setLoading(false);
  };

  return (
    <Paper elevation={3} sx={{ p: 2, height: 'calc(100vh - 180px)', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h6" gutterBottom sx={{ textAlign: 'center', color: '#1a73e8' }}>
        CryptoAI Assistant
      </Typography>
      
      <Box ref={chatBoxRef} sx={{ flexGrow: 1, overflowY: 'auto', mb: 2 }}>
        <List>
          {messages.map((message, index) => (
            <ListItem key={index} sx={{
              justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start'
            }}>
              <Paper elevation={1} sx={{
                p: 1,
                backgroundColor: message.role === 'user' ? '#e3f2fd' : '#f5f5f5',
                maxWidth: '80%'
              }}>
                <ListItemText 
                  primary={message.content}
                  sx={{ wordBreak: 'break-word' }}
                />
              </Paper>
            </ListItem>
          ))}
        </List>
        {loading && (
          <Box display="flex" justifyContent="center" my={2}>
            <CircularProgress size={20} />
          </Box>
        )}
      </Box>

      <form onSubmit={handleSubmit}>
        <Box display="flex" gap={1}>
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            placeholder="Ask about crypto trends..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
          />
          <Button
            type="submit"
            variant="contained"
            disabled={loading || !input.trim()}
            endIcon={<SendIcon />}
          >
            Send
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default CryptoAIAssistant; 