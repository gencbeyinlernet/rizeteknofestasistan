
import React, { useState } from 'react';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell, WidthType } from 'docx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface TeamMember {
  name: string;
  role: string;
  class: string;
}

const TeamFileWizard: React.FC = () => {
  const [teamName, setTeamName] = useState('');
  const [teamDescription, setTeamDescription] = useState('');
  const [memberCount, setMemberCount] = useState(1);
  const [members, setMembers] = useState<TeamMember[]>([{ name: '', role: '', class: '' }]);

  const handleMemberCountChange = (count: number) => {
    const newCount = Math.max(1, count);
    setMemberCount(newCount);
    const newMembers = [...members];
    if (newCount > members.length) {
      for (let i = members.length; i < newCount; i++) {
        newMembers.push({ name: '', role: '', class: '' });
      }
    } else {
      newMembers.splice(newCount);
    }
    setMembers(newMembers);
  };

  const updateMember = (index: number, field: keyof TeamMember, value: string) => {
    const newMembers = [...members];
    newMembers[index][field] = value;
    setMembers(newMembers);
  };

  const exportToWord = async () => {
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              text: "TAKIM TANITIM DOSYASI",
              heading: HeadingLevel.HEADING_1,
              alignment: AlignmentType.CENTER,
            }),
            new Paragraph({ text: "" }),
            new Paragraph({
              children: [
                new TextRun({ text: "Takım İsmi: ", bold: true }),
                new TextRun(teamName),
              ],
            }),
            new Paragraph({ text: "" }),
            new Paragraph({
              children: [
                new TextRun({ text: "Takım Açıklaması: ", bold: true }),
                new TextRun(teamDescription),
              ],
            }),
            new Paragraph({ text: "" }),
            new Paragraph({
              text: "Takım Üyeleri",
              heading: HeadingLevel.HEADING_2,
            }),
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Ad Soyad", bold: true })] })] }),
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Görev", bold: true })] })] }),
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Sınıf", bold: true })] })] }),
                  ],
                }),
                ...members.map(m => new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph(m.name)] }),
                    new TableCell({ children: [new Paragraph(m.role)] }),
                    new TableCell({ children: [new Paragraph(m.class)] }),
                  ],
                })),
              ],
            }),
          ],
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${teamName || 'takim'}_dosyasi.docx`);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(22);
    doc.text("TAKIM TANITIM DOSYASI", 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Takım İsmi:", 20, 40);
    doc.setFont("helvetica", "normal");
    doc.text(teamName, 50, 40);
    
    doc.setFont("helvetica", "bold");
    doc.text("Takım Açıklaması:", 20, 50);
    doc.setFont("helvetica", "normal");
    const splitDesc = doc.splitTextToSize(teamDescription, 140);
    doc.text(splitDesc, 20, 60);
    
    const startY = 60 + (splitDesc.length * 7);
    doc.setFont("helvetica", "bold");
    doc.text("Takım Üyeleri", 20, startY);
    
    (doc as any).autoTable({
      startY: startY + 5,
      head: [['Ad Soyad', 'Görev', 'Sınıf']],
      body: members.map(m => [m.name, m.role, m.class]),
      theme: 'grid',
      headStyles: { fillColor: [16, 185, 129] }
    });
    
    doc.save(`${teamName || 'takim'}_dosyasi.pdf`);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-emerald-950 tracking-tight">TAKIM DOSYASI HAZIRLAMA</h2>
          <p className="text-slate-500 font-medium mt-1">Teknofest başvurusu için takım bilgilerinizi düzenleyin.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={exportToWord}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg transition-all active:scale-95 flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
            WORD İNDİR
          </button>
          <button 
            onClick={exportToPDF}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg transition-all active:scale-95 flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M12 18v-6"/><path d="m9 15 3 3 3-3"/></svg>
            PDF İNDİR
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card p-8 rounded-[2.5rem] border border-white/40 shadow-xl">
            <h3 className="text-lg font-black text-emerald-950 mb-6 uppercase tracking-tight">Genel Bilgiler</h3>
            
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-emerald-800 uppercase ml-2 tracking-widest">Takım İsmi</label>
                <input 
                  type="text" 
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="w-full px-6 py-4 rounded-2xl bg-white/50 border border-emerald-100 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:outline-none transition-all font-bold placeholder:text-slate-300"
                  placeholder="Örn: Rize Tekno Takımı"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-emerald-800 uppercase ml-2 tracking-widest">Takım Açıklaması</label>
                <textarea 
                  value={teamDescription}
                  onChange={(e) => setTeamDescription(e.target.value)}
                  rows={4}
                  className="w-full px-6 py-4 rounded-2xl bg-white/50 border border-emerald-100 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:outline-none transition-all font-bold placeholder:text-slate-300 resize-none"
                  placeholder="Takımınızın vizyonu ve amacı nedir?"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-emerald-800 uppercase ml-2 tracking-widest">Üye Sayısı</label>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => handleMemberCountChange(memberCount - 1)}
                    className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black hover:bg-emerald-200 transition-all"
                  >
                    -
                  </button>
                  <div className="flex-1 text-center font-black text-xl text-emerald-950">
                    {memberCount}
                  </div>
                  <button 
                    onClick={() => handleMemberCountChange(memberCount + 1)}
                    className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black hover:bg-emerald-200 transition-all"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="glass-card p-8 rounded-[2.5rem] border border-white/40 shadow-xl min-h-[500px]">
            <h3 className="text-lg font-black text-emerald-950 mb-6 uppercase tracking-tight">Takım Üyeleri</h3>
            
            <div className="space-y-6">
              {members.map((member, index) => (
                <div key={index} className="p-6 rounded-3xl bg-emerald-50/50 border border-emerald-100 space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="flex items-center justify-between">
                    <span className="bg-emerald-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                      {index + 1}. ÜYE
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-slate-400 uppercase ml-1 tracking-widest">Ad Soyad</label>
                      <input 
                        type="text" 
                        value={member.name}
                        onChange={(e) => updateMember(index, 'name', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-white border border-emerald-50 focus:border-emerald-500 focus:outline-none transition-all font-bold text-sm"
                        placeholder="Ad Soyad"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-slate-400 uppercase ml-1 tracking-widest">Görev</label>
                      <input 
                        type="text" 
                        value={member.role}
                        onChange={(e) => updateMember(index, 'role', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-white border border-emerald-50 focus:border-emerald-500 focus:outline-none transition-all font-bold text-sm"
                        placeholder="Örn: Yazılım Sorumlusu"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-slate-400 uppercase ml-1 tracking-widest">Sınıf</label>
                      <input 
                        type="text" 
                        value={member.class}
                        onChange={(e) => updateMember(index, 'class', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-white border border-emerald-50 focus:border-emerald-500 focus:outline-none transition-all font-bold text-sm"
                        placeholder="Örn: 11-A"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamFileWizard;
