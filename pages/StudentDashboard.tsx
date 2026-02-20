
import React, { useState, useEffect } from 'react';
import { User, Project } from '../types';
import AcademicResearchPanel from '../components/AcademicResearchPanel';
import TeknofestInfoPanel from '../components/TeknofestInfoPanel';
import ExternalProjectAnalyzer from '../components/ExternalProjectAnalyzer';
import { supabase } from '../lib/supabase';

interface StudentDashboardProps {
  user: User;
  onTabChange: (tab: string) => void;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ user, onTabChange }) => {
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDesc, setProjectDesc] = useState('');
  const [myProjects, setMyProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [projectLoading, setProjectLoading] = useState(false);

  useEffect(() => {
    loadMyProjects();
  }, []);

  const loadMyProjects = async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('student_username', user.username)
      .order('updated_at', { ascending: false });
    
    if (data && !error) {
      setMyProjects(data);
    }
  };

  const handleNewProject = () => {
    setSelectedProjectId(null);
    setProjectTitle('');
    setProjectDesc('');
  };

  const handleLoadProject = (p: Project) => {
    setSelectedProjectId(p.id || null);
    setProjectTitle(p.title);
    setProjectDesc(p.description);
  };

  const handleSaveProject = async (status: 'draft' | 'submitted') => {
    if (!projectTitle.trim() || !projectDesc.trim()) {
      alert("Lütfen başlık ve açıklama giriniz.");
      return;
    }

    setProjectLoading(true);
    const projectData = {
      student_username: user.username,
      title: projectTitle,
      description: projectDesc,
      status: status,
      updated_at: new Date().toISOString()
    };

    let error;
    if (selectedProjectId) {
      const { error: updateError } = await supabase
        .from('projects')
        .update(projectData)
        .eq('id', selectedProjectId);
      error = updateError;
    } else {
      const { error: insertError } = await supabase
        .from('projects')
        .insert([projectData]);
      error = insertError;
    }

    if (!error) {
      alert(status === 'submitted' ? "Projeniz başarıyla öğretmene gönderildi!" : "Taslak kaydedildi.");
      loadMyProjects();
      if (!selectedProjectId) handleNewProject(); // New was saved
    } else {
      alert("Bir hata oluştu.");
    }
    setProjectLoading(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="relative overflow-hidden rounded-[2.5rem] bg-emerald-950 p-8 md:p-12 text-white shadow-2xl shadow-emerald-900/20">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">Hoş Geldin, {user.username}! ☕</h1>
            <p className="text-emerald-200 text-lg font-medium opacity-90 max-w-xl">
              Rize'den Teknofest sahnesine! Tüm projelerin burada güvende.
            </p>
          </div>
          <div className="flex flex-col items-start md:items-end gap-2">
            <span className="text-xs font-black uppercase tracking-widest text-emerald-400">AKTİF DANIŞMAN</span>
            <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-400/20 flex items-center justify-center text-emerald-400">
                <UserIconSmall />
              </div>
              <span className="font-bold text-lg">{user.advisorUsername || 'Belirtilmemiş'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button 
              onClick={() => onTabChange('chat')}
              className="group glass-card p-8 rounded-[2rem] shadow-sm border border-slate-200 text-left transition-all hover:shadow-2xl hover:shadow-emerald-500/10 hover:-translate-y-1 flex flex-col h-full"
            >
              <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center text-white mb-6 shadow-xl shadow-emerald-500/20 group-hover:scale-110 transition-transform">
                <BrainIconLarge />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">Ders Asistanı</h3>
              <p className="text-slate-500 font-medium leading-relaxed mb-6">Yapay zeka asistanınla projenı geliştir ve raporunu hızla hazırla.</p>
              <div className="mt-auto flex items-center gap-2 text-emerald-600 font-bold uppercase text-xs tracking-widest group-hover:gap-4 transition-all">
                Hemen Başla <ArrowRight />
              </div>
            </button>

            {/* External Project Analyzer Component Added Here */}
            <ExternalProjectAnalyzer />
          </div>

          <div className="glass-card p-8 rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden relative">
            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black text-slate-900">
                  {selectedProjectId ? '📝 Projeyi Düzenle' : '🚀 Yeni Proje Fikri'}
                </h3>
                {selectedProjectId && (
                  <button onClick={handleNewProject} className="text-[10px] bg-slate-100 text-slate-600 px-3 py-1 rounded-full font-black uppercase tracking-widest hover:bg-slate-200">İptal / Yeni</button>
                )}
              </div>
              <div className="space-y-4">
                <input 
                  type="text" 
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  placeholder="Proje Başlığı (Örn: Kaçkar Çay Hasat Robotu)"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm font-bold focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none"
                />
                <textarea 
                  value={projectDesc}
                  onChange={(e) => setProjectDesc(e.target.value)}
                  placeholder="Projenin amacını ve yenilikçi yönünü anlat..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm font-medium focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none min-h-[200px] resize-none"
                />
                <div className="flex flex-col sm:flex-row gap-3">
                  <button 
                    disabled={projectLoading}
                    onClick={() => handleSaveProject('draft')}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black py-4 rounded-xl transition-all uppercase tracking-widest text-xs"
                  >
                    Taslağı Kaydet
                  </button>
                  <button 
                    disabled={projectLoading}
                    onClick={() => handleSaveProject('submitted')}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-black py-4 rounded-xl transition-all shadow-lg shadow-emerald-500/20 uppercase tracking-widest text-xs"
                  >
                    Öğretmenime Gönder
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
           {/* Hint Card */}
           <div className="glass-card p-6 rounded-[2rem] bg-indigo-600 text-white shadow-xl shadow-indigo-900/10 flex flex-col">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-md border border-white/10">
                <SparklesIcon />
              </div>
              <h3 className="text-lg font-black mb-2">Başarı İpucu 💡</h3>
              <p className="text-indigo-50 text-xs font-medium leading-relaxed">
                Her yeni fikrini ayrı bir proje olarak kaydetmeyi unutma. Geçmiş projelerini aşağıdan görebilirsin.
              </p>
           </div>

           <div className="glass-card rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col bg-white">
             <header className="p-6 border-b border-slate-50 bg-slate-50/50">
                <h3 className="font-black text-slate-800 uppercase tracking-widest text-xs">🗂️ Kayıtlı Projelerim</h3>
             </header>
             <div className="p-4 space-y-3 overflow-y-auto max-h-[400px]">
                {myProjects.length > 0 ? myProjects.map((p) => (
                  <button 
                    key={p.id} 
                    onClick={() => handleLoadProject(p)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all ${selectedProjectId === p.id ? 'bg-emerald-50 border-emerald-200 shadow-sm' : 'bg-white border-slate-100 hover:border-slate-200'}`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${p.status === 'submitted' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                        {p.status === 'submitted' ? 'GÖNDERİLDİ' : 'TASLAK'}
                      </span>
                      <span className="text-[9px] text-slate-400 font-bold">{new Date(p.updated_at || '').toLocaleDateString()}</span>
                    </div>
                    <h4 className="font-bold text-slate-800 text-sm truncate">{p.title}</h4>
                  </button>
                )) : (
                  <div className="text-center py-12 opacity-30 italic text-sm font-medium">Henüz kayıtlı projen yok.</div>
                )}
             </div>
           </div>
        </div>
      </div>

      <TeknofestInfoPanel />
      <AcademicResearchPanel />
    </div>
  );
};

// Icons
const BrainIconLarge = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21c-4.97 0-9-3.134-9-7s4.03-7 9-7 9 3.134 9 7-4.03 7-9 7z"/><path d="M12 7V2"/><path d="M12 21v-3"/><path d="M7 10h10"/></svg>
);
const ArrowRight = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
);
const UserIconSmall = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
);
const SparklesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
);

export default StudentDashboard;
