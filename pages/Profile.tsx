
import React, { useState } from 'react';
import { User, UserRole } from '../types';

interface ProfileProps {
  user: User;
  onUpdate: (user: User) => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onUpdate }) => {
  const [newPassword, setNewPassword] = useState('');
  const [advisor, setAdvisor] = useState(user.advisorUsername || '');
  const [msg, setMsg] = useState('');

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    
    const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
    const idx = users.findIndex(u => u.username === user.username);
    
    if (idx > -1) {
        if (newPassword) users[idx].password = newPassword;
        if (user.role === UserRole.STUDENT) users[idx].advisorUsername = advisor;
        
        const updatedUser = users[idx];
        localStorage.setItem('users', JSON.stringify(users));
        onUpdate(updatedUser);
        setMsg('Bilgileriniz başarıyla güncellendi.');
        setTimeout(() => setMsg(''), 3000);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-800">Profil Bilgilerim</h1>
        <p className="text-slate-500">Hesap ayarlarınızı buradan yönetebilirsiniz.</p>
      </header>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
        <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-2xl font-bold">
                {user.username.charAt(0).toUpperCase()}
            </div>
            <div>
                <h2 className="text-xl font-bold">{user.username}</h2>
                <p className="text-xs font-bold uppercase text-slate-400 tracking-wider">{user.role}</p>
            </div>
        </div>

        {msg && <div className="bg-green-50 text-green-700 p-3 rounded-lg mb-6 text-sm font-semibold">{msg}</div>}

        <form onSubmit={handleUpdate} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Kullanıcı Adı (Değiştirilemez)</label>
            <input 
              disabled
              type="text" 
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-slate-400 cursor-not-allowed"
              value={user.username}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Yeni Şifre</label>
            <input 
              type="password" 
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
              placeholder="Değiştirmek istemiyorsanız boş bırakın"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          {user.role === UserRole.STUDENT && (
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Danışman Öğretmen</label>
              <input 
                type="text" 
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                placeholder="Öğretmen kullanıcı adı"
                value={advisor}
                onChange={(e) => setAdvisor(e.target.value)}
              />
              <p className="text-[10px] mt-2 text-slate-400 uppercase font-bold italic">Öğretmeniniz, kendisine ait paneli kullanarak sizin gelişiminizi izleyebilir.</p>
            </div>
          )}

          <button 
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-indigo-100"
          >
            Bilgilerimi Güncelle
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
