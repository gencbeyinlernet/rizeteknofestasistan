
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { User } from '../types';

interface KackarAssistantProps {
  user: User;
}

const KACKAR_PROMPT = `
Senin adın Kaçkar. Rize'nin vakur ve yol gösterici zirvelerini temsil eden, bilge bir öğretmen edasında, son derece nazik, içten ve rehber bir Teknofest asistanısın.

ÜSLUP VE DAVRANIŞ KURALLARI:
1. ÖĞRETMEN EDASI: Konuşman hem samimi hem de bir eğitimcinin ağırlığını ve bilgisini taşımalıdır. Öğrencine yol gösteren, onu geliştirmeyi amaçlayan bir mentor gibi davran.
2. NEZAKET: Bir Karadeniz beyefendisi/hanımefendisi nezaketinde ol. Hitapların her zaman saygı ve sevgi çerçevesinde kalmalıdır.
3. KESİN YASAKLAR: Küfür, argo, aşağılayıcı ifade, "Selamünaleyküm" gibi dini selamlaşmalar (kullanıcı kullanmadıkça), siyasi polemik veya kaba kelimeleri ASLA kullanma.
4. YAPICILIK: Hataları kırmadan düzelt, öğrenciyi araştırmaya teşvik et. "Bunu beraber geliştirelim" mesajı ver.
5. HİTAPLAR: "Sevgili öğrencim", "Genç mucit arkadaşım", "Değerli kardeşim" gibi hem yakın hem de seviyeli hitaplar kullan.
6. GÜZELLİK VE DÜZGÜN TÜRKÇE: Dilin pürüzsüz, imla kurallarına uygun ve estetik olsun. Rize'nin berrak dereleri gibi akıcı bir Türkçeyle konuş.

Senin görevin, bir öğretmenin şefkati ve bir uzmanın bilgisiyle Teknofest sürecinde öğrenciye en doğru rehberliği yapmaktır.
`;

const KackarAssistant: React.FC<KackarAssistantProps> = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'model', text: string}[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = { role: 'user' as const, text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [...messages, userMsg].map(m => ({ role: m.role, parts: [{ text: m.text }] })),
        config: {
          systemInstruction: KACKAR_PROMPT,
          temperature: 0.7
        }
      });

      const aiText = response.text || "Sesin buraya kadar tam gelmedi sevgili öğrencim, bir daha söyler misin?";
      setMessages(prev => [...prev, { role: 'model', text: aiText }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', text: "Kaçkar'ın zirvesinde biraz duman var, şu an iletişim kuramadık. Kısa bir süre sonra tekrar dener misin?" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] font-sans">
      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-[350px] max-w-[90vw] h-[500px] max-h-[70vh] glass-card rounded-[2.5rem] shadow-2xl border border-emerald-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-500">
          <header className="p-5 bg-emerald-800 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg">
                <KackarIcon size={24} />
              </div>
              <div>
                <h3 className="font-black text-sm tracking-tight">Eğitmen Kaçkar</h3>
                <p className="text-[10px] text-emerald-300 font-bold uppercase tracking-widest">Bilge & Yol Gösterici</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:rotate-90 transition-transform">
              <CloseIcon />
            </button>
          </header>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/50">
            {messages.length === 0 && (
              <div className="text-center py-8 space-y-3">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-sm border border-emerald-50">
                   <KackarIcon size={32} />
                </div>
                <p className="text-xs font-bold text-slate-700 leading-relaxed px-4">
                  "Merhaba sevgili öğrencim! Ben Kaçkar. Proje yolculuğunda sana bir öğretmen titizliği ve bir dost samimiyetiyle rehberlik edeceğim. Nereden başlayalım?"
                </p>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3.5 rounded-2xl text-sm font-medium leading-relaxed ${
                  m.role === 'user' 
                    ? 'bg-emerald-600 text-white rounded-tr-none' 
                    : 'bg-white text-slate-700 border border-slate-200 rounded-tl-none shadow-sm'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-100 p-3 rounded-2xl rounded-tl-none flex gap-1 animate-pulse">
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-white border-t border-slate-100 flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Sorunu veya fikrini paylaş sevgili öğrencim..."
              className="flex-1 bg-slate-100 border-none rounded-xl px-4 py-2.5 text-xs font-medium focus:ring-2 focus:ring-emerald-500 transition-all"
            />
            <button 
              onClick={handleSend}
              className="bg-emerald-600 text-white p-2.5 rounded-xl hover:bg-emerald-700 transition-all"
            >
              <SendIcon />
            </button>
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`group relative w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 hover:scale-110 active:scale-95 border-4 border-white ${isOpen ? 'rotate-12 bg-indigo-600' : ''}`}
      >
        <div className="absolute -top-1 -right-1 bg-emerald-400 w-4 h-4 rounded-full border-2 border-white animate-pulse"></div>
        <KackarIcon size={32} color="white" />
        
        {/* Tooltip */}
        {!isOpen && (
          <div className="absolute right-20 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl">
            Kaçkar'a Sor!
          </div>
        )}
      </button>
    </div>
  );
};

const KackarIcon = ({ size = 24, color = "currentColor" }: { size?: number, color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 20L12 4L22 20H2Z" fill={color === "white" ? "rgba(255,255,255,0.2)" : "rgba(16,185,129,0.1)"} stroke={color} strokeWidth="2" strokeLinejoin="round"/>
    <path d="M7 12L12 6L17 12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="18" cy="16" r="3" fill="#fbbf24" stroke={color} strokeWidth="1.5"/>
    <path d="M17 16C17 16 17.5 17 18 17C18.5 17 19 16 19 16" stroke={color} strokeWidth="1" strokeLinecap="round"/>
    <path d="M16 19L15 21M20 19L21 21" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const SendIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);

export default KackarAssistant;
