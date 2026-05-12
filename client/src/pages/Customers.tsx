import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  ArrowLeft,
  Loader2,
  UserPlus,
  Phone,
  ArrowRight,
  UserCircle
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { apiFetch } from '../utils/api';
import { toast } from 'sonner';

const Customers: React.FC = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Customer Form
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const fetchCustomers = async () => {
    try {
      const data = await apiFetch('/customers');
      setCustomers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiFetch('/customers', {
        method: 'POST',
        body: JSON.stringify({ name, phone, address })
      });
      setName('');
      setPhone('');
      setAddress('');
      setShowAddModal(false);
      toast.success('Müşteri kaydedildi');
      fetchCustomers();
    } catch (err) {
      toast.error('Müşteri kaydedilirken hata oluştu');
    }
  };

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.phone?.includes(searchTerm)
  );

  return (
    <div className="max-w-xl mx-auto py-8 px-4 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-32">
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
            <Users className="w-8 h-8 text-primary" />
            Müşterilerimiz
          </h1>
          <p className="text-muted-foreground mt-1">Veresiye kayıtlı üyeleriniz.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="p-3 rounded-2xl bg-primary text-white hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
        >
          <UserPlus className="w-6 h-6" />
        </button>
      </div>

      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input 
          type="text" 
          placeholder="Müşteri veya telefon ara..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-card border border-border rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm"
        />
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <p className="text-muted-foreground">Müşteri listesi yükleniyor...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredCustomers.length === 0 ? (
            <div className="text-center py-20 border-2 border-dashed border-border rounded-[2.5rem] text-muted-foreground">
              {searchTerm ? 'Aramanızla eşleşen müşteri bulunamadı.' : 'Henüz müşteri eklenmemiş.'}
            </div>
          ) : (
            filteredCustomers.map((customer) => (
              <Link
                key={customer._id}
                to={`/customers/${customer._id}`}
                className="w-full p-6 rounded-[2rem] bg-card border border-border hover:border-primary/30 transition-all flex items-center justify-between group shadow-sm hover:shadow-md"
              >
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-secondary rounded-2xl flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    <UserCircle className="w-8 h-8" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-bold text-foreground text-lg">{customer.name}</h3>
                    {customer.phone && (
                      <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-0.5">
                        <Phone className="w-3 h-3" />
                        {customer.phone}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className={`text-lg font-mono font-black ${
                      customer.balance > 0 ? 'text-rose-500' : customer.balance < 0 ? 'text-emerald-500' : 'text-muted-foreground'
                    }`}>
                      {customer.balance > 0 ? '₺' : customer.balance < 0 ? '-₺' : '₺'}{Math.abs(customer.balance).toLocaleString('tr-TR')}
                    </p>
                    <p className="text-[10px] uppercase tracking-widest font-black opacity-40">
                      {customer.balance > 0 ? 'Borçlu' : customer.balance < 0 ? 'Alacaklı' : 'Dengede'}
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 group-hover:text-primary transition-all" />
                </div>
              </Link>
            ))
          )}
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-card border border-border rounded-[2.5rem] shadow-2xl p-8 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-heading font-bold">Yeni Müşteri</h3>
              <button onClick={() => setShowAddModal(false)} className="p-2 rounded-xl hover:bg-secondary transition-colors">
                <Plus className="w-6 h-6 rotate-45" />
              </button>
            </div>

            <form onSubmit={handleAddCustomer} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2 px-1">Müşteri Adı</label>
                <input 
                  required
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Örn: Ahmet Yılmaz"
                  className="w-full bg-secondary/50 border border-border rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2 px-1">Telefon</label>
                <input 
                  type="tel" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="05..."
                  className="w-full bg-secondary/50 border border-border rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2 px-1">Adres (İsteğe Bağlı)</label>
                <textarea 
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Müşteri adresi..."
                  rows={2}
                  className="w-full bg-secondary/50 border border-border rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                />
              </div>

              <button 
                type="submit"
                className="w-full py-4 rounded-2xl bg-primary hover:bg-primary/90 font-bold text-white shadow-lg shadow-primary/20 transition-all"
              >
                Müşteriyi Kaydet
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;
