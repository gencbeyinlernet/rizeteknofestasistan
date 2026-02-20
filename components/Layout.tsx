
import React from 'react';
import { User, UserRole } from '../types';
import KackarAssistant from './KackarAssistant';

interface LayoutProps {
  user: User;
  onLogout: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ user, onLogout, activeTab, onTabChange, children }) => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Mobile Header */}
      <header className="md:hidden bg-emerald-950 text-white p-4 flex justify-between items-center shadow-md z-20 sticky top-0">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center backdrop-blur-md border border-white/10">
            <RizeTeknofestLogo size={28} />
          </div>
          <div className="flex flex-col">
            <h1 className="font-bold text-sm tracking-tight">Rize Teknofest AI</h1>
            <div className="flex items-center">
              <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-[8px] px-1.5 py-0.5 rounded-full font-black text-white shadow-[0_0_10px_rgba(251,191,36,0.4)] animate-pulse">V2.0</span>
            </div>
          </div>
        </div>
        <button onClick={onLogout} className="bg-red-500/20 hover:bg-red-500/40 text-red-100 px-3 py-1 rounded text-[10px] font-black uppercase transition-all">Çıkış</button>
      </header>

      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 lg:w-72 bg-emerald-950 text-slate-50 shadow-2xl z-30">
        <div className="p-10 border-b border-white/5">
          <div className="flex flex-col items-center text-center gap-5">
            <div className="relative group">
              <div className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full scale-150 group-hover:scale-110 transition-transform duration-500"></div>
              <div className="relative w-28 h-28 bg-gradient-to-br from-slate-900 to-emerald-950 rounded-[3rem] flex items-center justify-center shadow-2xl border border-white/10 ring-8 ring-emerald-500/5 transition-transform duration-500 group-hover:scale-105">
                <RizeTeknofestLogo size={64} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-center gap-2">
                <h1 className="text-xl font-black tracking-tighter text-white leading-none uppercase">Rize Teknofest</h1>
                <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-[10px] px-2 py-1 rounded-lg font-black text-white shadow-[0_0_20px_rgba(168,85,247,0.4)] border border-white/20 animate-bounce">V2</span>
              </div>
              <p className="text-emerald-400 text-[10px] mt-2 uppercase font-black tracking-[0.25em] opacity-80">Proje Asistanı</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-5 space-y-2 overflow-y-auto">
          <NavItem 
            onClick={() => onTabChange('dashboard')} 
            active={activeTab === 'dashboard'} 
            label="Panelim" 
            icon={<DashboardIcon />} 
          />
          <NavItem 
            onClick={() => onTabChange('wizard')} 
            active={activeTab === 'wizard'} 
            label="Proje Sihirbazı" 
            icon={<WizardIconSmall />} 
          />
          <NavItem 
            onClick={() => onTabChange('categories')} 
            active={activeTab === 'categories'} 
            label="Yarışma Kategorileri" 
            icon={<LayersIcon />} 
          />
          <NavItem 
            onClick={() => onTabChange('team')} 
            active={activeTab === 'team'} 
            label="Takım Dosyası" 
            icon={<UsersIcon />} 
            badge="YENİ"
          />
          {user.role === UserRole.STUDENT && (
            <NavItem 
              onClick={() => onTabChange('chat')} 
              active={activeTab === 'chat'} 
              label="Ders Asistanı" 
              icon={<BrainIcon />} 
            />
          )}
          <NavItem 
            onClick={() => onTabChange('profile')} 
            active={activeTab === 'profile'} 
            label="Profil Ayarları" 
            icon={<UserIcon />} 
          />
        </nav>

        <div className="p-5 border-t border-white/5 bg-emerald-950/50">
          <div className="flex items-center gap-3 mb-5 p-3.5 bg-white/5 rounded-2xl border border-white/5">
            <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center font-black text-white shadow-inner text-sm">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold truncate text-white">{user.username}</p>
              <p className="text-[9px] text-emerald-400 uppercase font-black tracking-tighter opacity-60">{user.role}</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="w-full bg-red-600/80 hover:bg-red-600 text-white py-3.5 rounded-2xl transition-all text-xs font-black uppercase tracking-widest shadow-xl shadow-red-950/20 active:scale-95"
          >
            Güvenli Çıkış
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-h-0 flex flex-col relative bg-emerald-50/20">
        <div className="flex-1 p-4 md:p-8 lg:p-12 overflow-y-auto pb-24 md:pb-8">
          <div className="max-w-6xl mx-auto w-full">
            {children}
          </div>
        </div>
      </main>

      {/* Kaçkar Assistant - Floating UI */}
      <KackarAssistant user={user} />

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-6 left-6 right-6 bg-emerald-950/98 backdrop-blur-2xl border border-white/10 flex justify-around p-3.5 rounded-[2.5rem] shadow-2xl z-40">
        <MobileNavItem onClick={() => onTabChange('dashboard')} active={activeTab === 'dashboard'} icon={<DashboardIcon />} />
        <MobileNavItem onClick={() => onTabChange('wizard')} active={activeTab === 'wizard'} icon={<WizardIconSmall />} />
        <MobileNavItem onClick={() => onTabChange('categories')} active={activeTab === 'categories'} icon={<LayersIcon />} />
        <MobileNavItem onClick={() => onTabChange('team')} active={activeTab === 'team'} icon={<UsersIcon />} />
        {user.role === UserRole.STUDENT && (
          <MobileNavItem onClick={() => onTabChange('chat')} active={activeTab === 'chat'} icon={<BrainIcon />} />
        )}
        <MobileNavItem onClick={() => onTabChange('profile')} active={activeTab === 'profile'} icon={<UserIcon />} />
      </nav>
    </div>
  );
};

// --- YENİ LOGO: Sadece Kalem (Yeşil ve Mavi) ---
export const RizeTeknofestLogo = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Kalem Gövdesi Sol Taraf (Yeşil) */}
    <path d="M22 6C22 6 22 34 22 36C22 38 23 40 24 42" stroke="#10B981" strokeWidth="4" strokeLinecap="round" />
    
    {/* Kalem Gövdesi Sağ Taraf (Mavi) */}
    <path d="M26 6C26 6 26 34 26 36C26 38 25 40 24 42" stroke="#3B82F6" strokeWidth="4" strokeLinecap="round" />
    
    {/* Kalem Ucu Detayı */}
    <path d="M24 42L24 46" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.8" />

    {/* Kalem Klipsi (Modern / Keskin) */}
    <path d="M26 12H30V22L26 18" fill="#3B82F6" opacity="0.9" />

    {/* Basma Düğmesi / Üst Kısım */}
    <rect x="21" y="2" width="6" height="3" rx="1.5" fill="white" fillOpacity="0.4" />
    
    {/* Gövde Üzerinde Küçük Teknoloji Çizgileri */}
    <path d="M26 28H28" stroke="white" strokeWidth="1" strokeLinecap="round" opacity="0.3" />
    <path d="M26 32H27" stroke="white" strokeWidth="1" strokeLinecap="round" opacity="0.3" />
    <path d="M20 14H22" stroke="white" strokeWidth="1" strokeLinecap="round" opacity="0.3" />
  </svg>
);

const NavItem = ({ onClick, active, label, icon, badge }: any) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-300 ${
      active 
        ? 'bg-emerald-600 text-white shadow-2xl shadow-emerald-900/40 translate-x-1.5' 
        : 'hover:bg-white/5 text-emerald-300/60 hover:text-white'
    }`}
  >
    <div className="flex items-center gap-3.5">
      <div className={`${active ? 'scale-110' : 'opacity-40'} transition-transform duration-300`}>{icon}</div>
      <span className="font-bold text-xs uppercase tracking-[0.15em]">{label}</span>
    </div>
    {badge && (
      <span className="bg-gradient-to-r from-orange-400 to-rose-500 text-[8px] px-2 py-0.5 rounded-full font-black text-white animate-pulse shadow-[0_0_10px_rgba(244,63,94,0.4)]">
        {badge}
      </span>
    )}
  </button>
);

const MobileNavItem = ({ onClick, active, icon }: any) => (
  <button 
    onClick={onClick} 
    className={`p-4 rounded-full transition-all duration-500 ${
      active ? 'bg-emerald-500 text-white scale-110 shadow-2xl -translate-y-3' : 'text-emerald-500/40'
    }`}
  >
    {icon}
  </button>
);

const DashboardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
);

const BrainIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 11c0 3.517-1.009 6.799-2.753 9.571m2.753-9.571c0-3.517 1.009-6.799 2.753-9.571m-2.753 9.571h3m-3 0H9m1.247 9.571C11.161 21.365 12 23 12 23s.839-1.635 1.753-2.429M12 2v2m-6.536 2.464l1.414 1.414m10.242 0l1.414-1.414M2 12h2m16 0h2m-6.536 6.536l1.414-1.414M5.122 17.122l1.414 1.414"></path></svg>
);

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
);

const WizardIconSmall = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m11.5 15-2-2 2-2"/><path d="m15.5 9 2 2-2 2"/><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M12 21V12"/><path d="M21 12h-9"/></svg>
);

const LayersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
);

const UsersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><polyline points="17 11 19 13 23 9"/></svg>
);

export default Layout;
