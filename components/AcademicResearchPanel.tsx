
import React from 'react';

const AcademicResearchPanel: React.FC = () => {
  const tools = [
    {
      name: 'Consensus',
      url: 'https://consensus.app/',
      description: 'Bilimsel makalelerden kanıta dayalı cevaplar bulan AI araştırma motoru.',
      accent: 'indigo',
      tag: 'Bilimsel Kaynak'
    },
    {
      name: 'NotebookLM',
      url: 'https://notebooklm.google.com/',
      description: 'Kendi kaynaklarınızı yükleyip üzerinden çalışma yapabileceğiniz akıllı not defteri.',
      accent: 'emerald',
      tag: 'Analiz & Not'
    },
    {
      name: 'STORM',
      url: 'https://storm.genie.stanford.edu/',
      description: 'Konu hakkında kapsamlı akademik rapor taslakları hazırlayan Stanford AI sistemi.',
      accent: 'slate',
      tag: 'Rapor Taslağı'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
        </div>
        <div>
          <h2 className="text-xl font-black text-slate-800 tracking-tight">Akademik Araştırma Adımları</h2>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Gelişmiş AI Araştırma Araçları</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <a 
            key={tool.name}
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group glass-card p-6 rounded-[2rem] border border-slate-200 hover:shadow-2xl hover:-translate-y-1 transition-all flex flex-col"
          >
            <div className="flex justify-between items-start mb-4">
              <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full ${
                tool.accent === 'indigo' ? 'bg-indigo-50 text-indigo-600' :
                tool.accent === 'emerald' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-600'
              }`}>
                {tool.tag}
              </span>
              <div className="text-slate-300 group-hover:text-indigo-500 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              </div>
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">{tool.name}</h3>
            <p className="text-sm text-slate-500 font-medium leading-relaxed mb-6 flex-1">
              {tool.description}
            </p>
            <div className={`mt-auto text-xs font-black uppercase tracking-widest flex items-center gap-2 ${
              tool.accent === 'indigo' ? 'text-indigo-600' :
              tool.accent === 'emerald' ? 'text-emerald-600' : 'text-slate-600'
            }`}>
              Sistemi Aç <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default AcademicResearchPanel;
