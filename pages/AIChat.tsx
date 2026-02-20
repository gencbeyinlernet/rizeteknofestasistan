
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { User, ChatMessage } from '../types';
import { SYSTEM_PROMPT } from '../constants';
import { supabase } from '../lib/supabase';

interface AIChatProps {
  user: User;
  onUpdateChat: (history: ChatMessage[]) => void;
}

const AIChat: React.FC<AIChatProps> = ({ user, onUpdateChat }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadChatHistory();
  }, []);

  const loadChatHistory = async () => {
    const { data, error } = await supabase
      .from('chat_history')
      .select('*')
      .eq('username', user.username)
      .order('timestamp', { ascending: true });
    
    if (data && !error) {
      setMessages(data.map(m => ({ role: m.role as any, text: m.text, timestamp: m.timestamp })));
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = { role: 'user', text: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    // Save user message to Supabase
    await supabase.from('chat_history').insert([{
      username: user.username,
      role: 'user',
      text: userMsg.text,
      timestamp: userMsg.timestamp
    }]);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const currentHistory = [...messages, userMsg];
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: currentHistory.map(m => ({ role: m.role, parts: [{ text: m.text }] })),
        config: {
          systemInstruction: SYSTEM_PROMPT,
          temperature: 0.7
        }
      });

      const aiText = response.text || "Üzgünüm, şu an yanıt veremiyorum.";
      const aiMsg: ChatMessage = { role: 'model', text: aiText, timestamp: Date.now() };
      
      setMessages(prev => [...prev, aiMsg]);

      // Save AI response to Supabase
      await supabase.from('chat_history').insert([{
        username: user.username,
        role: 'model',
        text: aiMsg.text,
        timestamp: aiMsg.timestamp
      }]);

    } catch (err) {
      console.error(err);
      const errBtn: ChatMessage = { role: 'model', text: "Bağlantı hatası oluştu. Lütfen tekrar deneyin.", timestamp: Date.now() };
      setMessages(prev => [...prev, errBtn]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] md:h-[calc(100vh-120px)] bg-white/60 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white/40 overflow-hidden relative">
      <header className="p-5 md:p-6 bg-emerald-800 text-white flex items-center justify-between shadow-lg z-10">
        <div className="flex items-center gap-4">
          <div className="bg-white/20 p-2.5 rounded-xl shadow-inner">
            <BrainIcon />
          </div>
          <div>
            <h2 className="font-black text-lg leading-tight tracking-tight uppercase">Rize Teknofest AI</h2>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></span>
              <p className="text-[10px] uppercase font-black text-emerald-100 tracking-widest">Asistan Aktif</p>
            </div>
          </div>
        </div>
        {loading && (
          <div className="flex items-center gap-2 bg-emerald-900 px-4 py-1.5 rounded-full border border-emerald-700/30 shadow-inner">
             <div className="flex gap-1">
               <span className="w-1.5 h-1.5 bg-emerald-300 rounded-full animate-bounce"></span>
               <span className="w-1.5 h-1.5 bg-emerald-300 rounded-full animate-bounce [animation-delay:0.2s]"></span>
               <span className="w-1.5 h-1.5 bg-emerald-300 rounded-full animate-bounce [animation-delay:0.4s]"></span>
             </div>
             <span className="text-[10px] font-black uppercase tracking-widest text-emerald-200">Düşünüyor</span>
          </div>
        )}
      </header>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 bg-slate-50/30 scroll-smooth"
      >
        {messages.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-6 animate-in fade-in zoom-in duration-700">
            <div className="w-24 h-24 bg-white rounded-3xl shadow-2xl flex items-center justify-center text-emerald-600 border border-slate-100 relative">
                <div className="absolute -top-2 -right-2 bg-emerald-500 text-white p-1.5 rounded-lg shadow-lg">
                  <SparklesIcon />
                </div>
                <BrainLargeIcon />
            </div>
            <div className="max-w-xs">
                <p className="font-black text-slate-800 text-xl mb-2">Merhaba {user.username}! ☕</p>
                <p className="text-sm font-medium text-slate-500 leading-relaxed">
                  Rize Teknofest asistanın olarak buradayım. Çay tadında, özgün bir proje geliştirmeye ne dersin?
                </p>
            </div>
            <div className="flex flex-wrap justify-center gap-2 max-w-sm">
                <SuggestionChip label="Proje fikri üret" onClick={() => setInput("Bana lise seviyesinde özgün bir Teknofest projesi fikri verir misin?")} />
                <SuggestionChip label="Rapor bölümleri nedir?" onClick={() => setInput("Teknofest proje raporunda hangi bölümler bulunmalıdır?")} />
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
            <div className={`max-w-[90%] md:max-w-[75%] p-5 md:p-6 rounded-[2rem] shadow-sm flex flex-col ${
              m.role === 'user' 
                ? 'bg-emerald-600 text-white rounded-tr-none shadow-emerald-600/10' 
                : 'bg-white text-slate-700 rounded-tl-none border border-slate-200/50 shadow-slate-200/20'
            }`}>
              <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap font-medium">{m.text}</p>
              <p className={`text-[10px] mt-4 font-black uppercase tracking-widest opacity-40 ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
                {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        {loading && (
           <div className="flex justify-start animate-pulse">
             <div className="bg-white border border-slate-100 p-6 rounded-[2rem] rounded-tl-none">
               <div className="flex gap-2">
                 <div className="w-2 h-2 bg-slate-300 rounded-full"></div>
                 <div className="w-2 h-2 bg-slate-300 rounded-full"></div>
                 <div className="w-2 h-2 bg-slate-300 rounded-full"></div>
               </div>
             </div>
           </div>
        )}
      </div>

      <div className="p-4 md:p-6 bg-white/80 backdrop-blur-md border-t border-slate-200/50">
        <div className="flex gap-3 max-w-4xl mx-auto">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Asistanına sor..."
            className="flex-1 bg-slate-100/80 border border-slate-200 rounded-[1.5rem] px-6 py-4 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-sm md:text-base font-medium shadow-inner"
          />
          <button 
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="bg-emerald-600 hover:bg-emerald-700 text-white p-4 rounded-[1.5rem] shadow-xl shadow-emerald-600/20 transition-all active:scale-95 disabled:opacity-50 disabled:scale-100"
          >
            <SendIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

const SuggestionChip = ({ label, onClick }: any) => (
  <button 
    onClick={onClick}
    className="bg-white border border-slate-200 px-4 py-2 rounded-full text-xs font-bold text-slate-600 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700 transition-all shadow-sm"
  >
    {label}
  </button>
);

const BrainIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21c-4.97 0-9-3.134-9-7s4.03-7 9-7 9 3.134 9 7-4.03 7-9 7z"/><path d="M12 7V2"/><path d="M12 21v-3"/><path d="M7 10h10"/></svg>
);
const BrainLargeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21c-4.97 0-9-3.134-9-7s4.03-7 9-7 9 3.134 9 7-4.03 7-9 7z"/><path d="M12 7V2"/><path d="M12 21v-3"/><path d="M7 10h10"/></svg>
);
const SparklesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
);
const SendIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
);

export default AIChat;
