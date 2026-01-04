'use client';

import { useChat } from '@ai-sdk/react';
import { Send, User, Bot, Sparkles, Loader2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const AVAILABLE_MODELS = [
  { id: 'google/gemini-2.0-flash', name: 'Gemini 2.0 Flash', icon: Sparkles },
  { id: 'google/gemini-1.5-pro', name: 'Gemini 1.5 Pro', icon: Bot },
  { id: 'google/gemini-1.5-flash', name: 'Gemini 1.5 Flash', icon: Bot },
  { id: 'openai/gpt-4o', name: 'GPT-4o', icon: Sparkles },
  { id: 'openai/gpt-4o-mini', name: 'GPT-4o Mini', icon: Bot },
  { id: 'openai/o1', name: 'OpenAI o1', icon: Sparkles },
];

export default function Chat() {
  const [inputValue, setInputValue] = useState('');
  const [selectedModel, setSelectedModel] = useState(AVAILABLE_MODELS[2].id);
  const [isModelMenuOpen, setIsModelMenuOpen] = useState(false);
  
  const { messages, sendMessage, status, error, stop, regenerate, setMessages } = useChat();
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isLoading = status === 'submitted' || status === 'streaming';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const currentInput = inputValue;
    setInputValue('');
    
    try {
      sendMessage({ text: currentInput }, { body: { model: selectedModel } });
    } catch (err) {
      console.error('Failed to send message:', err);
      setInputValue(currentInput); // Restore input on error
    }
  };

  const currentModel = AVAILABLE_MODELS.find(m => m.id === selectedModel) || AVAILABLE_MODELS[2];

  return (
    <div className="flex flex-col h-[600px] w-full max-w-2xl mx-auto bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden font-sans">
      {/* Header */}
      <div className="p-6 border-b border-white/10 bg-gradient-to-r from-blue-600/20 to-purple-600/20 flex items-center justify-between relative">
        <div className="flex items-center gap-3">
          <div className="relative">
            <button 
              onClick={() => setIsModelMenuOpen(!isModelMenuOpen)}
              className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center shadow-lg shadow-purple-500/20 hover:scale-105 transition-transform"
            >
              <currentModel.icon className="w-5 h-5 text-white" />
            </button>
            
            <AnimatePresence>
              {isModelMenuOpen && (
                <>
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsModelMenuOpen(false)}
                    className="fixed inset-0 z-40"
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-12 left-0 w-64 bg-[#1a1c2e] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden py-2"
                  >
                    <div className="px-4 py-2 border-b border-white/5 mb-2">
                      <p className="text-[10px] font-bold text-white/30 uppercase tracking-wider">Select Model</p>
                    </div>
                    {AVAILABLE_MODELS.map((model) => (
                      <button
                        key={model.id}
                        onClick={() => {
                          setSelectedModel(model.id);
                          setIsModelMenuOpen(false);
                        }}
                        className={cn(
                          "w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors hover:bg-white/5",
                          selectedModel === model.id ? "text-blue-400 bg-blue-400/5" : "text-white/60"
                        )}
                      >
                        <model.icon className={cn("w-4 h-4", selectedModel === model.id ? "text-blue-400" : "text-white/30")} />
                        <span className="font-medium">{model.name}</span>
                        {selectedModel === model.id && (
                          <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,1)]" />
                        )}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
          <div>
            <h2 className="text-white font-semibold text-lg">AI Assistant</h2>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <p className="text-white/50 text-xs font-medium uppercase tracking-wider">{currentModel.name}</p>
            </div>
          </div>
        </div>
        
        {isLoading ? (
          <button 
            onClick={() => stop()}
            className="text-xs px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all font-medium"
          >
            Stop
          </button>
        ) : (
          <div className="flex items-center gap-1 bg-white/5 rounded-full px-3 py-1 border border-white/10">
            <span className="text-[10px] text-white/40 font-bold uppercase tracking-tighter">Ready</span>
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
        <AnimatePresence initial={false}>
          {messages.length === 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="h-full flex flex-col items-center justify-center text-center space-y-4"
            >
              <div className="p-4 rounded-full bg-white/5 border border-white/10">
                <Bot className="w-8 h-8 text-white/30" />
              </div>
              <div>
                <h3 className="text-white font-medium">How can I help you today?</h3>
                <p className="text-white/40 text-sm max-w-[280px]">Ask me anything, I'm here to assist with your projects using {currentModel.name}.</p>
              </div>
            </motion.div>
          )}

          {messages.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={cn(
                "flex items-start gap-3",
                m.role === 'user' ? "flex-row-reverse" : "flex-row"
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm",
                m.role === 'user' ? "bg-blue-600" : "bg-white/10 border border-white/20"
              )}>
                {m.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white/70" />}
              </div>
              <div className={cn(
                "max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap",
                m.role === 'user' 
                  ? "bg-blue-600 text-white rounded-tr-none shadow-lg shadow-blue-900/20" 
                  : "bg-white/5 border border-white/10 text-white/90 rounded-tl-none backdrop-blur-sm"
              )}>
                {m.parts ? (
                  m.parts.map((part, i) => {
                    if (part.type === 'text') return <span key={i}>{part.text}</span>;
                    if (part.type === 'tool-invocation') {
                      const toolPart = part as any;
                      return <div key={i} className="text-xs opacity-50 italic">[Tool: {toolPart.toolInvocation.toolName}]</div>;
                    }
                    return null;
                  })
                ) : (
                  (m as any).content
                )}
              </div>
            </motion.div>
          ))}
          {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shadow-sm">
                <Loader2 className="w-4 h-4 text-white/40 animate-spin" />
              </div>
              <div className="bg-white/5 border border-white/10 text-white/40 p-3 rounded-2xl rounded-tl-none italic text-xs">
                Thinking with {currentModel.name}...
              </div>
            </div>
          )}
        </AnimatePresence>
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-red-400 text-sm flex items-center justify-between gap-4">
            <span>Something went wrong. Please check your API key.</span>
            <button 
              onClick={() => regenerate({ body: { model: selectedModel } })}
              className="px-3 py-1 bg-red-500/20 rounded-lg hover:bg-red-500/30 transition-colors text-xs font-semibold"
            >
              Retry
            </button>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-6 border-t border-white/10 bg-white/5">
        <div className="relative group">
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={`Message ${currentModel.name}...`}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-6 pr-14 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 transition-all shadow-inner"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="absolute right-2 top-2 bottom-2 w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all shadow-lg shadow-blue-500/20"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </div>
        <p className="mt-3 text-center text-[10px] text-white/20 uppercase tracking-widest font-medium">
          Powered by Vercel AI SDK & {currentModel.name.split(' ')[0]}
        </p>
      </form>
    </div>
  );
}
