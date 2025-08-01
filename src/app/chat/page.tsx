'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { logout } from '../logout/actions';
import { FaUserCircle } from 'react-icons/fa';
import { RiRobot3Fill } from 'react-icons/ri';
import { createClient } from '@/utils/supabase/client';

const demoUser = {
  name: 'You',
};
const botUser = {
  name: 'Bot',
};

function formatTime(date: Date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

type Message = {
  id: number;
  user: typeof demoUser | typeof botUser;
  text: string;
  time: string;
};

// Typing indicator component
const TypingIndicator = () => (
  <div className="flex items-end gap-3 justify-start">
    <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-gray-300 text-white">
      <RiRobot3Fill className="h-6 w-6" />
    </span>
    <div className="relative px-4 py-2 rounded-xl max-w-[70%] shadow-md bg-white text-gray-800 border border-gray-200 rounded-bl-none">
      <div className="flex items-center gap-1.5">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
    </div>
  </div>
);

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          return;
        }

        const { data: messages, error } = await supabase
          .from('messages')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: true });

        if (error) {
          throw error;
        }

        if (messages && messages.length > 0) {
          const formattedMessages = messages.map((msg: {
            id: number;
            is_bot: boolean;
            text: string;
            created_at: string;
          }) => ({
            id: msg.id,
            user: msg.is_bot ? botUser : demoUser,
            text: msg.text,
            time: formatTime(new Date(msg.created_at)),
          }));
          setMessages(formattedMessages);
          setShowSuggestions(false);
        } else {
          setShowSuggestions(true);
        }
      } catch (error) {
        console.error('Error loading messages:', error);
        setTimeout(() => {
          setMessages([
            {
              id: 1,
              user: botUser,
              text: "👋 Hi! I'm your AI assistant (Gemini). How can I help you today?",
              time: formatTime(new Date()),
            },
          ]);
        }, 500);
      }
    };

    loadMessages();

    const supabase = createClient();
    const channel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        (payload: { new: { id: number; is_bot: boolean; text: string; created_at: string } }) => {
          const newMessage = payload.new;
          if (newMessage) {
            setMessages((prev) => [
              ...prev,
              {
                id: newMessage.id,
                user: newMessage.is_bot ? botUser : demoUser,
                text: newMessage.text,
                time: formatTime(new Date(newMessage.created_at)),
              },
            ]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

    const sendMessage = async (messageText: string) => {
    if (!messageText.trim()) return;

    setInput('');
    setShowSuggestions(false);

    const newMsg = {
      id: Date.now(),
      user: demoUser,
      text: messageText,
      time: formatTime(new Date()),
    };

    setMessages((msgs) => [...msgs, newMsg]);
    setIsTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageText }),
      });
      const data = await res.json();

      setTimeout(() => {
        setIsTyping(false);
        setMessages((msgs) => [
          ...msgs,
          {
            id: Date.now() + 1,
            user: botUser,
            text: data.reply,
            time: formatTime(new Date()),
          },
        ]);
      }, 1000);
    } catch {
      setTimeout(() => {
        setIsTyping(false);
        setMessages((msgs) => [
          ...msgs,
          {
            id: Date.now() + 1,
            user: botUser,
            text: "❌ Error: Could not get a reply from Gemini.",
            time: formatTime(new Date()),
          },
        ]);
      }, 1000);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };


  const handleSuggestionClick = (promptText: string) => {
    sendMessage(promptText);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-white" style={{ backgroundImage: `linear-gradient(45deg, #f0f0f0 25%, transparent 25%), linear-gradient(-45deg, #f0f0f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f0f0f0 75%), linear-gradient(-45deg, transparent 75%, #f0f0f0 75%)`, backgroundSize: `20px 20px` }}></div>
      
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-white shadow-sm border-b border-gray-200">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-green-500 text-white shadow">
            <RiRobot3Fill className="h-6 w-6" />
          </span>
          <span className="text-xl font-bold text-gray-800 tracking-tight">
            Gemini
          </span>
        </div>
        <button
          onClick={() => setShowSignOutModal(true)}
          className="px-4 py-2 rounded-lg font-semibold bg-green-500 text-white shadow-sm hover:bg-green-600 transition-colors duration-200"
          type="button"
        >
          Sign Out
        </button>
      </header>

      {/* Chat Area */}
      <div className="flex-1 w-full max-w-4xl mx-auto flex flex-col p-4">
        <div 
          className="flex-1 flex flex-col gap-4 p-6 overflow-y-auto scrollbar-hide" 
          style={{ 
            maxHeight: 'calc(100vh - 160px)',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          <style jsx>{`
            .scrollbar-hide::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          
          {showSuggestions ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <h1 className="text-4xl font-bold text-gray-700 mb-4">How can I help?</h1>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                {[ 'Write an email', 'Build a website', 'Research a topic', 'Create an image', ].map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handleSuggestionClick(prompt)}
                    className="px-4 py-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 hover:shadow-md transition-all duration-200 text-gray-700 font-semibold"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          ) : messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-end gap-3 ${
                msg.user.name === demoUser.name 
                  ? 'justify-end' 
                  : 'justify-start'
              }`}
            >
              {msg.user.name !== demoUser.name && (
                <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-gray-300">
                  <RiRobot3Fill className="h-6 w-6 text-white" />
                </span>
              )}
              <div
                className={`relative px-4 py-3 rounded-xl max-w-[70%] shadow ${
                  msg.user.name === demoUser.name
                    ? 'bg-green-500 text-white rounded-br-none'
                    : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                }`}
              >
                <p className="text-base">{msg.text}</p>
                <p
                  className={`text-xs mt-1.5 text-right ${
                    msg.user.name === demoUser.name ? 'text-green-100' : 'text-gray-400'
                  }`}
                >
                  {msg.time}
                </p>
              </div>
              {msg.user.name === demoUser.name && (
                <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-gray-300">
                  <FaUserCircle className="h-6 w-6 text-white" />
                </span>
              )}
            </div>
          ))}
          
          {isTyping && <TypingIndicator />}
          
          <div ref={chatEndRef}></div>
        </div>
      </div>

      {/* Input Bar */}
      <footer className="sticky bottom-0 z-10 bg-white/80 backdrop-blur-sm border-t border-gray-200">
        <form
          onSubmit={handleFormSubmit}
          className="w-full max-w-4xl mx-auto flex items-center gap-3 p-4"
        >
          <input
            type="text"
            className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-800 placeholder:text-gray-400 transition"
            placeholder="Type your message…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isTyping}
          />
          <button
            type="submit"
            disabled={isTyping || !input.trim()}
            className="px-5 py-2.5 rounded-lg font-semibold bg-green-500 text-white shadow-sm hover:bg-green-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isTyping ? '...' : 'Send'}
          </button>
        </form>
      </footer>

      <AnimatePresence>
        {showSignOutModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-sm m-4"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Confirm Sign Out</h2>
              <p className="text-gray-600 mb-8">Are you sure you want to sign out?</p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowSignOutModal(false)}
                  className="px-5 py-2.5 rounded-lg font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
                <form action={logout}>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-lg font-semibold text-white bg-red-500 hover:bg-red-600 transition"
                  >
                    Sign Out
                  </button>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}