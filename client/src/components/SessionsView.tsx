import React, { useState, useEffect } from 'react';
import { 
  Smartphone, 
  XCircle, 
  CheckCircle2, 
  ArrowLeft,
  Loader2,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { apiFetch } from '../utils/api';
import { getDeviceId } from '../utils/deviceId';
import { toast } from 'sonner';
import AlertDialog from './AlertDialog';
import { useNavigate } from 'react-router-dom';

const SessionsView: React.FC = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [terminateId, setTerminateId] = useState<string | null>(null);
  const currentDeviceId = getDeviceId();

  const fetchSessions = async () => {
    try {
      const data = await apiFetch('/auth/sessions');
      setSessions(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleTerminate = async (id: string) => {
    try {
      await apiFetch(`/auth/sessions/${id}`, { method: 'DELETE' });
      toast.success('Oturum sonlandırıldı');
      fetchSessions();
    } catch (err) {
      toast.error('Oturum sonlandırılırken hata oluştu');
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <AlertDialog
        open={terminateId !== null}
        title="Oturumu Sonlandır"
        description="Bu cihazın oturumunu kapatmak istediğinize emin misiniz?"
        confirmLabel="Evet, Kapat"
        onConfirm={() => { const id = terminateId!; setTerminateId(null); handleTerminate(id); }}
        onCancel={() => setTerminateId(null)}
      />
      <button 
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Geri Dön
      </button>

      <div className="space-y-2 mb-10">
        <h1 className="text-3xl font-heading font-bold text-foreground">Oturumlarım</h1>
        <p className="text-muted-foreground">Aktif oturumlarınızı yönetin ve diğer cihazlardan güvenle çıkış yapın.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      ) : (
        <div className="space-y-4">
          {sessions.map((session) => (
            <div 
              key={session._id}
              className={`p-6 rounded-3xl border transition-all flex items-center justify-between ${
                session.deviceId === currentDeviceId 
                  ? 'bg-primary/5 border-primary/20 ring-1 ring-primary/20' 
                  : 'bg-card border-border hover:border-primary/30'
              }`}
            >
              <div className="flex items-center gap-5">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                  session.deviceId === currentDeviceId ? 'bg-primary/20 text-primary' : 'bg-secondary text-muted-foreground'
                }`}>
                  <Smartphone className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-foreground">
                      {session.deviceId === currentDeviceId ? 'Bu Cihaz' : 'Diğer Cihaz'}
                    </span>
                    {session.deviceId === currentDeviceId && (
                      <span className="flex items-center gap-1 text-[10px] uppercase tracking-widest font-black text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-2.5 h-2.5" />
                        Aktif
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      Son görülme: {new Date(session.lastActive).toLocaleDateString('tr-TR')}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-border" />
                    <span className="font-mono text-[10px] opacity-50">{session.deviceId.slice(0, 13)}...</span>
                  </div>
                </div>
              </div>

              {session.deviceId !== currentDeviceId && (
                <button 
                  onClick={() => setTerminateId(session._id)}
                  className="p-3 rounded-2xl text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition-all group"
                  title="Oturumu Kapat"
                >
                  <XCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
                </button>
              )}
              
              {session.deviceId === currentDeviceId && (
                <div className="p-3 text-primary">
                  <ShieldCheck className="w-6 h-6" />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SessionsView;
