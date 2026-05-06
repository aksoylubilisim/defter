import { useState } from 'react'
import { GoogleLogin } from '@react-oauth/google'
import { BookOpen, Wallet, ShieldCheck, ArrowRight } from 'lucide-react'

function App() {
  const [user, setUser] = useState<any>(null)

  const handleSuccess = (credentialResponse: any) => {
    console.log('Login Success:', credentialResponse)
    setUser(credentialResponse)
    // TODO: Send token to kernel for verification
  }

  const handleError = () => {
    console.log('Login Failed')
  }

  if (user) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md p-8 rounded-3xl bg-card border border-border shadow-xl text-center">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-2xl font-heading font-bold mb-2">Hoş Geldiniz!</h1>
          <p className="text-muted-foreground mb-8">Başarıyla giriş yaptınız. Defterlerinize erişebilirsiniz.</p>
          <button 
            onClick={() => setUser(null)}
            className="text-sm text-primary hover:underline"
          >
            Çıkış Yap
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background selection:bg-primary/30">
      {/* Navbar */}
      <nav className="border-b border-border bg-background/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-heading font-bold tracking-tight">Defter</span>
          </div>
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={handleError}
            useOneTap
            shape="pill"
            theme="filled_blue"
          />
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 pt-20 pb-32">
        <div className="text-center space-y-8 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Yeni Nesil Defter Uygulaması
          </div>
          
          <h1 className="text-5xl md:text-7xl font-heading font-bold tracking-tight text-foreground leading-[1.1]">
            Kasa ve Veresiye <br />
            <span className="text-primary">Artık Cebinizde</span>
          </h1>
          
          <p className="text-xl text-muted-foreground leading-relaxed">
            İşletmenizin finansal kayıtlarını tutmanın en basit ve güvenli yolu. 
            Google hesabınızla anında başlayın, verilerinize her yerden erişin.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <div className="w-full sm:w-auto min-w-[200px]">
              <GoogleLogin
                onSuccess={handleSuccess}
                onError={handleError}
                text="signin_with"
                shape="pill"
                size="large"
                width="280"
              />
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-32">
          <div className="p-8 rounded-3xl bg-secondary/50 border border-border hover:border-primary/50 transition-all group">
            <div className="w-12 h-12 bg-white dark:bg-gray-900 rounded-2xl flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform">
              <Wallet className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-heading font-bold mb-3">Kasa Defteri</h3>
            <p className="text-muted-foreground leading-relaxed">
              Günlük gelir ve giderlerinizi saniyeler içinde kaydedin, kasanızın durumunu anlık takip edin.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-secondary/50 border border-border hover:border-primary/50 transition-all group">
            <div className="w-12 h-12 bg-white dark:bg-gray-900 rounded-2xl flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-heading font-bold mb-3">Veresiye Takibi</h3>
            <p className="text-muted-foreground leading-relaxed">
              Müşteri ve tedarikçi borç-alacak ilişkilerini profesyonelce yönetin, geciken ödemeleri görün.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-secondary/50 border border-border hover:border-primary/50 transition-all group">
            <div className="w-12 h-12 bg-white dark:bg-gray-900 rounded-2xl flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-heading font-bold mb-3">%100 Güvenli</h3>
            <p className="text-muted-foreground leading-relaxed">
              Verileriniz Google güvencesiyle bulutta yedeklenir. Cihazınız kaybolsa bile kayıtlarınız silinmez.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
