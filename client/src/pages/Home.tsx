import React from 'react'
import { Link } from 'react-router-dom'
import { Wallet, BookOpen, ShieldCheck } from 'lucide-react'

const Home: React.FC = () => {
  const modules = [
    {
      to: '/kasa',
      icon: Wallet,
      bgIcon: Wallet,
      title: 'Kasa Defteri',
      description: 'Günlük nakit giriş ve çıkışlarını takip edin.',
      cta: 'İncele',
    },
    {
      to: '/customers',
      icon: BookOpen,
      bgIcon: BookOpen,
      title: 'Müşterilerimiz',
      description: 'Müşteri listesini yönetin ve yeni kayıt oluşturun.',
      cta: 'Yönet',
    },
    {
      to: '/veresiye',
      icon: BookOpen,
      bgIcon: Wallet,
      title: 'Veresiye Defteri',
      description: 'Alacak ve verecek durumlarını kontrol edin.',
      cta: 'Görüntüle',
    },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {modules.map((m) => (
          <Link
            key={m.to}
            to={m.to}
            className="group relative p-8 rounded-[2rem] bg-card border border-border hover:border-primary/50 transition-all text-left overflow-hidden shadow-xl block"
          >
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
              <m.bgIcon className="w-24 h-24 text-primary" />
            </div>
            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <m.icon className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-2xl font-heading font-bold mb-2">{m.title}</h3>
            <p className="text-muted-foreground leading-relaxed">{m.description}</p>
            <div className="mt-8 flex items-center gap-2 text-primary font-bold">
              {m.cta} <ShieldCheck className="w-4 h-4" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Home
