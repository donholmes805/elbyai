

import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { apiService } from '../services/apiService';
import { ChatSession, ChatMessage, ChatPersona } from '../types';
import Button from '../components/ui/Button';
import { downloadAsPdf } from '../utils/pdfGenerator';
import { PlusIcon, TrashIcon, DownloadIcon, PaperclipIcon, SendIcon, LogoIcon } from '../components/icons/IconComponents';
import UpgradeModal from '../components/UpgradeModal';

const ChatPage: React.FC = () => {
  const { user, checkAndIncrementUsage } = useAuth();
  const navigate = useNavigate();
  const { sessionId } = useParams();
  
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [persona, setPersona] = useState<ChatPersona>(ChatPersona.ASSISTANT);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isUpgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [featureForUpgrade, setFeatureForUpgrade] = useState('');

  useEffect(() => {
    // Load sessions from localStorage on mount
    if (user?.id) {
      const savedSessions = localStorage.getItem(`chatSessions_${user.id}`);
      if (savedSessions) {
        setSessions(JSON.parse(savedSessions));
      } else {
        setSessions([]);
      }
    }
  }, [user]);

  useEffect(() => {
    // Save sessions to localStorage whenever they change
    if (user?.id) {
      if (sessions.length > 0) {
        localStorage.setItem(`chatSessions_${user.id}`, JSON.stringify(sessions));
      } else {
        // Clear localStorage if there are no sessions left
        localStorage.removeItem(`chatSessions_${user.id}`);
      }
    }
  }, [sessions, user]);
  
  useEffect(() => {
    if(sessionId) {
      const session = sessions.find(s => s.id === sessionId);
      setCurrentSession(session || null);
    } else {
      setCurrentSession(null);
    }
  }, [sessionId, sessions]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentSession?.messages]);

  const handleNewChat = () => {
    // If we're already on a new, empty chat, don't create another one.
    if (currentSession && currentSession.messages.length === 0 && currentSession.title === 'New Chat') {
      return;
    }
  
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: 'New Chat', // A temporary title.
      messages: [],
      // Use the persona from the selector if on the placeholder screen, otherwise default.
      persona: currentSession ? ChatPersona.ASSISTANT : persona,
      createdAt: new Date().toISOString(),
    };
  
    setSessions(prev => [newSession, ...prev]);
    navigate(`/chat/${newSession.id}`);
  };
  
  const handleDeleteSession = (id: string) => {
    setSessions(prev => prev.filter(s => s.id !== id));
    if(currentSession?.id === id) {
      navigate('/chat');
    }
  }
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if(e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      // Mock attachment
      setInput(`(Attached file: ${file.name}) `)
    }
  }

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;
    setIsLoading(true);

    const chatPersona = currentSession ? currentSession.persona : persona;
    const tool: 'generalQueries' | 'blockchainTools' = chatPersona === ChatPersona.REGULATOR ? 'blockchainTools' : 'generalQueries';
    
    const usageResult = await checkAndIncrementUsage(tool);
    if (!usageResult.allowed) {
      setFeatureForUpgrade(usageResult.featureName || 'this feature');
      setUpgradeModalOpen(true);
      setIsLoading(false);
      return;
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };
    setInput('');

    let updatedSession: ChatSession;

    if (currentSession) {
      const isFirstMessage = currentSession.messages.length === 0;
      updatedSession = {
        ...currentSession,
        title: isFirstMessage
          ? userMessage.text.substring(0, 40) + (userMessage.text.length > 40 ? '...' : '')
          : currentSession.title,
        messages: [...currentSession.messages, userMessage],
      };
      setCurrentSession(updatedSession);
      setSessions(prev => prev.map(s => s.id === updatedSession.id ? updatedSession : s));
    } else {
      // Fallback if message sent from placeholder screen without clicking "New Chat" first.
      updatedSession = {
        id: Date.now().toString(),
        title: userMessage.text.substring(0, 40) + (userMessage.text.length > 40 ? '...' : ''),
        messages: [userMessage],
        persona: persona,
        createdAt: new Date().toISOString(),
      };
      setSessions(prev => [updatedSession, ...prev]);
      setCurrentSession(updatedSession);
      navigate(`/chat/${updatedSession.id}`);
    }

    try {
      const aiResponseText = await apiService.getChatResponse(updatedSession.messages, updatedSession.persona);
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: aiResponseText,
        sender: 'ai',
        timestamp: new Date().toISOString(),
      };

      const finalSession = { ...updatedSession, messages: [...updatedSession.messages, aiMessage] };
      setCurrentSession(finalSession);
      setSessions(prev => prev.map(s => s.id === finalSession.id ? finalSession : s));
    } catch (error) {
      console.error("Failed to get AI response", error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I encountered an error. Please try again.",
        sender: 'ai',
        timestamp: new Date().toISOString(),
      };
       const finalSession = { ...updatedSession, messages: [...updatedSession.messages, errorMessage] };
       setCurrentSession(finalSession);
       setSessions(prev => prev.map(s => s.id === finalSession.id ? finalSession : s));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex h-[calc(100vh-64px)] bg-white">
        {/* Sidebar */}
        <div className="w-1/4 bg-brand-light border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <Button onClick={handleNewChat} className="w-full" variant="secondary">
              <PlusIcon className="h-5 w-5 mr-2" />
              New Chat
            </Button>
          </div>
          <div className="flex-grow overflow-y-auto">
            {sessions.map(session => (
              <div key={session.id} className={`flex items-center justify-between p-3 cursor-pointer hover:bg-blue-100 ${currentSession?.id === session.id ? 'bg-blue-200' : ''}`}>
                <span onClick={() => navigate(`/chat/${session.id}`)} className="truncate flex-grow">{session.title}</span>
                <button onClick={() => handleDeleteSession(session.id)} className="ml-2 text-gray-400 hover:text-red-500 flex-shrink-0">
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="w-3/4 flex flex-col">
          {!currentSession ? (
            <div className="flex flex-col items-center justify-center h-full">
              <LogoIcon className="h-24 w-24 text-gray-300"/>
              <h2 className="text-2xl font-bold mt-4 text-gray-700">Elby AI</h2>
              <p className="text-gray-500">Start a new conversation or select one from the sidebar.</p>
              <div className="mt-8">
                <label className="text-sm font-medium text-gray-700">Select a Persona:</label>
                <select value={persona} onChange={(e) => setPersona(e.target.value as ChatPersona)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm rounded-md">
                  <option>{ChatPersona.ASSISTANT}</option>
                  <option>{ChatPersona.REGULATOR}</option>
                </select>
              </div>
            </div>
          ) : (
            <>
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">{currentSession.title}</h3>
                  <p className="text-sm text-gray-500">Persona: {currentSession.persona}</p>
                </div>
                {currentSession.messages.length > 0 && (
                  <Button onClick={() => downloadAsPdf('chat-area', `${currentSession.title.replace(/\s+/g, '_')}`)} variant="ghost">
                    <DownloadIcon className="h-5 w-5 mr-2" />
                    Download Chat
                  </Button>
                )}
              </div>
              <div id="chat-area" className="flex-grow p-6 overflow-y-auto bg-gray-50">
                <div className="space-y-4">
                {currentSession.messages.length === 0 && (
                    <div className="text-center text-gray-500">
                        <p>Ask a question to start the conversation.</p>
                    </div>
                )}
                {currentSession.messages.map((msg, index) => (
                  <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xl px-4 py-2 rounded-lg ${msg.sender === 'user' ? 'bg-brand-primary text-white' : 'bg-white border'}`}>
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                   <div className="flex justify-start">
                     <div className="max-w-xl px-4 py-2 rounded-lg bg-white border">
                      <div className="flex items-center">
                        <span className="typing-indicator"></span>
                        <style>{`.typing-indicator { display: inline-block; width: 24px; height: 10px; position: relative; } .typing-indicator::before, .typing-indicator::after { content: ''; position: absolute; width: 6px; height: 6px; border-radius: 50%; background-color: #333; animation: typing 1s infinite; } .typing-indicator::before { left: 0; } .typing-indicator::after { right: 0; animation-delay: 0.5s; } @keyframes typing { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }`}</style>
                      </div>
                     </div>
                   </div>
                )}
                <div ref={chatEndRef} />
                </div>
              </div>
              <div className="p-4 bg-white border-t border-gray-200">
                <div className="relative">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder="Type your message here... (Shift+Enter for new line)"
                    className="w-full p-3 pr-24 border rounded-lg focus:ring-brand-primary focus:border-brand-primary resize-none"
                    rows={2}
                    disabled={isLoading}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-2">
                     <button onClick={() => fileInputRef.current?.click()} className="text-gray-500 hover:text-brand-primary" disabled={isLoading}>
                      <PaperclipIcon className="h-6 w-6" />
                    </button>
                     <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept=".pdf,.png,.jpg"/>
                    <Button onClick={handleSendMessage} disabled={isLoading || !input.trim()} size="sm" className="h-10 w-10 p-0">
                      <SendIcon className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <UpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setUpgradeModalOpen(false)}
        featureName={featureForUpgrade}
      />
    </>
  );
};

export default ChatPage;