import React, { useState, useEffect } from 'react';
import { 
  Wallet, 
  ArrowUpCircle, 
  ArrowDownCircle, 
  Plus, 
  X, 
  ArrowLeft,
  Loader2,
  Calendar,
  CheckCircle2,
  History
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { apiFetch } from '../utils/api';
import AlertDialog from '../components/AlertDialog';

const Kasa: React.FC = () => {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalType, setModalType] = useState<'in' | 'out'>('in');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);

  const fetchData = async () => {
    try {
      const data = await apiFetch('/kasa/active');
      setActivePage(data.page);
      setTransactions(data.transactions);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddTransaction = async () => {
    if (!amount || !description) return;
    try {
      await apiFetch('/kasa/transaction', {
        method: 'POST',
        body: JSON.stringify({
          pageId: activePage._id,
          type: modalType,
          amount: parseFloat(amount),
          description
        })
      });
      setAmount('');
      setDescription('');
      setShowAddModal(false);
      toast.success('İşlem kaydedildi');
      fetchData();
    } catch (err) {
      toast.error('İşlem kaydedilirken hata oluştu');
    }
  };

  const handleCloseKasa = async () => {
    const currentBalance = transactions.reduce((acc, t) => 
      t.type === 'in' ? acc + t.amount : acc - t.amount, 
      activePage.openingBalance
    );
    
    try {
      await apiFetch('/kasa/close', {
        method: 'POST',
        body: JSON.stringify({
          pageId: activePage._id,
          closingBalance: currentBalance
        })
      });
      toast.success('Kasa sayfası kapatıldı');
      fetchData();
    } catch (err) {
      toast.error('Kasa kapatılırken hata oluştu');
    }
  };

  const currentBalance = transactions.reduce((acc, t) => 
    t.type === 'in' ? acc + t.amount : acc - t.amount, 
    activePage?.openingBalance || 0
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <p className="text-muted-foreground">Kasa bilgileri alınıyor...</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto py-8 px-4 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-32">
      <AlertDialog
        open={showCloseConfirm}
        title="Kasayı Kapat"
        description="Kasa defterini kapatmak istediğinize emin misiniz? Bu işlem kasayı kapatıp devri oluşturacaktır."
        confirmLabel="Evet, Kapat"
        onConfirm={() => { setShowCloseConfirm(false); handleCloseKasa(); }}
        onCancel={() => setShowCloseConfirm(false)}
      />

      <button 
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Panel
      </button>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-heading font-bold flex items-center gap-3">
            <Wallet className="w-8 h-8 text-primary" />
            Kasa Defteri
          </h1>
          <p className="text-muted-foreground mt-1">Günlük nakit akışınızı yönetin.</p>
        </div>
        <button 
          onClick={() => setShowCloseConfirm(true)}
          className="p-3 rounded-2xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all shadow-lg shadow-primary/10"
          title="Kasayı Kapat"
        >
          <CheckCircle2 className="w-6 h-6" />
        </button>
      </div>

      {/* Balance Card */}
      <div className="bg-primary p-8 rounded-[2.5rem] text-white shadow-2xl shadow-primary/30 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <History className="w-32 h-32 rotate-12" />
        </div>
        <p className="text-primary-foreground/80 font-medium mb-2">Güncel Bakiye</p>
        <h2 className="text-5xl font-mono font-black tracking-tight">
          ₺{currentBalance.toLocaleString('tr-TR')}
        </h2>
        <div className="mt-8 flex items-center justify-between pt-6 border-t border-white/10 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 opacity-60" />
            <span>{new Date(activePage.openedAt).toLocaleDateString('tr-TR')}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="opacity-60">Açılış:</span>
            <span className="font-bold">₺{activePage.openingBalance.toLocaleString('tr-TR')}</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <button 
          onClick={() => { setModalType('in'); setShowAddModal(true); }}
          className="flex flex-col items-center gap-3 p-6 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all group"
        >
          <ArrowUpCircle className="w-8 h-8 group-hover:scale-110 transition-transform" />
          <span className="font-bold">Para Girişi</span>
        </button>
        <button 
          onClick={() => { setModalType('out'); setShowAddModal(true); }}
          className="flex flex-col items-center gap-3 p-6 rounded-3xl bg-rose-500/10 border border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white transition-all group"
        >
          <ArrowDownCircle className="w-8 h-8 group-hover:scale-110 transition-transform" />
          <span className="font-bold">Para Çıkışı</span>
        </button>
      </div>

      {/* Transaction History */}
      <div className="space-y-4">
        <h3 className="text-xl font-heading font-bold px-2">Günün Hareketleri</h3>
        {transactions.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-border rounded-[2rem] text-muted-foreground">
            Henüz işlem kaydedilmedi.
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((t) => (
              <div key={t._id} className="p-5 rounded-3xl bg-card border border-border hover:border-primary/30 transition-all flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    t.type === 'in' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
                  }`}>
                    {t.type === 'in' ? <Plus className="w-5 h-5" /> : <X className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="font-bold text-foreground">{t.description}</p>
                    <p className="text-xs text-muted-foreground">{new Date(t.createdAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>
                <span className={`text-lg font-mono font-black ${
                  t.type === 'in' ? 'text-emerald-500' : 'text-rose-500'
                }`}>
                  {t.type === 'in' ? '+' : '-'}₺{t.amount.toLocaleString('tr-TR')}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-card border border-border rounded-[2.5rem] shadow-2xl p-8 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-heading font-bold">
                {modalType === 'in' ? 'Para Girişi' : 'Para Çıkışı'}
              </h3>
              <button onClick={() => setShowAddModal(false)} className="p-2 rounded-xl hover:bg-secondary transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2 px-1">Miktar (₺)</label>
                <input 
                  type="number" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-secondary/50 border border-border rounded-2xl p-4 text-2xl font-mono font-bold focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2 px-1">Açıklama</label>
                <input 
                  type="text" 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Örn: Kahve satışı, Kira ödemesi..."
                  className="w-full bg-secondary/50 border border-border rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>

              <button 
                onClick={handleAddTransaction}
                className={`w-full py-4 rounded-2xl font-bold text-white shadow-lg transition-all ${
                  modalType === 'in' 
                    ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20' 
                    : 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/20'
                }`}
              >
                Kaydet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Kasa;
