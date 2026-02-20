
import React, { useState, useEffect } from 'react';
import { User, UserRole, Project } from './types';
import Auth from './components/Auth';
import Layout from './components/Layout';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AIChat from './pages/AIChat';
import Profile from './pages/Profile';
import ProjectWizard from './pages/ProjectWizard';
import TeamFileWizard from './components/TeamFileWizard';
import TeknofestCategories from './components/TeknofestCategories';
import { ADMIN_CREDENTIALS } from './constants';
import { supabase } from './lib/supabase';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [viewingStudent, setViewingStudent] = useState<User | null>(null);
  const [studentProjects, setStudentProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projectLoading, setProjectLoading] = useState(false);
  const [isSendingFeedback, setIsSendingFeedback] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (!users.find((u: User) => u.username === ADMIN_CREDENTIALS.username)) {
      users.push({
        username: ADMIN_CREDENTIALS.username,
        password: ADMIN_CREDENTIALS.password,
        role: UserRole.ADMIN
      });
      localStorage.setItem('users', JSON.stringify(users));
    }
  }, []);

  useEffect(() => {
    if (viewingStudent) {
      loadStudentProjects(viewingStudent.username);
    } else {
      setStudentProjects([]);
      setSelectedProject(null);
    }
  }, [viewingStudent]);

  const loadStudentProjects = async (username: string) => {
    setProjectLoading(true);
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('student_username', username)
      .order('updated_at', { ascending: false });
    
    if (data && !error) {
      setStudentProjects(data);
      if (data.length > 0) setSelectedProject(data[0]);
    } else {
      setStudentProjects([]);
      setSelectedProject(null);
    }
    setProjectLoading(false);
  };

  const handleSendQuickFeedback = async (status: string, text: string) => {
    if (!viewingStudent || !currentUser || isSendingFeedback) return;
    
    setIsSendingFeedback(true);
    try {
      const fullText = `[DEĞERLENDİRME: ${status}] ${text}`;
      const { error } = await supabase.from('messages').insert([{
        from_username: currentUser.username,
        to_username: viewingStudent.username,
        text: fullText,
        timestamp: new Date().toISOString()
      }]);

      if (error) throw error;
      alert("Geri bildirim öğrenciye gönderildi!");
    } catch (err) {
      console.error(err);
      alert("Gönderim başarısız.");
    } finally {
      setIsSendingFeedback(false);
    }
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    setActiveTab('dashboard');
    setViewingStudent(null);
  };

  if (!currentUser) {
    return <Auth onLogin={handleLogin} />;
  }

  const renderContent = () => {
    if (activeTab === 'profile') return <Profile user={currentUser} onUpdate={(u) => { setCurrentUser(u); localStorage.setItem('currentUser', JSON.stringify(u)); }} />;
    if (activeTab === 'wizard') return <ProjectWizard user={currentUser} />;
    if (activeTab === 'team') return <TeamFileWizard />;
    if (activeTab === 'categories') return <TeknofestCategories />;
    
    if (activeTab === 'chat' && currentUser.role === UserRole.STUDENT) return <AIChat user={currentUser} onUpdateChat={(history) => {
        const updatedUser = { ...currentUser, chatHistory: history };
        setCurrentUser(updatedUser);
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const idx = users.findIndex((u: User) => u.username === currentUser.username);
        if (idx > -1) {
            users[idx].chatHistory = history;
            localStorage.setItem('users', JSON.stringify(users));
        }
    }} />;

    switch (currentUser.role) {
      case UserRole.STUDENT:
        return <StudentDashboard user={currentUser} onTabChange={setActiveTab} />;
      case UserRole.TEACHER:
        if (viewingStudent) {
            return (
                <div className="space-y-6 animate-in fade-in duration-500">
                    <button 
                        onClick={() => setViewingStudent(null)}
                        className="bg-white px-6 py-2.5 rounded-2xl shadow-sm border border-slate-200 text-indigo-600 font-black text-sm flex items-center gap-2 hover:bg-slate-50 transition-all active:scale-95"
                    >
                        ← Listeye Geri Dön
                    </button>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        <div className="lg:col-span-3 space-y-6">
                            <div className="glass-card p-6 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col items-center text-center">
                                <div className="w-20 h-20 rounded-[1.5rem] bg-indigo-600 text-white flex items-center justify-center text-3xl font-black shadow-xl mb-4">
                                    {viewingStudent.username.charAt(0).toUpperCase()}
                                </div>
                                <h2 className="text-xl font-black text-slate-900 mb-1">{viewingStudent.username}</h2>
                                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4">ÖĞRENCİ</p>
                            </div>

                            {/* Quick Feedback Card */}
                            <div className="glass-card rounded-[2rem] border border-slate-100 overflow-hidden bg-white">
                                <header className="p-5 bg-indigo-50 border-b border-indigo-100">
                                   <h4 className="text-[11px] font-black uppercase tracking-widest text-indigo-700">⚡ HIZLI DEĞERLENDİRME</h4>
                                </header>
                                <div className="p-4 space-y-4">
                                    <div className="flex gap-2">
                                        <button onClick={() => handleSendQuickFeedback('👍 GÜÇLÜ', 'Rapor düzeni ve akademik dil harika, jüriden tam puan alabilir.')} className="flex-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 p-3 rounded-xl transition-all flex items-center justify-center" title="Güçlü"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 10v12"></path><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z"></path></svg></button>
                                        <button onClick={() => handleSendQuickFeedback('⚠️ GELİŞTİRİLMELİ', 'Özgünlük kısmını biraz daha somut verilerle desteklemelisin.')} className="flex-1 bg-amber-50 hover:bg-amber-100 text-amber-600 p-3 rounded-xl transition-all flex items-center justify-center" title="Geliştirilmeli"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg></button>
                                        <button onClick={() => handleSendQuickFeedback('❌ UYGUN DEĞİL', 'Yöntem veya proje içeriği Teknofest kriterlerine uygun görünmüyor.')} className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 p-3 rounded-xl transition-all flex items-center justify-center" title="Uygun Değil"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg></button>
                                    </div>
                                    <div className="space-y-2">
                                        <QuickFeedbackBtn onClick={(t) => handleSendQuickFeedback('💡 TAVSİYE', t)} text="Yöntem kısmı net ama özgünlük zayıf." />
                                        <QuickFeedbackBtn onClick={(t) => handleSendQuickFeedback('💡 TAVSİYE', t)} text="Sayısal veri ve kaynak kullanımı artırılmalı." />
                                        <QuickFeedbackBtn onClick={(t) => handleSendQuickFeedback('💡 TAVSİYE', t)} text="Teknik detaylar yetersiz kalmış, algoritma ekleyebilirsin." />
                                    </div>
                                </div>
                            </div>

                            <div className="glass-card rounded-[2rem] border border-slate-100 overflow-hidden">
                                <header className="p-4 bg-slate-50 border-b border-slate-100">
                                   <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">GÖNDERİLEN PROJELER</h4>
                                </header>
                                <div className="p-2 space-y-2 max-h-[300px] overflow-y-auto">
                                    {studentProjects.length > 0 ? studentProjects.map((p) => (
                                        <button 
                                          key={p.id}
                                          onClick={() => setSelectedProject(p)}
                                          className={`w-full text-left p-3 rounded-xl transition-all border ${selectedProject?.id === p.id ? 'bg-indigo-50 border-indigo-100 shadow-sm' : 'border-transparent hover:bg-slate-50'}`}
                                        >
                                            <p className="text-xs font-black text-slate-800 truncate">{p.title}</p>
                                            <p className="text-[9px] font-bold text-slate-400">{new Date(p.updated_at || '').toLocaleDateString()}</p>
                                        </button>
                                    )) : <p className="text-[10px] p-4 text-center italic text-slate-400">Rapor bulunamadı.</p>}
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-9">
                            <div className="glass-card rounded-[2.5rem] shadow-sm border border-slate-100 h-full flex flex-col overflow-hidden bg-white min-h-[600px]">
                                <header className="p-8 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
                                    <div>
                                        <h3 className="text-xl font-black text-slate-900 tracking-tight">Teknik Değerlendirme Raporu</h3>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Öğrencinin Hazırladığı İçerik</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">GÖRÜNTÜLENİYOR</span>
                                    </div>
                                </header>
                                
                                <div className="p-8 flex-1 overflow-y-auto custom-scrollbar">
                                    {projectLoading ? (
                                        <div className="flex flex-col items-center justify-center py-20 text-slate-400 animate-pulse">
                                            <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                                            <p className="font-black text-xs uppercase tracking-widest">Yükleniyor...</p>
                                        </div>
                                    ) : selectedProject ? (
                                        <div className="space-y-8">
                                            <div className="bg-indigo-50/50 p-6 rounded-[2rem] border border-indigo-100/50">
                                                <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-3">BAŞLIK</h4>
                                                <h2 className="text-2xl font-black text-slate-900 leading-tight">
                                                    {selectedProject.title}
                                                </h2>
                                            </div>
                                            
                                            <div className="prose prose-slate max-w-none">
                                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">DETAYLI RAPOR VE JÜRİ ANALİZİ</h4>
                                                <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm leading-relaxed text-slate-800 whitespace-pre-wrap font-medium text-lg">
                                                    {selectedProject.description}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-32 text-center opacity-40">
                                            <p className="font-black text-sm uppercase tracking-widest">Henüz bir rapor seçilmedi.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
        return <TeacherDashboard teacher={currentUser} onViewStudent={setViewingStudent} />;
      case UserRole.ADMIN:
        return <AdminDashboard admin={currentUser} />;
      default:
        return <div>Yetkisiz Erişim</div>;
    }
  };

  return (
    <Layout user={currentUser} onLogout={handleLogout} activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </Layout>
  );
};

const QuickFeedbackBtn = ({ text, onClick }: { text: string, onClick: (t: string) => void }) => (
    <button 
        onClick={() => onClick(text)}
        className="w-full text-left p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50 transition-all text-[11px] font-bold text-slate-600 leading-tight"
    >
        {text}
    </button>
);

export default App;
