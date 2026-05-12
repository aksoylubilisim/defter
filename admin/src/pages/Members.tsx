import React, { useState, useEffect, useCallback } from 'react';
import { 
  Users, 
  Trash2, 
  UserMinus, 
  UserPlus, 
  Mail,
  Calendar,
  Loader2,
  Search,
  ChevronLeft,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';
import { apiFetch } from '../utils/api';
import AlertDialog from '../components/AlertDialog';

const Members: React.FC = () => {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiFetch(`/admin/members?page=${currentPage}&limit=${itemsPerPage}&search=${searchTerm}`);
      setMembers(data.data);
      setTotalPages(data.pages);
      setTotalItems(data.total);
    } catch (err) {
      console.error(err);
      toast.error('Veriler alınırken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMembers();
    }, 300); // Debounce search
    return () => clearTimeout(timer);
  }, [fetchMembers]);

  const toggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'passive' : 'active';
    try {
      await apiFetch(`/admin/members/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus })
      });
      toast.success(newStatus === 'active' ? 'Kullanıcı aktife alındı' : 'Kullanıcı pasife alındı');
      fetchMembers();
    } catch (err) {
      toast.error('İşlem sırasında hata oluştu');
    }
  };

  const deleteUser = async (id: string) => {
    try {
      await apiFetch(`/admin/members/${id}`, { method: 'DELETE' });
      toast.success('Kullanıcı ve tüm verileri silindi');
      fetchMembers();
    } catch (err) {
      toast.error('Silme işlemi sırasında hata oluştu');
    }
  };

  const handleLoginAs = async (id: string) => {
    try {
      const data = await apiFetch(`/admin/members/${id}/login-as`, { method: 'POST' });
      const clientUrl = `http://localhost:6682/auth-callback?token=${data.token}&user=${encodeURIComponent(JSON.stringify(data.user))}`;
      window.open(clientUrl, '_blank');
      toast.success('Kullanıcı ekranına yönlendiriliyor...');
    } catch (err: any) {
      toast.error(err.message || 'Bağlanırken bir hata oluştu');
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <AlertDialog
        open={deleteId !== null}
        title="Kullanıcıyı Sil"
        description="Bu kullanıcıyı ve TÜM verilerini (kasa, müşteriler) silmek istediğinize emin misiniz? Bu işlem geri alınamaz."
        confirmLabel="Evet, Sil"
        cancelLabel="Vazgeç"
        onConfirm={() => { const id = deleteId!; setDeleteId(null); deleteUser(id); }}
        onCancel={() => setDeleteId(null)}
        variant="danger"
      />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3 font-heading">
            <Users className="w-8 h-8 text-primary" />
            Üye Yönetimi
          </h1>
          <p className="text-muted-foreground mt-1">Sistemdeki Google kullanıcılarını yönetin ve istatistiklerini görün.</p>
        </div>
        
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Üye ara..." 
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full bg-accent/50 border border-border rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
          />
        </div>
      </div>

      <div className="grid gap-6">
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm relative min-h-[400px]">
          {loading && (
            <div className="absolute inset-0 bg-background/50 backdrop-blur-[1px] z-10 flex items-center justify-center">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  <th className="p-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Kullanıcı</th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Durum</th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center">İstatistikler</th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Kayıt</th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {members.map((member) => (
                  <tr key={member._id} className="hover:bg-accent/50 transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img src={member.picture} alt="" className="w-10 h-10 rounded-full border border-border" />
                        <div>
                          <p className="text-sm font-bold text-foreground">{member.name}</p>
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Mail className="w-3 h-3" />
                            {member.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        member.status === 'active' 
                          ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
                          : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                      }`}>
                        {member.status === 'active' ? 'AKTİF' : 'PASİF'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-6">
                        <div className="text-center" title="Müşteri Sayısı">
                          <p className="text-[9px] text-muted-foreground mb-0.5 uppercase font-bold">Müşteri</p>
                          <p className="text-sm font-mono font-bold text-foreground">{member.stats?.customerCount || 0}</p>
                        </div>
                        <div className="text-center" title="Kasa Sayfa Sayısı">
                          <p className="text-[9px] text-muted-foreground mb-0.5 uppercase font-bold">Kasa</p>
                          <p className="text-sm font-mono font-bold text-foreground">{member.stats?.kasaPageCount || 0}</p>
                        </div>
                        <div className="text-center" title="Aktif Oturum Sayısı">
                          <p className="text-[9px] text-muted-foreground mb-0.5 uppercase font-bold">Oturum</p>
                          <p className="text-sm font-mono font-bold text-foreground">{member.stats?.activeSessions || 0}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5 text-xs">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(member.createdAt).toLocaleDateString('tr-TR')}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1 transition-opacity">
                        <button 
                          onClick={() => handleLoginAs(member._id)}
                          className="p-2 rounded-lg text-primary hover:bg-primary/10 transition-all"
                          title="Üye Olarak Bağlan"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => toggleStatus(member._id, member.status)}
                          className={`p-2 rounded-lg transition-all ${
                            member.status === 'active'
                              ? 'text-amber-500 hover:bg-amber-500/10'
                              : 'text-emerald-500 hover:bg-emerald-500/10'
                          }`}
                          title={member.status === 'active' ? 'Pasife Al' : 'Aktife Al'}
                        >
                          {member.status === 'active' ? <UserMinus className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                        </button>
                        <button 
                          onClick={() => setDeleteId(member._id)}
                          className="p-2 rounded-lg text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition-all"
                          title="Sil"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!loading && members.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-muted-foreground">
                      Üye bulunamadı.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination UI */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-border flex items-center justify-between bg-muted/20">
              <p className="text-sm text-muted-foreground">
                Toplam <span className="font-bold text-foreground">{totalItems}</span> üyeden 
                <span className="font-bold text-foreground"> {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, totalItems)}</span> arası gösteriliyor.
              </p>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1 || loading}
                  className="p-2 rounded-lg border border-border hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-1">
                  {[...Array(totalPages)].map((_, i) => {
                    // Show a limited number of page buttons if there are too many
                    if (totalPages > 7) {
                      if (i + 1 !== 1 && i + 1 !== totalPages && (i + 1 < currentPage - 1 || i + 1 > currentPage + 1)) {
                        if (i + 1 === currentPage - 2 || i + 1 === currentPage + 2) return <span key={i} className="px-1">...</span>;
                        return null;
                      }
                    }
                    return (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        disabled={loading}
                        className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                          currentPage === i + 1 
                            ? 'bg-primary text-white' 
                            : 'hover:bg-accent text-muted-foreground'
                        }`}
                      >
                        {i + 1}
                      </button>
                    );
                  })}
                </div>
                <button 
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages || loading}
                  className="p-2 rounded-lg border border-border hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Members;
