
import React, { useState, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";

// PDF ve Word işleme kütüphanelerini dinamik olarak yüklemek için esm.sh kullanıyoruz
const MAMMOTH_URL = 'https://esm.sh/mammoth@1.8.0';
const PDFJS_URL = 'https://esm.sh/pdfjs-dist@4.10.38';
const PDFJS_WORKER_URL = 'https://esm.sh/pdfjs-dist@4.10.38/build/pdf.worker.mjs';

const ANALYZE_PROMPT = `
Sen Teknofest Jüri üyesisin. Aşağıdaki proje rapor metnini detaylıca analiz et.

GÖREVLER:
1. PUANLA: 100 üzerinden akademik ve teknik bir puan ver.
2. ANALİZ: Güçlü yönler (3 madde) ve Geliştirilmesi Gereken Yönler (3 madde) yaz.
3. JÜRİ YORUMU: [Genel değerlendirme ve kritik tavsiyeler]

ÇIKTI FORMATI:
**PUAN:** [0-100 arası sayı]
**GÜÇLÜ YÖNLER:**
- Madde 1
- Madde 2
- Madde 3
**GELİŞTİRİLMELİ:**
- Madde 1
- Madde 2
- Madde 3
**JÜRİ YORUMU:** [Genel değerlendirme]
`;

const REWRITE_PROMPT = `
Aşağıdaki metni Teknofest Rapor standartlarına uygun, akademik, teknik terimlerin doğru kullanıldığı, ikna edici ve profesyonel bir dille YENİDEN YAZ. Başlıkları koru ancak içeriği zenginleştir.
`;

const ExternalProjectAnalyzer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);
  const [projectText, setProjectText] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [mode, setMode] = useState<'analyze' | 'rewrite'>('analyze');
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const extractTextFromDocx = async (file: File) => {
    try {
      const mammoth = await import(MAMMOTH_URL);
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      return result.value;
    } catch (err) {
      console.error("Docx Error:", err);
      throw new Error("Word belgesi okunamadı.");
    }
  };

  const extractTextFromPdf = async (file: File) => {
    try {
      const pdfjsLib = await import(PDFJS_URL);
      pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER_URL;
      
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = "";
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join(" ");
        fullText += pageText + "\n";
      }
      return fullText;
    } catch (err) {
      console.error("PDF Error:", err);
      throw new Error("PDF belgesi okunamadı.");
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setExtracting(true);
    setFileName(file.name);
    try {
      let extractedText = "";
      if (file.type === "application/pdf") {
        extractedText = await extractTextFromPdf(file);
      } else if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        extractedText = await extractTextFromDocx(file);
      } else {
        alert("Lütfen sadece .pdf veya .docx formatında dosya yükleyin.");
        setFileName(null);
        return;
      }
      setProjectText(extractedText);
    } catch (err: any) {
      alert(err.message);
      setFileName(null);
    } finally {
      setExtracting(false);
    }
  };

  const handleProcess = async (action: 'analyze' | 'rewrite') => {
    if (!projectText.trim()) return;
    setLoading(true);
    setMode(action);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = action === 'analyze' ? ANALYZE_PROMPT : REWRITE_PROMPT;
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt + "\n\nPROJE METNİ:\n" + projectText,
      });

      setResult(response.text || 'Analiz yapılamadı.');
    } catch (err) {
      setResult('Bağlantı hatası oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="group glass-card p-6 rounded-[2rem] border border-slate-200 text-left transition-all hover:shadow-2xl hover:border-indigo-300 flex flex-col h-full bg-indigo-50/30"
      >
        <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
          <UploadIcon />
        </div>
        <h3 className="text-xl font-black text-slate-900 mb-2">Dış Kaynaklı Proje Analizi</h3>
        <p className="text-slate-500 text-xs font-medium leading-relaxed mb-4">
          Dosya yükleyerek veya metin yapıştırarak raporunuzu Teknofest standartlarına göre analiz edin.
        </p>
        <div className="mt-auto flex items-center gap-2 text-indigo-600 font-black uppercase text-[10px] tracking-widest">
          Belge Yükle / Analiz Et <ArrowRightIcon />
        </div>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-5xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <header className="p-6 bg-indigo-900 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center border border-white/10">
              <ScanIcon />
            </div>
            <div>
              <h2 className="text-lg font-black uppercase tracking-tight">Akıllı Rapor Analizi</h2>
              <p className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest">PDF, Word ve Metin Analizi</p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="hover:rotate-90 transition-transform p-2 bg-white/10 rounded-full">
            <CloseIcon />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-slate-50">
          {!consentGiven ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-6 max-w-lg mx-auto py-12">
              <div className="w-20 h-20 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mb-2 animate-bounce">
                <ShieldIcon />
              </div>
              <h3 className="text-2xl font-black text-slate-800">Veri İşleme ve Etik Onayı</h3>
              <p className="text-slate-500 font-medium leading-relaxed text-sm">
                Yükleyeceğiniz dosyalar veya yapıştıracağınız metinler, analiz edilmek üzere yapay zeka sunucularına iletilecektir. Bu veriler sistem tarafından yedeklenebilir ve işlenebilir.
              </p>
              
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-left w-full space-y-3">
                <label className="flex items-start gap-4 cursor-pointer group">
                  <div className="relative flex items-center mt-1">
                    <input 
                      type="checkbox" 
                      className="peer h-6 w-6 cursor-pointer appearance-none rounded-lg border-2 border-slate-300 transition-all checked:border-indigo-600 checked:bg-indigo-600 hover:border-indigo-400"
                      onChange={(e) => setConsentGiven(e.target.checked)}
                    />
                     <svg className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                  <span className="text-xs font-bold text-slate-600 leading-tight group-hover:text-slate-800 transition-colors">
                    Belgemin yapay zeka sistemleri tarafından yedekleneceğini, işleneceğini ve analiz edileceğini biliyor; etik kuralları kabul ediyorum.
                  </span>
                </label>
              </div>

              <button 
                disabled={!consentGiven}
                className={`px-8 py-4 rounded-xl font-black uppercase tracking-widest text-xs transition-all ${consentGiven ? 'bg-indigo-600 text-white shadow-lg hover:bg-indigo-700' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
              >
                {consentGiven ? 'Sistemi Kullanmaya Başla' : 'Lütfen Onaylayın'}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
              <div className="flex flex-col gap-5 h-full">
                
                {/* File Upload Zone */}
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative group cursor-pointer border-2 border-dashed rounded-3xl p-8 transition-all flex flex-col items-center justify-center text-center gap-3 ${extracting ? 'bg-slate-100 border-indigo-300 cursor-wait' : 'bg-white border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/30'}`}
                >
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept=".pdf,.docx" 
                    onChange={handleFileChange}
                  />
                  {extracting ? (
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                      <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Metin Çıkarılıyor...</p>
                    </div>
                  ) : fileName ? (
                    <div className="flex flex-col items-center gap-1 animate-in zoom-in">
                      <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
                        <FileIcon />
                      </div>
                      <p className="text-xs font-black text-slate-800">{fileName}</p>
                      <p className="text-[9px] font-bold text-emerald-600 uppercase">Dosya Başarıyla Hazırlandı</p>
                    </div>
                  ) : (
                    <>
                      <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:text-indigo-500 transition-all">
                        <UploadIcon />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-black text-slate-800">Dosya Yükle (.pdf, .docx)</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">veya rapor içeriğini aşağıya yapıştırın</p>
                      </div>
                    </>
                  )}
                </div>

                <textarea
                  value={projectText}
                  onChange={(e) => setProjectText(e.target.value)}
                  placeholder="Rapor metni buraya otomatik çıkarılır veya elle girilebilir..."
                  className="flex-1 w-full bg-white border border-slate-200 rounded-2xl p-6 text-sm font-medium focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all resize-none shadow-sm min-h-[200px]"
                />
                
                <div className="flex gap-3">
                  <button 
                    onClick={() => handleProcess('analyze')}
                    disabled={loading || !projectText || extracting}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl font-black uppercase tracking-widest text-xs shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading && mode === 'analyze' ? 'Jüri İnceliyor...' : <><ChartIcon /> Puanla & Analiz Et</>}
                  </button>
                  <button 
                    onClick={() => handleProcess('rewrite')}
                    disabled={loading || !projectText || extracting}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-xl font-black uppercase tracking-widest text-xs shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading && mode === 'rewrite' ? 'Yeniden Yazılıyor...' : <><PenIcon /> Akademik Derle</>}
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col h-full overflow-hidden">
                <header className={`p-4 border-b flex justify-between items-center ${mode === 'analyze' ? 'bg-indigo-50 border-indigo-100' : 'bg-emerald-50 border-emerald-100'}`}>
                  <h3 className={`text-sm font-black uppercase tracking-widest ${mode === 'analyze' ? 'text-indigo-700' : 'text-emerald-700'}`}>
                    {result ? (mode === 'analyze' ? 'Jüri Analiz Raporu' : 'Düzeltilmiş Akademik Metin') : 'Sonuç Bekleniyor'}
                  </h3>
                  {result && (
                    <span className="text-[9px] font-black px-2 py-1 bg-white rounded-lg shadow-sm">AI-Generated</span>
                  )}
                </header>
                <div className="p-8 flex-1 overflow-y-auto custom-scrollbar bg-slate-50/30">
                  {loading ? (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-6">
                      <div className="relative">
                        <div className="w-16 h-16 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <BrainIconSmall />
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="text-xs font-black uppercase tracking-widest text-slate-600">Jüri Değerlendiriyor</p>
                        <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">Lütfen bekleyin...</p>
                      </div>
                    </div>
                  ) : result ? (
                    <div className="prose prose-indigo max-w-none text-slate-700 font-medium whitespace-pre-wrap leading-loose">
                      {result}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-slate-300 italic text-sm font-medium p-12 text-center space-y-4">
                      <div className="opacity-20"><BrainIconLarge /></div>
                      <p>Henüz analiz başlatılmadı. Sol taraftan metin girişi yapın veya dosya yükleyin.</p>
                    </div>
                  )}
                </div>
                {result && (
                  <div className="p-4 border-t border-slate-100 bg-white">
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(result);
                        alert("Sonuç kopyalandı!");
                      }}
                      className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-black rounded-xl text-xs uppercase tracking-widest transition-all"
                    >
                      Sonucu Kopyala
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Icons
const UploadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
);

const FileIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
);

const ScanIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><rect x="7" y="7" width="10" height="10" rx="1"/></svg>
);

const ShieldIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
);

const ChartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>
);

const PenIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);

const ArrowRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
);

const BrainIconSmall = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600"><path d="M12 11c0 3.517-1.009 6.799-2.753 9.571m2.753-9.571c0-3.517 1.009-6.799 2.753-9.571m-2.753 9.571h3m-3 0H9m1.247 9.571C11.161 21.365 12 23 12 23s.839-1.635 1.753-2.429M12 2v2m-6.536 2.464l1.414 1.414m10.242 0l1.414-1.414M2 12h2m16 0h2m-6.536 6.536l1.414-1.414M5.122 17.122l1.414 1.414"></path></svg>
);

const BrainIconLarge = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-200"><path d="M12 11c0 3.517-1.009 6.799-2.753 9.571m2.753-9.571c0-3.517 1.009-6.799 2.753-9.571m-2.753 9.571h3m-3 0H9m1.247 9.571C11.161 21.365 12 23 12 23s.839-1.635 1.753-2.429M12 2v2m-6.536 2.464l1.414 1.414m10.242 0l1.414-1.414M2 12h2m16 0h2m-6.536 6.536l1.414-1.414M5.122 17.122l1.414 1.414"></path></svg>
);

export default ExternalProjectAnalyzer;
