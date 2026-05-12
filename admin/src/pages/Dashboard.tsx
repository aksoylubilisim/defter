import React, { useState, useEffect } from 'react';
import { 
  Users, 
  BookOpen, 
  TrendingUp, 
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
  Clock
} from 'lucide-react';
import { apiFetch } from '../utils/api';

const StatCard = ({ title, value, change, icon: Icon, trend }: any) => (
  <div className="bg-card border border-border p-6 rounded-2xl hover:border-primary/30 transition-all group shadow-sm">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-primary/5 rounded-xl text-primary group-hover:scale-110 transition-transform">
        <Icon className="w-6 h-6" />
      </div>
      <div className={`flex items-center gap-1 text-sm font-medium ${trend === 'up' ? 'text-emerald-500' : 'text-rose-500'}`}>
        {change}
        {trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
      </div>
    </div>
    <p className="text-muted-foreground text-sm font-medium">{title}</p>
    <h3 className="text-3xl font-bold text-foreground mt-1">{value}</h3>
  </div>
);

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await apiFetch('/admin/members/stats');
        setStats(data);
      } catch (error) {
        console.error('Stats fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = stats ? [
    { title: 'Toplam Kullanıcı', value: stats.totalUsers, change: '+12%', icon: Users, trend: 'up' },
    { title: 'Aktif Defterler', value: stats.activeKasaPages, change: '+5%', icon: BookOpen, trend: 'up' },
    { title: 'Günlük İşlem', value: stats.dailyTransactions, change: '-2%', icon: TrendingUp, trend: 'down' },
    { title: 'Sistem Yükü (Oturum)', value: stats.systemLoad, change: 'Sabit', icon: Activity, trend: 'up' },
  ] : [];

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Az önce';
    if (diffMins < 60) return `${diffMins} dk önce`;
    if (diffHours < 24) return `${diffHours} sa önce`;
    return `${diffDays} gün önce`;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <p className="text-gray-500 font-medium">İstatistikler yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-foreground font-heading">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Sistemin genel durumuna genel bir bakış.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => (
          <StatCard key={idx} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity Table */}
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl overflow-hidden shadow-xl">
          <div className="p-6 border-b border-border flex justify-between items-center">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2 font-heading">
              <Clock className="w-5 h-5 text-primary" />
              Son Etkinlikler
            </h2>
            <button className="text-sm text-primary hover:underline font-medium">Tümünü Gör</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-muted-foreground text-[10px] uppercase tracking-[0.2em] font-black bg-muted/50">
                  <th className="px-6 py-4">Kullanıcı</th>
                  <th className="px-6 py-4">İşlem</th>
                  <th className="px-6 py-4">Zaman</th>
                  <th className="px-6 py-4 text-right">Durum</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {stats.recentActivities?.map((action: any, idx: number) => (
                  <tr key={idx} className="hover:bg-accent/50 transition-colors group">
                    <td className="px-6 py-4">
                      <p className="font-bold text-foreground text-sm">{action.user}</p>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground text-sm">{action.action}</td>
                    <td className="px-6 py-4 text-muted-foreground/70 text-xs">{formatTime(action.time)}</td>
                    <td className="px-6 py-4 text-right">
                      <span className="px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                        {action.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {(!stats.recentActivities || stats.recentActivities.length === 0) && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground italic">Henüz bir aktivite bulunmuyor.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* System Health */}
        <div className="space-y-6">
          <div className="bg-card border border-border p-6 rounded-2xl shadow-xl">
            <h2 className="text-xl font-bold text-foreground mb-6 font-heading">Sistem Sağlığı</h2>
            <div className="space-y-6">
              {[
                { label: 'CPU Kullanımı', value: stats.health?.cpu || 0, color: 'bg-primary' },
                { label: 'Bellek Kullanımı', value: stats.health?.mem || 0, color: 'bg-amber-500' },
                { label: 'Disk Alanı', value: stats.health?.disk || 0, color: 'bg-emerald-500' },
              ].map((item, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground font-medium">{item.label}</span>
                    <span className="text-foreground font-bold">%{item.value}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${item.color} rounded-full transition-all duration-1000`} 
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card border border-border p-6 rounded-2xl shadow-xl flex flex-col items-center justify-center text-center space-y-4 py-12 transition-colors">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <Activity className="w-8 h-8 text-emerald-500" />
            </div>
            <div>
              <h3 className="text-foreground font-bold text-lg">Sunucu Durumu</h3>
              <p className="text-muted-foreground text-sm mt-1">Sistem normal şekilde çalışıyor.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
