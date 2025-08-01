import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChatMessage, ChatPersona } from '../../types';
import { apiService } from '../../services/apiService';
import Button from '../ui/Button';
import { SendIcon } from '../icons/IconComponents';
import { ROUTES } from '../../constants';

const MAX_MESSAGES = 2; // User can send 2 messages

const InteractiveDemo: React.FC = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userMessageCount, setUserMessageCount] = useState(0);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const isDemoOver = userMessageCount >= MAX_MESSAGES;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Start with a greeting from the AI
  useEffect(() => {
    setMessages([
        {
            id: 'init-1',
            text: 'Hello! I am Elby, your AI legal assistant. Ask me a question to see how I can help. For example: "What is a tort?"',
            sender: 'ai',
            timestamp: new Date().toISOString()
        }
    ]);
  }, []);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading || isDemoOver) return;

    setIsLoading(true);
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };
    setInput('');
    setMessages(prev => [...prev, userMessage]);
    setUserMessageCount(prev => prev + 1);

    try {
      const aiResponseText = await apiService.getChatResponse([...messages, userMessage], ChatPersona.ASSISTANT);
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: aiResponseText,
        sender: 'ai',
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Failed to get AI response", error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I encountered an error. Please try again.",
        sender: 'ai',
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-xl rounded-lg w-full max-w-2xl mx-auto overflow-hidden">
      <div className="h-96 flex flex-col">
        {/* Message Area */}
        <div className="flex-grow p-6 overflow-y-auto bg-gray-50 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-md px-4 py-2 rounded-lg shadow-sm ${msg.sender === 'user' ? 'bg-brand-primary text-white' : 'bg-white border'}`}>
                <p className="whitespace-pre-wrap text-sm">{msg.text}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-md px-4 py-2 rounded-lg bg-white border">
                <div className="flex items-center">
                  <span className="typing-indicator"></span>
                  <style>{`.typing-indicator { display: inline-block; width: 24px; height: 10px; position: relative; } .typing-indicator::before, .typing-indicator::after { content: ''; position: absolute; width: 6px; height: 6px; border-radius: 50%; background-color: #333; animation: typing 1s infinite; } .typing-indicator::before { left: 0; } .typing-indicator::after { right: 0; animation-delay: 0.5s; } @keyframes typing { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }`}</style>
                </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
        {/* Input Area */}
        <div className="p-4 bg-white border-t border-gray-200">
          {isDemoOver ? (
            <div className="text-center">
                <p className="text-gray-600 mb-4">You've reached the end of the demo.</p>
                <Button onClick={() => navigate(ROUTES.SIGNUP)} variant="primary">
                    Sign Up to Continue Chatting
                </Button>
            </div>
          ) : (
            <div className="relative">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Ask a legal question..."
                className="w-full p-3 pr-14 border rounded-lg focus:ring-brand-primary focus:border-brand-primary resize-none"
                disabled={isLoading}
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <Button onClick={handleSendMessage} disabled={isLoading || !input.trim()} size="sm" className="h-10 w-10 p-0">
                  <SendIcon className="h-5 w-5" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InteractiveDemo;
