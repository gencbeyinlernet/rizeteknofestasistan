
import React, { useState, useEffect } from 'react';
import { User } from '../types';

interface AdminDashboardProps {
  admin: User;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ admin }) => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const allUsers: User[] = JSON.parse(localStorage.getItem('users') || '[]');
    setUsers(allUsers);
  }, []);

  const deleteUser = (username: string) => {
    if (username === admin.username) return;
    if (window.confirm(`${username} kullanıcısını silmek istediğinize emin misiniz?`)) {
        const updated = users.filter(u => u.username !== username);
        setUsers(updated);
        localStorage.setItem('users', JSON.stringify(updated));
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Sistem Yöneticisi Paneli</h1>
          <p className="text-slate-500">Tüm kullanıcıları ve platform verilerini yönetin.</p>
        </div>
        <div className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-bold uppercase">
          Kritik Erişim Yetkisi
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <p className="text-xs font-bold text-slate-400 uppercase mb-1">Toplam Kullanıcı</p>
          <p className="text-3xl font-bold text-indigo-600">{users.length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <p className="text-xs font-bold text-slate-400 uppercase mb-1">Öğrenci Sayısı</p>
          <p className="text-3xl font-bold text-blue-600">{users.filter(u => u.role === 'STUDENT').length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <p className="text-xs font-bold text-slate-400 uppercase mb-1">Öğretmen Sayısı</p>
          <p className="text-3xl font-bold text-purple-600">{users.filter(u => u.role === 'TEACHER').length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <p className="text-xs font-bold text-slate-400 uppercase mb-1">Yönetici Sayısı</p>
          <p className="text-3xl font-bold text-slate-600">{users.filter(u => u.role === 'ADMIN').length}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-50">
          <h3 className="font-bold text-lg">Kullanıcı Yönetimi</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
              <tr>
                <th className="px-6 py-4">Kullanıcı Adı</th>
                <th className="px-6 py-4">Rol</th>
                <th className="px-6 py-4">Danışman</th>
                <th className="px-6 py-4">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-all">
                  <td className="px-6 py-4 font-semibold">{u.username}</td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${
                      u.role === 'ADMIN' ? 'bg-slate-800 text-white' : 
                      u.role === 'TEACHER' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">{u.advisorUsername || '-'}</td>
                  <td className="px-6 py-4">
                    <button 
                      disabled={u.username === admin.username}
                      onClick={() => deleteUser(u.username)}
                      className={`text-red-500 hover:text-red-700 text-sm font-bold ${u.username === admin.username ? 'opacity-20 cursor-not-allowed' : ''}`}
                    >
                      Sil
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
