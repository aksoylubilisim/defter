import React, { useState } from 'react';
import { 
  User, 
  Lock, 
  ShieldCheck, 
  Save,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { apiFetch } from '../utils/api';

const Profile: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const admin = JSON.parse(localStorage.getItem('admin_user') || '{}');

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      return toast.error('Yeni şifreler eşleşmiyor');
    }

    if (newPassword.length < 4) {
      return toast.error('Yeni şifre en az 4 karakter olmalıdır');
    }

    setLoading(true);
    try {
      await apiFetch('/admin/users/me/password', {
        method: 'POST',
        body: JSON.stringify({ currentPassword, newPassword })
      });
      toast.success('Şifreniz başarıyla güncellendi');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      toast.error(err.message || 'Hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3 font-heading">
          <User className="w-8 h-8 text-primary" />
          Profilim
        </h1>
        <p className="text-muted-foreground mt-1">Hesap bilgilerinizi ve şifrenizi yönetin.</p>
      </div>

      <div className="grid gap-8">
        {/* Basic Info */}
        <div className="bg-card border border-border p-8 rounded-3xl shadow-sm">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold text-3xl">
              {(admin.username || 'A')[0].toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Kullanıcı Adı</p>
              <h2 className="text-2xl font-bold text-foreground">{admin.username}</h2>
              <div className="flex items-center gap-2 mt-1 text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full w-fit">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-tighter">Sistem Yöneticisi</span>
              </div>
            </div>
          </div>

          <div className="h-px bg-border my-8" />

          {/* Password Section */}
          <form onSubmit={handleUpdatePassword} className="space-y-6">
            <div className="flex items-center gap-2 text-foreground font-bold mb-4">
              <Lock className="w-5 h-5 text-primary" />
              Şifre Değiştir
            </div>

            <div className="grid gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Mevcut Şifre</label>
                <input 
                  type="password" 
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full bg-accent/50 border border-border rounded-xl py-3 px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  placeholder="••••••••"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Yeni Şifre</label>
                  <input 
                    type="password" 
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-accent/50 border border-border rounded-xl py-3 px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    placeholder="••••••••"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Yeni Şifre (Tekrar)</label>
                  <input 
                    type="password" 
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-accent/50 border border-border rounded-xl py-3 px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full md:w-fit px-8 py-3 bg-primary text-white rounded-xl shadow-lg shadow-primary/25 font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              Şifreyi Güncelle
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
