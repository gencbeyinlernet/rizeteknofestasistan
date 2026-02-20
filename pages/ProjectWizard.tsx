
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { User } from '../types';
import { supabase } from '../lib/supabase';

const QUESTION_SET = [
  { id: 'q1', section: 'Problem ve İhtiyac', label: 'Hangi problemi çözüyorum?', placeholder: 'Çözmek istediğiniz sorunu net bir şekilde tanımlayın.' },
  { id: 'q2', section: 'Problem ve İhtiyac', label: 'Bu problem neden önemli?', placeholder: 'Problemin güncelliği ve ciddiyeti nedir?' },
  { id: 'q3', section: 'Hedef Kitle', label: 'Hedef kitle / kullanıcı kim?', placeholder: 'Bu çözümü kim kullanacak?' },
  { id: 'q4', section: 'Problem ve İhtiyac', label: 'Mevcut çözümler neler ve neden yetersiz?', placeholder: 'Rakipler veya şu anki yöntemler nerede tıkanıyor?' },
  { id: 'q5', section: 'Çözüm', label: 'Benim çözümüm ne öneriyor?', placeholder: 'Çözümünüzün temel çalışma prensibi nedir?' },
  { id: 'q6', section: 'İnovasyon', label: 'Projenin özgün ve yenilikçi yönü ne?', placeholder: 'Sizi diğerlerinden ayıran o "parlak" fikir nedir?' },
  { id: 'q7', section: 'Teknik', label: 'Hangi teknoloji ve yöntemleri kullanacağım?', placeholder: 'Yazılım dilleri, sensörler, algoritmalar...' },
  { id: 'q8', section: 'Kategori', label: 'Proje hangi TEKNOFEST kategorisine uyuyor?', placeholder: 'Akıllı Ulaşım, İnsanlık Yararına Teknoloji vb.' },
  { id: 'q9', section: 'Teknik', label: 'Projenin teknik kapsamı ve sınırları neler?', placeholder: 'Proje neyi yapar, neyi yapmaz?' },
  { id: 'q10', section: 'Uygulanabilirlik', label: 'Gerçek hayatta kullanım durumu nedir?', placeholder: 'Saha denemeleri veya prototip süreci nasıl olacak?' },
  { id: 'q11', section: 'Planlama', label: 'Geliştirme süreci nasıl ilerleyecek?', placeholder: 'Tasarım, geliştirme, test aşamaları.' },
  { id: 'q12', section: 'Takım', label: 'Takım yapısı ve görev dağılımı nasıl olacak?', placeholder: 'Yazılım, Tasarım, Mekanik sorumluları.' },
  { id: 'q13', section: 'Kaynaklar', label: 'Gerekli donanım, yazılım ve veri kaynakları neler?', placeholder: 'Hangi malzemelere ihtiyacınız var?' },
  { id: 'q14', section: 'Risk', label: 'Karşılaşılabilecek riskler ve çözüm planı nedir?', placeholder: 'Teknik veya lojistik aksaklıklara karşı B planınız ne?' },
  { id: 'q15', section: 'Başarı', label: 'Başarıyı nasıl ölçeceğim?', placeholder: 'Hangi metriklerle projenin çalıştığını kanıtlayacaksınız?' },
  { id: 'q16', section: 'Etki', label: 'Projenin yaygın etkisi ve sürdürülebilirliği nedir?', placeholder: 'Gelecekte proje nasıl büyüyecek?' },
  { id: 'q17', section: 'Etik', label: 'Etik, güvenlik ve yasal boyutlar var mı?', placeholder: 'Veri gizliliği, güvenlik önlemleri vb.' },
  { id: 'q18', section: 'Maliyet', label: 'Tahmini maliyet ve bütçe planı nedir?', placeholder: 'Projenin hayata geçmesi için gereken yaklaşık tutar ve harcama kalemleri.' },
];

const TEKNOFEST_EXPERT_PROMPT = `
Sen profesyonel bir Teknofest Jüri Üyesi ve Akademik Teknik Rapor Yazım Uzmanısın. Görevin, verilen yanıtları kullanarak kapsamlı, ikna edici ve profesyonel bir Ön Değerlendirme Raporu oluşturmaktır.

YAZIM KURALLARI:
1. DÜZ METİN FORMATI: Başlıkları belirlemek için #, ##, * veya - gibi karakterler kullanma. 
2. BAŞLIKLAR: Başlıkları tamamen BÜYÜK HARFLERLE yaz ve altına mutlaka boşluk bırak.
3. EMOJİ YASAK: Hiçbir şekilde emoji veya süsleme simgesi kullanma.
4. AKADEMİK DİL: Cümleler kurallı, teknik terimlere uygun ve "edilgen" (yapıldı, gözlemlendi, hedeflenmektedir) yapıda olmalıdır.
5. DETAYLI İÇERİK: Her bölümü en az 1-2 dolu paragraf olacak şekilde genişlet. 

RAPOR YAPISI (BU SIRALAMAYA KESİNLİKLE UY):
1. PROJE ÖZETİ (Tüm projeyi özetleyen profesyonel giriş)
2. PROBLEM / SORUN (Problemin tanımı, önemi ve sayısal veriler)
3. ÇÖZÜM (Önerilen çözümün temel mantığı ve işleyişi)
4. YÖNTEM (Teknik işleyiş, kullanılan teknolojiler ve algoritmalar)
5. YENİLİKÇİ (İNOVATİF) YÖNÜ (Mevcut çözümlerle kıyaslama ve farklar)
6. UYGULANABİLİRLİK (Saha denemeleri ve prototip süreci)
7. TAHMİNİ MALİYET (Bütçe kalemleri ve ekonomik analiz)
8. PROJE FİKRİNİN HEDEF KİTLESİ (KULLANICILAR) (Kimler, neden kullanmalı?)
9. RİSKLER (Teknik, lojistik riskler ve B planları)
10. PROJE EKİBİ (Takım yapısı ve görev dağılımı analizi)
11. KAYNAKLAR (Akademik formatta referanslar)

Her ana bölümden sonra şu alt başlıkları da detaylıca doldur:
JURİ GÖZÜNDEN ANALİZ (Teknik bir jürinin bu bölüme vereceği puan ve kritik yorum)
GÜÇLENDİRME ÖNERİSİ (Öğrencinin bu bölümü mükemmelleştirmesi için yapması gerekenler)

GELEN ÖĞRENCİ VERİLERİ:
`;

// Added missing interface definition to fix TypeScript error
interface ProjectWizardProps {
  user: User;
}

const ProjectWizard: React.FC<ProjectWizardProps> = ({ user }) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [generatedReport, setGeneratedReport] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [copyStatus, setCopyStatus] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [activeInfoTab, setActiveInfoTab] = useState<'puan' | 'red' | 'rehber'>('puan');

  const handleInputChange = (id: string, value: string) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const answersText = QUESTION_SET.map(q => `${q.label}: ${answers[q.id] || 'Öğrenci tarafından belirtilmedi.'}`).join('\n');
      const prompt = TEKNOFEST_EXPERT_PROMPT + answersText;

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
      });

      let text = response.text || "Rapor içeriği oluşturulurken bir hata oluştu.";
      
      text = text.replace(/^[#*>\- ]+/gm, '') 
                 .replace(/[#*`]/g, '')     
                 .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '') 
                 .trim();

      setGeneratedReport(text);
      setActiveStep(4); 
    } catch (err) {
      console.error(err);
      alert("Hata oluştu. Lütfen bağlantınızı kontrol edin.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendToTeacher = async () => {
    if (!generatedReport || isSending) return;
    
    setIsSending(true);
    try {
      const title = answers['q1'] ? (answers['q1'].length > 50 ? answers['q1'].substring(0, 50) + '...' : answers['q1']) : 'AI Destekli Teknofest Raporu';
      
      const projectData = {
        student_username: user.username,
        title: title,
        description: generatedReport,
        status: 'submitted',
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('projects')
        .insert([projectData]);

      if (error) throw error;
      
      alert("Raporunuz başarıyla danışman öğretmeninize jüri yorumları ile birlikte gönderildi!");
    } catch (err) {
      console.error(err);
      alert("Gönderim sırasında bir hata oluştu.");
    } finally {
      setIsSending(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedReport);
    setCopyStatus(true);
    setTimeout(() => setCopyStatus(false), 2000);
  };

  const currentQuestions = QUESTION_SET.slice((activeStep - 1) * 6, activeStep * 6);

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <div className="bg-indigo-600 text-white p-2 rounded-xl shadow-lg">
              <WizardIcon />
            </div>
            Jüri Kabul Odaklı Rapor Hazırlama
          </h1>
          <p className="text-slate-500 font-medium mt-1">Yapay zeka desteğiyle akademik standartlarda hatasız raporunuzu oluşturun.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-slate-100 p-1 rounded-full">
            {[1, 2, 3].map(step => (
              <div key={step} className={`w-8 h-8 flex items-center justify-center rounded-full text-xs font-black transition-all ${activeStep === step ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400'}`}>
                {step}
              </div>
            ))}
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {activeStep < 4 ? (
            <div className="glass-card p-8 rounded-[2.5rem] border border-slate-200 shadow-xl space-y-6 bg-white">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h3 className="font-black text-slate-800 uppercase tracking-widest text-sm">
                  Adım {activeStep}: {activeStep === 1 ? 'Temel Konsept' : activeStep === 2 ? 'Teknik Detaylar' : 'Uygulanabilirlik & Maliyet'}
                </h3>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Sayfa {activeStep}/3</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {currentQuestions.map(q => (
                  <div key={q.id} className="space-y-2">
                    <label className="text-[11px] font-black text-slate-600 uppercase tracking-tighter ml-1">{q.label}</label>
                    <textarea 
                      value={answers[q.id] || ''}
                      onChange={(e) => handleInputChange(q.id, e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs font-medium focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all min-h-[120px] resize-none"
                      placeholder={q.placeholder}
                    />
                  </div>
                ))}
              </div>

              <div className="flex gap-4 pt-4">
                {activeStep > 1 && (
                  <button onClick={() => setActiveStep(prev => prev - 1)} className="flex-1 py-4 bg-slate-100 text-slate-600 font-black rounded-2xl uppercase tracking-widest text-xs hover:bg-slate-200 transition-all">Geri</button>
                )}
                {activeStep < 3 ? (
                  <button onClick={() => setActiveStep(prev => prev + 1)} className="flex-1 py-4 bg-indigo-600 text-white font-black rounded-2xl uppercase tracking-widest text-xs hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all">Sonraki Adım</button>
                ) : (
                  <button onClick={handleGenerate} disabled={loading} className="flex-1 py-4 bg-slate-900 text-white font-black rounded-2xl uppercase tracking-widest text-xs hover:bg-black shadow-lg transition-all flex items-center justify-center gap-2">
                    {loading ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <SparklesIcon />}
                    Raporu Oluştur (Profesyonel Çıktı)
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="glass-card p-8 rounded-[2.5rem] border border-slate-200 shadow-2xl bg-white space-y-6">
               <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
                 <div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Oluşturulan Teknik Rapor</h3>
                    <p className="text-[10px] font-black text-indigo-600 uppercase mt-1">İmla kurallarına uygun, temiz akademik metin.</p>
                 </div>
                 <div className="flex gap-2">
                   <button onClick={() => setActiveStep(1)} className="px-4 py-2 bg-slate-100 text-slate-600 font-black text-[10px] rounded-xl uppercase tracking-widest hover:bg-slate-200">Geri Dön</button>
                   <button onClick={copyToClipboard} className={`px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${copyStatus ? 'bg-emerald-500 text-white' : 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'}`}>
                     {copyStatus ? 'KOPYALANDI' : 'METNİ KOPYALA'}
                   </button>
                   <button 
                     onClick={handleSendToTeacher}
                     disabled={isSending}
                     className={`px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 ${isSending ? 'bg-slate-200 text-slate-400' : 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-700'}`}
                   >
                     {isSending ? (
                       <div className="w-3 h-3 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                     ) : <SendIconSmall />}
                     ÖĞRETMENE GÖNDER
                   </button>
                 </div>
               </div>
               <div className="flex-1 overflow-y-auto max-h-[750px] custom-scrollbar pr-2">
                 <div className="bg-slate-50/50 p-8 rounded-3xl border border-slate-100">
                    <pre className="text-sm md:text-base font-medium text-slate-800 whitespace-pre-wrap font-sans leading-loose tracking-normal">
                      {generatedReport}
                    </pre>
                 </div>
               </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
            <div className="glass-card p-6 rounded-[2rem] border border-slate-200 shadow-sm bg-white/40">
                <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-6">
                    <button onClick={() => setActiveInfoTab('puan')} className={`flex-1 py-2 text-[10px] font-black rounded-xl uppercase tracking-tighter transition-all ${activeInfoTab === 'puan' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}>Puanlama</button>
                    <button onClick={() => setActiveInfoTab('red')} className={`flex-1 py-2 text-[10px] font-black rounded-xl uppercase tracking-tighter transition-all ${activeInfoTab === 'red' ? 'bg-white text-red-600 shadow-sm' : 'text-slate-500'}`}>Red Nedenleri</button>
                    <button onClick={() => setActiveInfoTab('rehber')} className={`flex-1 py-2 text-[10px] font-black rounded-xl uppercase tracking-tighter transition-all ${activeInfoTab === 'rehber' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500'}`}>Rehber</button>
                </div>

                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                    {activeInfoTab === 'puan' && (
                        <div className="space-y-3 animate-in fade-in duration-300">
                            <CriteriaItem label="Yöntem ve Hedef Kitle" score="24 Puan" desc="Bilimsel temelli yöntem, somut veriler ve doğru hedef kitle tanımı." />
                            <CriteriaItem label="Çözüm / İhtiyaç" score="16 Puan" desc="Net, mümkünse sayısal ve kaynaklı problem tanımı." />
                            <CriteriaItem label="Proje Özeti" score="14 Puan" desc="Konu–amaç (6), kapsam–yöntem (8). En son bölümdür." />
                            <CriteriaItem label="Rapor Düzeni" score="12 Puan" desc="Şablon, yazı tipi ve biçim kurallarına tam uyum (Kritik!)." />
                            <CriteriaItem label="Diğer Bölümler" score="22 Puan" desc="Yerlilik, özgünlük, yenilik, ticarileşme, takvim ve ekip." />
                            <CriteriaItem label="Kaynakça" score="6 Puan" desc="Erişilebilir ve eksiksiz akademik kaynaklar." />
                        </div>
                    )}
                    {activeInfoTab === 'red' && (
                        <div className="space-y-3 animate-in fade-in duration-300">
                            <RedItem label="Şablon İhlali" desc="Word şablonunun değiştirilmesi doğrudan elenme sebebidir." />
                            <RedItem label="Sayfa Sınırı" desc="Kapak ve kaynakça dahil toplam 6 sayfa aşılmamalıdır." />
                            <RedItem label="Günlük Dil Kullanımı" desc="Öznel ve samimi dil kullanımı akademik raporda puan kaybettirir." />
                            <RedItem label="Kaynak Göstermeme" desc="İnternet haberleri yerine akademik URL veya makale sunulmalıdır." />
                        </div>
                    )}
                    {activeInfoTab === 'rehber' && (
                        <div className="space-y-3 animate-in fade-in duration-300">
                            <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl">
                                <h4 className="text-xs font-black text-emerald-800 uppercase mb-2">Başarı İçin İpucu</h4>
                                <ul className="text-[10px] text-emerald-700 font-bold space-y-2 list-disc ml-4">
                                    <li>Cümlelerinizi 'yaptım' yerine 'yapıldı' şeklinde kurun.</li>
                                    <li>AI'nın verdiği 'Güçlendirme Önerileri'ni mutlaka uygulayın.</li>
                                    <li>Maliyet hesabında gerçekçi rakamlar sunmaya özen gösterin.</li>
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

const CriteriaItem = ({ label, score, desc }: any) => (
    <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
        <div className="flex justify-between items-center mb-1">
            <span className="text-[11px] font-black text-slate-700 uppercase tracking-tighter">{label}</span>
            <span className="text-[10px] font-black text-indigo-600 px-2 py-0.5 bg-indigo-50 rounded-md">{score}</span>
        </div>
        <p className="text-[10px] text-slate-400 font-bold leading-tight">{desc}</p>
    </div>
);

const RedItem = ({ label, desc }: any) => (
    <div className="p-3 bg-red-50/50 rounded-xl border border-red-100">
        <p className="text-[11px] font-black text-red-700 mb-1">{label}</p>
        <p className="text-[10px] text-red-500/70 font-bold leading-tight">{desc}</p>
    </div>
);

const WizardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/><path d="M12 12v6"/><path d="M12 6v6h6"/></svg>
);

const SparklesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
);

const SendIconSmall = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
);

export default ProjectWizard;
