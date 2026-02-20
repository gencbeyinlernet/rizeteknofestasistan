
import React, { useState, useEffect } from 'react';
import { User, Project } from '../types';
import AcademicResearchPanel from '../components/AcademicResearchPanel';
import TeknofestInfoPanel from '../components/TeknofestInfoPanel';
import ExternalProjectAnalyzer from '../components/ExternalProjectAnalyzer';
import { supabase } from '../lib/supabase';

interface TeacherDashboardProps {
  teacher: User;
  onViewStudent: (student: User) => void;
}

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ teacher, onViewStudent }) => {
  const [students, setStudents] = useState<User[]>([]);
  const [submittedProjects, setSubmittedProjects] = useState<Project[]>([]);
  const [messages, setMessages] = useState<{from_username: string, text: string, timestamp: string}[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTeacherData();
    const interval = setInterval(loadTeacherData, 10000); 
    return () => clearInterval(interval);
  }, [teacher.username]);

  const loadTeacherData = async () => {
    try {
      const { data: usersData } = await supabase
        .from('users')
        .select('*')
        .eq('advisor_username', teacher.username)
        .eq('role', 'STUDENT');
      
      if (usersData) setStudents(usersData);

      if (usersData && usersData.length > 0) {
        const studentNames = usersData.map(u => u.username);
        const { data: projectsData } = await supabase
          .from('projects')
          .select('*')
          .in('student_username', studentNames)
          .eq('status', 'submitted');
        
        if (projectsData) setSubmittedProjects(projectsData);
      }

      const { data: msgData } = await supabase
        .from('messages')
        .select('*')
        .eq('to_username', teacher.username)
        .order('timestamp', { ascending: false });

      if (msgData) setMessages(msgData);
    } catch (err) {
      console.error("Veri yükleme hatası:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Eğitmen Yönetim Paneli</h1>
          <p className="text-slate-500 font-medium">Danışmanı olduğunuz öğrencileri ve çalışmalarını buradan izleyin.</p>
        </div>
      </header>

      {/* Analyzer Component Row */}
      <div className="h-64">
        <ExternalProjectAnalyzer />
      </div>

      <TeknofestInfoPanel />
      <AcademicResearchPanel />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="glass-card rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-white/50">
              <h3 className="font-black text-xl text-slate-800">🚀 Gelen Proje Fikirleri ({submittedProjects.length})</h3>
              <span className="text-[10px] font-black uppercase text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100 tracking-widest">Yeni Başvurular</span>
            </div>
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {submittedProjects.length > 0 ? submittedProjects.map((p, i) => (
                <div key={i} className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100 hover:border-emerald-200 transition-all">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-white px-2 py-1 rounded-lg shadow-sm">{p.student_username}</span>
                  </div>
                  <h4 className="font-black text-slate-900 mb-2 truncate">{p.title}</h4>
                  <p className="text-xs text-slate-500 line-clamp-3 mb-4">{p.description}</p>
                  <button 
                    onClick={() => {
                      const student = students.find(s => s.username === p.student_username);
                      if (student) onViewStudent(student);
                    }}
                    className="w-full bg-white border border-slate-200 py-2 rounded-xl text-xs font-black text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 transition-all"
                  >
                    Detaylı İncele
                  </button>
                </div>
              )) : (
                <div className="col-span-2 p-12 text-center text-slate-400 font-medium italic">
                  {loading ? 'Yükleniyor...' : 'Henüz gönderilmiş bir proje fikri bulunmamaktadır.'}
                </div>
              )}
            </div>
          </div>

          <div className="glass-card rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-white/50">
              <h3 className="font-black text-xl text-slate-800">Öğrencilerim ({students.length})</h3>
            </div>
            <div className="divide-y divide-slate-50">
              {students.length > 0 ? students.map((s, i) => (
                <div key={i} className="p-6 flex items-center justify-between hover:bg-slate-50/80 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center font-black text-slate-500 shadow-inner group-hover:scale-110 transition-transform">
                      {s.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-black text-slate-800 text-lg">{s.username}</p>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-tighter">İşlem Bekliyor</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => onViewStudent(s)}
                    className="px-6 py-2.5 bg-white border border-slate-200 text-indigo-600 font-black text-sm rounded-2xl shadow-sm hover:shadow-md hover:border-indigo-200 transition-all active:scale-95"
                  >
                    Öğrenci Detayı
                  </button>
                </div>
              )) : (
                <div className="p-16 text-center text-slate-400 font-medium italic">
                  {loading ? 'Yükleniyor...' : 'Henüz size bağlı bir öğrenci kaydı bulunmamaktadır.'}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="glass-card rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden flex flex-col h-full">
          <div className="p-8 border-b border-slate-50 bg-white/50">
            <h3 className="font-black text-xl text-slate-800">Öğrenci Bildirimleri</h3>
          </div>
          <div className="p-6 space-y-4 max-h-[600px] overflow-y-auto flex-1">
            {messages.length > 0 ? messages.map((m, i) => (
              <div key={i} className="bg-white/80 p-5 rounded-3xl border border-slate-100 shadow-sm transition-all hover:border-indigo-100">
                <div className="flex justify-between items-start mb-3">
                  <span className="font-black text-[10px] text-indigo-600 uppercase tracking-widest px-2 py-1 bg-indigo-50 rounded-lg">{m.from_username}</span>
                  <span className="text-[10px] text-slate-400 font-black">{new Date(m.timestamp).toLocaleDateString()}</span>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed font-medium">{m.text}</p>
              </div>
            )) : (
              <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 opacity-40">
                 <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                 <p className="text-xs font-black uppercase tracking-widest">
                   {loading ? 'Yükleniyor...' : 'Yeni mesaj yok'}
                 </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
