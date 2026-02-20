
import React from 'react';

const TeknofestCategories: React.FC = () => {
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 pb-8">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 bg-indigo-600 rounded-[2rem] flex items-center justify-center text-white shadow-xl shadow-indigo-500/20">
            <CategoryHeaderIcon />
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Hangi Kategoriye Başvurmalıyım?</h2>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">Eğitim Seviyelerine Göre Yarışma Grupları</p>
          </div>
        </div>
      </header>

      {/* İlkokul ve Ortaokul */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-8 w-1.5 bg-emerald-500 rounded-full"></div>
          <h3 className="text-xl font-black text-slate-800">İlkokul ve Ortaokul Seviyesi</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CategoryCard 
            title="Akıllı Ulaşım" 
            desc="Şehir içi trafik, güvenlik ve alternatif ulaşım çözümlerine yönelik projeler."
            color="emerald"
          />
          <CategoryCard 
            title="Çevre ve Enerji" 
            desc="Atık yönetimi, yenilenebilir enerji ve doğayı koruma odaklı teknolojik fikirler."
            color="emerald"
          />
          <CategoryCard 
            title="Eğitim Teknolojileri" 
            desc="Öğrenmeyi kolaylaştıran, kalıcı kılan dijital veya fiziksel materyaller."
            color="emerald"
          />
          <CategoryCard 
            title="Engelsiz Yaşam" 
            desc="Engelli bireylerin sosyal hayata katılımını artıran yardımcı teknolojiler."
            color="emerald"
          />
          <CategoryCard 
            title="İnsanlık Yararına Teknoloji" 
            desc="Sağlık, afet yönetimi ve sosyal inovasyon gibi toplum yararına çalışmalar."
            color="emerald"
          />
          <CategoryCard 
            title="Türkçe Doğal Dil İşleme" 
            desc="Türkçe metinleri anlayan, özetleyen veya işleyen yazılım projeleri."
            color="emerald"
            tag="Rapor Beklenmez"
          />
        </div>
      </section>

      {/* Sadece Ortaokul ve Üzeri */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-8 w-1.5 bg-blue-500 rounded-full"></div>
          <h3 className="text-xl font-black text-slate-800">Ortaokul ve Üzeri Özel Kategoriler</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CategoryCard 
            title="İnsansız Su Altı Sistemleri" 
            desc="Sualtı görevlerini otonom veya uzaktan kumandayla yapabilen robotik sistemler."
            color="blue"
          />
          <CategoryCard 
            title="Teknofest Robolig" 
            desc="Farklı görev senaryolarını yerine getiren otonom robot takımları mücadelesi."
            color="blue"
          />
        </div>
      </section>

      {/* Lise ve Üzeri */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-8 w-1.5 bg-indigo-500 rounded-full"></div>
          <h3 className="text-xl font-black text-slate-800">Lise ve Üzeri (Teknik Odaklı)</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CategoryCard title="Biyoteknoloji & İnovasyon" desc="Tıp, tarım ve sanayide kullanılan biyolojik sistem çözümleri." color="indigo" />
          <CategoryCard title="Efficiency Challenge" desc="En az enerjiyle en uzun mesafe giden elektrikli araç tasarımı." color="indigo" />
          <CategoryCard title="İnsansız Hava Araçları (İHA)" desc="Havadaki otonom görevleri başarıyla tamamlayan dronelar." color="indigo" />
          <CategoryCard title="İklim Değişikliği Araştırma" desc="Küresel ısınmaya karşı bilimsel temelli çözüm önerileri." color="indigo" />
          <CategoryCard title="Kutup Araştırma" desc="Kutuplardaki bilimsel hayatı ve doğayı inceleyen çalışmalar." color="indigo" />
          <CategoryCard title="Robotaksi (Otonom Araç)" desc="Şehir trafiğinde tam otonom sürüş yapabilen binek araçlar." color="indigo" />
          <CategoryCard title="Sağlıkta Yapay Zeka" desc="Teşhis ve tedavi süreçlerinde yapay zeka algoritmaları." color="indigo" />
          <CategoryCard title="Sanayide Dijital Teknolojiler" desc="Fabrika otomasyonu ve akıllı üretim bantları." color="indigo" />
          <CategoryCard title="Savaşan İHA" desc="Hava-hava görevlerini yerine getiren otonom hava araçları." color="indigo" />
          <CategoryCard title="Tarım Teknolojileri" desc="Verimi artıran akıllı sulama ve hasat sistemleri." color="indigo" />
          <CategoryCard title="Kablosuz Haberleşme" desc="Uzun mesafeli, kesintisiz ve güvenli veri aktarımı." color="indigo" />
          <CategoryCard title="Turizm Teknolojileri" desc="Turizm deneyimini dijitalleştiren yenilikçi yazılımlar." color="indigo" />
          <CategoryCard title="Uçan Araba Simülasyonu" desc="Geleceğin hava trafik kontrol ve araç simülasyonları." color="indigo" />
          <CategoryCard title="Ulaşımda Yapay Zeka" desc="Ulaşım ağlarını yöneten akıllı karar destek sistemleri." color="indigo" />
          <CategoryCard title="İnsansız Deniz Aracı" desc="Deniz yüzeyinde otonom seyir ve operasyon sistemleri." color="indigo" />
        </div>
      </section>
    </div>
  );
};

const CategoryCard = ({ title, desc, color, tag }: { title: string, desc: string, color: 'emerald' | 'blue' | 'indigo', tag?: string }) => {
  const colorClasses = {
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100'
  };

  return (
    <div className="glass-card p-6 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col group">
      <div className="flex justify-between items-start mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorClasses[color]} shadow-sm group-hover:scale-110 transition-transform`}>
          <CategoryIcon />
        </div>
        {tag && (
          <span className="text-[9px] font-black uppercase tracking-widest bg-slate-900 text-white px-2 py-1 rounded-lg">
            {tag}
          </span>
        )}
      </div>
      <h4 className="font-black text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">{title}</h4>
      <p className="text-xs text-slate-500 font-medium leading-relaxed">
        {desc}
      </p>
    </div>
  );
};

const CategoryHeaderIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
);

const CategoryIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v8"/><path d="M8 12h8"/></svg>
);

export default TeknofestCategories;
