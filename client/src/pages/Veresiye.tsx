import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  ArrowLeft,
  Loader2,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  UserCircle
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { apiFetch } from '../utils/api';

const Veresiye: React.FC = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const data = await apiFetch('/customers');
      // Only show customers with non-zero balance
      setCustomers(data.filter((c: any) => c.balance !== 0));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalDebt = customers.filter(c => c.balance > 0).reduce((acc, c) => acc + c.balance, 0);
  const totalCredit = customers.filter(c => c.balance < 0).reduce((acc, c) => acc + Math.abs(c.balance), 0);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-muted-foreground">Veresiye bilgileri alınıyor...</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto py-8 px-4 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-32">
      <button 
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Panel
      </button>

      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-primary" />
          Veresiye Defteri
        </h1>
        <p className="text-muted-foreground mt-1">Borç ve alacakların genel durumu.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 mb-10">
        <div className="p-6 rounded-[2rem] bg-rose-500/10 border border-rose-500/20 shadow-sm">
          <TrendingUp className="w-6 h-6 text-rose-500 mb-3" />
          <p className="text-[10px] uppercase tracking-widest font-black text-rose-500/60">Toplam Alacak</p>
          <p className="text-xl font-mono font-black text-rose-500">₺{totalDebt.toLocaleString('tr-TR')}</p>
        </div>
        <div className="p-6 rounded-[2rem] bg-emerald-500/10 border border-emerald-500/20 shadow-sm">
          <TrendingDown className="w-6 h-6 text-emerald-500 mb-3" />
          <p className="text-[10px] uppercase tracking-widest font-black text-emerald-500/60">Toplam Borç</p>
          <p className="text-xl font-mono font-black text-emerald-500">₺{totalCredit.toLocaleString('tr-TR')}</p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-heading font-bold px-2">Açık Hesaplar</h3>
        {customers.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-border rounded-[2.5rem] text-muted-foreground">
            Şu an açık veresiye hesabı bulunmuyor.
          </div>
        ) : (
          <div className="space-y-3">
            {customers.map((customer) => (
              <Link
                key={customer._id}
                to={`/customers/${customer._id}`}
                className="w-full p-5 rounded-3xl bg-card border border-border hover:border-primary/30 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    <UserCircle className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-foreground">{customer.name}</p>
                    <p className={`text-[10px] uppercase tracking-widest font-black ${
                      customer.balance > 0 ? 'text-rose-500/60' : 'text-emerald-500/60'
                    }`}>
                      {customer.balance > 0 ? 'Müşteri Borcu' : 'Ödeme/Alacak'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <p className={`text-lg font-mono font-black ${
                    customer.balance > 0 ? 'text-rose-500' : 'text-emerald-500'
                  }`}>
                    ₺{Math.abs(customer.balance).toLocaleString('tr-TR')}
                  </p>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 group-hover:text-primary transition-all" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Veresiye;
