
import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { ADMIN_CREDENTIALS } from '../constants';
import { supabase } from '../lib/supabase';
import { RizeTeknofestLogo } from './Layout';

interface AuthProps {
  onLogin: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<UserRole>(UserRole.STUDENT);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [advisor, setAdvisor] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const { data, error: fetchError } = await supabase
          .from('users')
          .select('*')
          .eq('username', username)
          .eq('password', password)
          .single();

        if (fetchError || !data) {
          setError('Kullanıcı adı veya şifre yanlış!');
        } else {
          onLogin(data);
        }
      } else {
        const { error: regError } = await supabase
          .from('users')
          .insert([
            {
              username,
              password,
              role,
              advisor_username: role === UserRole.STUDENT ? advisor : null
            }
          ]);

        if (regError) {
          if (regError.code === '23505') {
            setError('Bu kullanıcı adı alınmış.');
          } else {
            setError('Kayıt başarısız oldu.');
          }
        } else {
          onLogin({ username, role, advisorUsername: advisor });
        }
      }
    } catch (err) {
      setError('Sistem hatası. Lütfen sonra deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-emerald-950 overflow-hidden relative">
      {/* Arka Plan Efektleri */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-emerald-600/10 rounded-full blur-[150px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[150px]"></div>

      {/* Rehber Modalı */}
      {showInfo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 backdrop-blur-md bg-black/40 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <header className="p-8 bg-emerald-900 text-white flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20">
                  <InfoIcon color="white" size={28} />
                </div>
                <div>
                  <h2 className="text-xl font-black uppercase tracking-tight">Sistem Rehberi</h2>
                  <p className="text-[10px] font-bold text-emerald-300 uppercase tracking-[0.2em]">Rize Teknofest Proje Asistanı</p>
                </div>
              </div>
              <button onClick={() => setShowInfo(false)} className="hover:rotate-90 transition-transform">
                <CloseIcon />
              </button>
            </header>
            
            <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
              <section className="space-y-4">
                <h3 className="text-indigo-600 font-black text-sm uppercase tracking-widest flex items-center gap-2">
                  <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
                  Neden Teknofest?
                </h3>
                <p className="text-slate-600 text-sm font-medium leading-relaxed italic">
                  Teknofest, Türkiye'nin "Milli Teknoloji Hamlesi" vizyonunun kalbidir. Gençlerin teknoloji üreten bir topluma dönüşmesi, ülkemizin tam bağımsız geleceği için kritik bir öneme sahiptir. Burada geliştirdiğiniz bir fikir, yarının yerli uçaklarında, robotlarında veya sağlık sistemlerinde hayat bulabilir.
                </p>
              </section>

              <section className="space-y-6">
                <h3 className="text-emerald-700 font-black text-sm uppercase tracking-widest flex items-center gap-2">
                  <span className="w-2 h-2 bg-emerald-700 rounded-full"></span>
                  Sistem Nasıl Kullanılır?
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <GuideItem 
                    icon={<UserPlusIcon />} 
                    title="1. Kayıt ve Giriş" 
                    desc="Öğrenci veya Öğretmen rolüyle kayıt olun. Öğrenciyseniz danışman öğretmeninizin adını girmeyi unutmayın."
                  />
                  <GuideItem 
                    icon={<MessageIcon />} 
                    title="2. Fikir Geliştirme" 
                    desc="Kaçkar AI (Eğitmen) ile sohbet ederek aklınızdaki fikri akademik bir proje formatına dönüştürün."
                  />
                  <GuideItem 
                    icon={<PenIcon />} 
                    title="3. Rapor Sihirbazı" 
                    desc="Adım adım soruları yanıtlayarak Teknofest jürisinin beklediği standartlarda teknik raporunuzu oluşturun."
                  />
                  <GuideItem 
                    icon={<CheckCircleIcon />} 
                    title="4. Öğretmen Onayı" 
                    desc="Oluşturduğunuz raporu sistem üzerinden öğretmeninize gönderin ve geri bildirimler alarak projenizi mükemmelleştirin."
                  />
                </div>
              </section>

              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                <p className="text-[11px] font-bold text-slate-400 text-center leading-relaxed">
                  Bu sistem, öğrenci yaratıcılığını akademik disiplinle birleştirerek Teknofest yolculuğunda her an yanınızda olmak için tasarlanmıştır.
                </p>
              </div>
            </div>
            
            <footer className="p-6 bg-slate-50 border-t border-slate-100 text-center">
              <button 
                onClick={() => setShowInfo(false)}
                className="bg-emerald-600 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg hover:bg-emerald-700 transition-all"
              >
                Anladım, Başlayalım!
              </button>
            </footer>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-8 w-full max-w-md z-10 animate-in fade-in zoom-in duration-700">
        
        {/* Hareketli Bilgi Butonu */}
        <button 
          onClick={() => setShowInfo(true)}
          className="mx-auto flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-6 py-2.5 rounded-full group hover:bg-white/20 transition-all relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          <span className="relative">
            <InfoIcon color="#10B981" size={18} animate />
          </span>
          <span className="text-[10px] font-black text-emerald-100 uppercase tracking-widest relative">Nasıl Kullanırım?</span>
        </button>

        <div className="bg-white/95 backdrop-blur-3xl p-8 md:p-14 rounded-[3.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] border border-white/20">
          <div className="text-center mb-12">
            <div className="w-24 h-24 bg-emerald-950 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-2xl border border-white/10 ring-8 ring-emerald-500/5 transition-all hover:scale-105 duration-500 group overflow-hidden">
              <RizeTeknofestLogo size={64} />
            </div>
            <div className="relative inline-block px-4">
              <h1 className="text-4xl font-black text-emerald-950 tracking-tighter uppercase leading-tight mb-2">Rize Teknofest</h1>
              <span className="absolute -top-3 -right-6 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 text-[10px] px-2.5 py-1 rounded-full font-black text-white shadow-[0_0_20px_rgba(249,115,22,0.6)] border border-white/40 rotate-12 animate-bounce">V2.0</span>
            </div>
            <div className="h-1 w-12 bg-emerald-500 mx-auto rounded-full mb-3"></div>
            <p className="text-slate-500 font-bold tracking-tight uppercase text-[10px] tracking-[0.3em]">Akıllı Proje Yazma Sistemi</p>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-8 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-3">
              <ErrorIcon />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-6">
            {!isLogin && (
              <div className="flex bg-slate-100/80 p-1.5 rounded-2xl mb-4 border border-slate-200">
                <button 
                  type="button" 
                  onClick={() => setRole(UserRole.STUDENT)}
                  className={`flex-1 py-3 text-[10px] font-black rounded-xl transition-all uppercase tracking-[0.1em] ${role === UserRole.STUDENT ? 'bg-white shadow-md text-emerald-700' : 'text-slate-400'}`}
                >
                  Öğrenci
                </button>
                <button 
                  type="button" 
                  onClick={() => setRole(UserRole.TEACHER)}
                  className={`flex-1 py-3 text-[10px] font-black rounded-xl transition-all uppercase tracking-[0.1em] ${role === UserRole.TEACHER ? 'bg-white shadow-md text-emerald-700' : 'text-slate-400'}`}
                >
                  Öğretmen
                </button>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Kullanıcı Adı</label>
              <input 
                required
                type="text" 
                className="w-full px-7 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:outline-none transition-all font-bold placeholder:text-slate-300 shadow-inner"
                placeholder="kullanici_adi"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Şifre</label>
              <input 
                required
                type="password" 
                className="w-full px-7 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:outline-none transition-all font-bold placeholder:text-slate-300 shadow-inner"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {!isLogin && role === UserRole.STUDENT && (
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Danışman Öğretmen</label>
                <input 
                  type="text" 
                  className="w-full px-7 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:outline-none transition-all font-bold placeholder:text-slate-300 shadow-inner"
                  placeholder="Öğretmen kullanıcı adı"
                  value={advisor}
                  onChange={(e) => setAdvisor(e.target.value)}
                />
              </div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className={`w-full ${loading ? 'opacity-50' : ''} bg-emerald-600 hover:bg-emerald-700 text-white font-black py-5 rounded-2xl shadow-2xl shadow-emerald-500/30 transition-all active:scale-[0.97] mt-8 uppercase tracking-[0.25em] text-[11px]`}
            >
              {loading ? 'İşleniyor...' : (isLogin ? 'Sisteme Giriş Yap' : 'Hesabımı Oluştur')}
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-slate-100 text-center">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-tight">
              {isLogin ? 'Henüz üyeliğiniz yok mu?' : 'Zaten hesabınız var mı?'}
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="ml-2 text-emerald-600 font-black hover:underline"
              >
                {isLogin ? 'KAYIT OL' : 'GİRİŞ YAP'}
              </button>
            </p>
          </div>
        </div>

        <div className="px-8 text-center">
          <p className="text-[11px] leading-relaxed font-medium text-emerald-100/60 italic">
            "Rize Teknofest Proje Asistanı" Rize Borsa İstanbul Mesleki ve Teknik Anadolu Lisesi Bilişim Teknolojileri Öğretmeni <strong>Burak TURGUT</strong> tarafından geliştirilen öğrenci fikirlerini merkeze alan, öğretmen rehberliğiyle ilerleyen bir proje geliştirme destek sistemidir.
          </p>
        </div>
      </div>
    </div>
  );
};

const GuideItem = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
  <div className="p-5 bg-white rounded-3xl border border-slate-100 shadow-sm hover:border-indigo-100 transition-all">
    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-indigo-600 mb-4">
      {icon}
    </div>
    <h4 className="font-black text-slate-800 text-xs mb-2 uppercase tracking-tight">{title}</h4>
    <p className="text-[10px] text-slate-500 font-medium leading-relaxed">{desc}</p>
  </div>
);

const InfoIcon = ({ color = "currentColor", size = 20, animate = false }: { color?: string, size?: number, animate?: boolean }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color} 
    strokeWidth="3" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={animate ? "animate-pulse" : ""}
  >
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);

const UserPlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="17" y1="11" x2="23" y2="11"></line></svg>
);

const MessageIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
);

const PenIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
);

const CheckCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
);

const ErrorIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
);

export default Auth;
