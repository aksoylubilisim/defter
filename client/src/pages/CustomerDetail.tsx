import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  X, 
  Loader2,
  Phone,
  MapPin,
  TrendingUp,
  TrendingDown,
  History,
  Wallet
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiFetch } from '../utils/api';
import { toast } from 'sonner';

const CustomerDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'debt' | 'payment'>('debt');
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');

  const fetchData = async () => {
    try {
      const result = await apiFetch(`/customers/${id}`);
      setData(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleAddTransaction = async () => {
    if (!amount) return;
    try {
      await apiFetch('/customers/transaction', {
        method: 'POST',
        body: JSON.stringify({
          customerId: id,
          type: modalType,
          amount: parseFloat(amount),
          notes
        })
      });
      setAmount('');
      setNotes('');
      setShowModal(false);
      toast.success(modalType === 'debt' ? 'Borç kaydedildi' : 'Tahsilat kaydedildi');
      fetchData();
    } catch (err) {
      toast.error('İşlem kaydedilirken hata oluştu');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-muted-foreground">Müşteri detayları alınıyor...</p>
      </div>
    );
  }

  const { customer, transactions } = data;

  return (
    <div className="max-w-xl mx-auto py-8 px-4 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-32">
      <button 
        onClick={() => navigate('/customers')}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Müşteri Listesi
      </button>

      <div className="flex flex-col gap-6 mb-8">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-heading font-bold text-foreground">{customer.name}</h1>
            <div className="flex flex-col gap-1">
              {customer.phone && (
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5" />
                  {customer.phone}
                </p>
              )}
              {customer.address && (
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5" />
                  {customer.address}
                </p>
              )}
            </div>
          </div>
          <div className="w-16 h-16 bg-primary/10 rounded-[1.5rem] flex items-center justify-center text-primary">
            <TrendingUp className="w-8 h-8" />
          </div>
        </div>

        {/* Balance Card */}
        <div className={`p-8 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden ${
          customer.balance > 0 ? 'bg-rose-500 shadow-rose-500/20' : customer.balance < 0 ? 'bg-emerald-500 shadow-emerald-500/20' : 'bg-secondary text-foreground'
        }`}>
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Wallet className="w-32 h-32 rotate-12" />
          </div>
          <p className="opacity-80 font-medium mb-2 uppercase tracking-widest text-[10px] font-black">
            {customer.balance > 0 ? 'Müşteri Borcu' : customer.balance < 0 ? 'Müşteri Alacağı' : 'Hesap Dengede'}
          </p>
          <h2 className="text-5xl font-mono font-black tracking-tight">
            ₺{Math.abs(customer.balance).toLocaleString('tr-TR')}
          </h2>
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-4 mb-10">
        <button 
          onClick={() => { setModalType('debt'); setShowModal(true); }}
          className="flex flex-col items-center gap-3 p-6 rounded-3xl bg-rose-500/10 border border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white transition-all group"
        >
          <TrendingUp className="w-8 h-8 group-hover:scale-110 transition-transform" />
          <span className="font-bold">Borç Yaz</span>
        </button>
        <button 
          onClick={() => { setModalType('payment'); setShowModal(true); }}
          className="flex flex-col items-center gap-3 p-6 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all group"
        >
          <TrendingDown className="w-8 h-8 group-hover:scale-110 transition-transform" />
          <span className="font-bold">Tahsilat Yap</span>
        </button>
      </div>

      {/* Transaction List */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 px-2">
          <History className="w-5 h-5 text-primary" />
          <h3 className="text-xl font-heading font-bold">İşlem Geçmişi</h3>
        </div>
        
        {transactions.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-border rounded-[2.5rem] text-muted-foreground">
            Henüz bir işlem kaydedilmemiş.
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((t: any) => (
              <div key={t._id} className="p-5 rounded-3xl bg-card border border-border hover:border-primary/30 transition-all flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    t.type === 'debt' ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-500'
                  }`}>
                    {t.type === 'debt' ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="font-bold text-foreground">{t.type === 'debt' ? 'Borç Girişi' : 'Ödeme/Tahsilat'}</p>
                    <p className="text-xs text-muted-foreground">{new Date(t.createdAt).toLocaleDateString('tr-TR')}</p>
                    {t.notes && <p className="text-xs text-muted-foreground mt-1 italic">"{t.notes}"</p>}
                  </div>
                </div>
                <span className={`text-lg font-mono font-black ${
                  t.type === 'debt' ? 'text-rose-500' : 'text-emerald-500'
                }`}>
                  {t.type === 'debt' ? '+' : '-'}₺{t.amount.toLocaleString('tr-TR')}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Transaction Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-card border border-border rounded-[2.5rem] shadow-2xl p-8 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-heading font-bold">
                {modalType === 'debt' ? 'Borç Yaz' : 'Tahsilat Yap'}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-xl hover:bg-secondary transition-colors">
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
                <label className="block text-sm font-medium text-muted-foreground mb-2 px-1">Notlar</label>
                <input 
                  type="text" 
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="İşlem notu..."
                  className="w-full bg-secondary/50 border border-border rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>

              <button 
                onClick={handleAddTransaction}
                className={`w-full py-4 rounded-2xl font-bold text-white shadow-lg transition-all ${
                  modalType === 'debt' 
                    ? 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/20' 
                    : 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20'
                }`}
              >
                İşlemi Kaydet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDetail;
