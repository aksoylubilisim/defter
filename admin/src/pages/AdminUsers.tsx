import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  UserPlus, 
  Trash2, 
  Loader2,
  X,
  Lock,
  Pencil
} from 'lucide-react';
import { toast } from 'sonner';
import { apiFetch } from '../utils/api';
import AlertDialog from '../components/AlertDialog';

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const currentAdmin = JSON.parse(localStorage.getItem('admin_user') || '{}');

  const fetchUsers = async () => {
    try {
      const data = await apiFetch('/admin/users');
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openAddModal = () => {
    setModalMode('add');
    setSelectedUser(null);
    setUsername('');
    setPassword('');
    setShowModal(true);
  };

  const openEditModal = (user: any) => {
    setModalMode('edit');
    setSelectedUser(user);
    setUsername(user.username);
    setPassword(''); // Don't show password
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (modalMode === 'add') {
        await apiFetch('/admin/users', {
          method: 'POST',
          body: JSON.stringify({ username, password })
        });
        toast.success('Yönetici oluşturuldu');
      } else {
        await apiFetch(`/admin/users/${selectedUser._id}`, {
          method: 'PATCH',
          body: JSON.stringify({ 
            username, 
            ...(password ? { password } : {}) // Only send password if changed
          })
        });
        toast.success('Yönetici güncellendi');
      }
      setShowModal(false);
      fetchUsers();
    } catch (err: any) {
      toast.error(err.message || 'Hata oluştu');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await apiFetch(`/admin/users/${id}`, { method: 'DELETE' });
      toast.success('Yönetici silindi');
      fetchUsers();
    } catch (err: any) {
      toast.error(err.message || 'Hata oluştu');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <AlertDialog
        open={deleteId !== null}
        title="Yöneticiyi Sil"
        description="Bu yönetici hesabını silmek istediğinize emin misiniz? Bu işlem geri alınamaz."
        confirmLabel="Evet, Sil"
        onConfirm={() => { const id = deleteId!; setDeleteId(null); handleDelete(id); }}
        onCancel={() => setDeleteId(null)}
      />

      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3 font-heading">
            <ShieldCheck className="w-8 h-8 text-primary" />
            Admin Kullanıcılar
          </h1>
          <p className="text-muted-foreground mt-1">Sistemi yönetebilecek admin hesaplarını yönetin.</p>
        </div>
        <button 
          onClick={openAddModal}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all font-bold active:scale-95"
        >
          <UserPlus className="w-5 h-5" />
          Yeni Yönetici
        </button>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left">
          <thead>
            <tr className="text-muted-foreground text-[10px] uppercase tracking-widest font-black bg-muted/50">
              <th className="px-6 py-4">Kullanıcı Adı</th>
              <th className="px-6 py-4">Kayıt Tarihi</th>
              <th className="px-6 py-4 text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              <tr>
                <td colSpan={3} className="px-6 py-12 text-center">
                  <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
                </td>
              </tr>
            ) : users.map((u) => (
              <tr key={u._id} className="hover:bg-accent/50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-foreground">{u.username}</span>
                      {currentAdmin.id === u._id && (
                        <span className="text-[9px] text-primary font-black uppercase tracking-tighter">Siz</span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-muted-foreground text-sm">
                  {new Date(u.createdAt).toLocaleDateString('tr-TR')}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => openEditModal(u)}
                      className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    {currentAdmin.id !== u._id && (
                      <button 
                        onClick={() => setDeleteId(u._id)}
                        className="p-2 rounded-lg text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in zoom-in duration-200">
          <div className="bg-card border border-border w-full max-w-md rounded-3xl p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-foreground font-heading">
                {modalMode === 'add' ? 'Yeni Yönetici' : 'Yöneticiyi Düzenle'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
              {/* Fake fields to trick Chrome autofill */}
              <input type="text" name="fake_user" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />
              <input type="password" name="fake_pass" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Kullanıcı Adı</label>
                <input 
                  type="text" 
                  name="adm_u_field"
                  autoFocus
                  required
                  readOnly
                  onFocus={(e) => e.target.readOnly = false}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="off"
                  className="w-full bg-accent/50 border border-border rounded-xl py-3 px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="admin_username"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Şifre {modalMode === 'edit' && '(Değiştirmek istemiyorsanız boş bırakın)'}
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input 
                    type="password" 
                    name="adm_p_field"
                    required={modalMode === 'add'}
                    readOnly
                    onFocus={(e) => e.target.readOnly = false}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    className="w-full bg-accent/50 border border-border rounded-xl py-3 pl-11 pr-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              <button 
                type="submit"
                className="w-full py-4 bg-primary text-white rounded-xl shadow-lg font-bold hover:opacity-90 transition-all active:scale-95"
              >
                {modalMode === 'add' ? 'Yönetici Oluştur' : 'Değişiklikleri Kaydet'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
