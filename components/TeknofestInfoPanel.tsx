
import React, { useState } from 'react';

const TeknofestInfoPanel: React.FC = () => {
  const [activeStep, setActiveStep] = useState(1);

  const steps = [
    {
      id: 1,
      title: "Kategori & Şartname",
      content: "teknofest.org adresinden eğitim seviyenize uygun kategoriyi seçin ve mutlaka Yarışma Şartnamesi ile Rapor Şablonunu indirin."
    },
    {
      id: 2,
      title: "Kayıt & Takım",
      content: "t3kys.com üzerinden kaydınızı yapın. Takım üyelerini ve danışman öğretmen bilgilerinizi sisteme girin."
    },
    {
      id: 3,
      title: "Rapor Hazırlama",
      content: "Word şablonuna sadık kalarak (Arial, 12pt, max 6 sayfa) raporu hazırlayın. Mavi yazıları silmeyi unutmayın!"
    },
    {
      id: 4,
      title: "PDF & Yükleme",
      content: "Dosyanızı PDF formatına çevirin ve T3 KYS sisteminde 'Yeni Form Atandı' diyerek yüklemeyi tamamlayın."
    }
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center gap-4 border-b border-slate-200 pb-6">
        <div className="w-14 h-14 bg-emerald-600 rounded-[1.5rem] flex items-center justify-center text-white shadow-xl shadow-emerald-500/20">
          <InfoIcon />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Teknofest Rehberi: Fikirden Finale</h2>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Resmi Süreç ve Başarı Kriterleri</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-md transition-all">
          <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-4">
            <TargetIcon />
          </div>
          <h4 className="font-black text-slate-800 mb-2">1. Sorun Odaklılık</h4>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            Proje, çevrenizde gördüğünüz gerçek bir probleme çözüm aramalıdır. Sayısal verilerle sorunu net tanımlayın.
          </p>
        </div>
        <div className="glass-card p-6 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-md transition-all">
          <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
            <LightbulbIcon />
          </div>
          <h4 className="font-black text-slate-800 mb-2">2. Yenilik & Özgünlük</h4>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            Önerilen çözüm piyasadaki ürünlerden farklı olmalıdır. Daha ucuz, hızlı veya yerli olması bir farktır.
          </p>
        </div>
        <div className="glass-card p-6 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-md transition-all">
          <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-4">
            <SettingsIcon />
          </div>
          <h4 className="font-black text-slate-800 mb-2">3. Uygulanabilirlik</h4>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            Proje sadece teoride kalmamalıdır. Gerçek hayatta uygulanabilir ve ticarileşme potansiyeli olan bir fikir olmalıdır.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-6">
          <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-emerald-600 rounded-full"></span>
            Proje Geliştirme Metodolojisi
          </h3>
          <div className="space-y-4">
            <MethodItem 
              num="01" 
              title="Problemi Tanımlama" 
              desc="Sayısal veriler ve resmi kaynaklarla sorunu netleştirin (Örn: Ülkemizde 800.000 görme engelli vatandaşımız bulunmaktadır)." 
            />
            <MethodItem 
              num="02" 
              title="Literatür Taraması" 
              desc="Mevcut çözümlerin neden yetersiz olduğunu araştırın ve projenizin bu eksiklikleri nasıl giderdiğini belirtin." 
            />
            <MethodItem 
              num="03" 
              title="Yöntem & Dil" 
              desc="Kullanılan teknolojileri (Python, Arduino vb.) adım adım anlatın. 'Yapıldı/Edildi' gibi akademik dil kullanın." 
            />
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-indigo-600 rounded-full"></span>
            Adım Adım Başvuru Süreci
          </h3>
          <div className="bg-slate-50 rounded-[2.5rem] p-8 border border-slate-200">
            <div className="flex justify-between mb-8">
              {steps.map((s) => (
                <button 
                  key={s.id}
                  onClick={() => setActiveStep(s.id)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-black transition-all ${activeStep === s.id ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-slate-400 border border-slate-200'}`}
                >
                  {s.id}
                </button>
              ))}
            </div>
            <div className="animate-in fade-in slide-in-from-right-2 duration-300">
              <h4 className="font-black text-indigo-600 uppercase tracking-widest text-[10px] mb-2">Adım {activeStep}</h4>
              <h5 className="text-lg font-black text-slate-800 mb-3">{steps[activeStep - 1].title}</h5>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">{steps[activeStep - 1].content}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-red-50 border border-red-100 rounded-[2rem] p-8">
        <h3 className="text-red-800 font-black flex items-center gap-2 mb-4">
          <AlertIcon />
          Kritik Başarı Notları
        </h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-3 text-xs font-bold text-red-700/80 list-disc ml-4 leading-relaxed">
          <li>Ön değerlendirme aşamasında genellikle video istenmemektedir.</li>
          <li>Kaynakçada röportaj değil, bilimsel makale veya URL belirtilmelidir.</li>
          <li>Mavi bilgilendirme yazılarını mutlaka silin, temiz bir rapor sunun.</li>
          <li>Proje özetini raporun en sonunda, her şey bittikten sonra yazın.</li>
          <li>Kapak ve kaynakça dahil toplam 6 sayfa sınırını asla aşmayın.</li>
        </ul>
      </div>
    </div>
  );
};

const MethodItem = ({ num, title, desc }: { num: string, title: string, desc: string }) => (
  <div className="flex gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors group">
    <div className="text-2xl font-black text-slate-200 group-hover:text-emerald-200 transition-colors">{num}</div>
    <div>
      <h4 className="font-black text-slate-800 text-sm mb-1">{title}</h4>
      <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
    </div>
  </div>
);

const InfoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
);

const TargetIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
);

const LightbulbIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A5 5 0 0 0 8 8c0 1.3.5 2.6 1.5 3.5.8.8 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>
);

const SettingsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
);

const AlertIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
);

export default TeknofestInfoPanel;
