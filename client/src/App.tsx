import { useEffect, useState } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google'
import { BookOpen, Wallet, ShieldCheck, Sun, Moon, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { apiFetch } from './utils/api'
import { getDeviceId } from './utils/deviceId'
import Layout from './components/Layout'
import Kasa from './pages/Kasa'
import Customers from './pages/Customers'
import CustomerDetail from './pages/CustomerDetail'
import Veresiye from './pages/Veresiye'
import SessionsView from './components/SessionsView'
import Home from './pages/Home'
import { useSearchParams } from 'react-router-dom'

// ──────────────────────────────────────────────────────────────────
// Auth guard – kullanıcı yoksa login'e yönlendirir
// ──────────────────────────────────────────────────────────────────
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token')
  const user = localStorage.getItem('user')
  if (!token || !user) return <Navigate to="/login" replace />
  return <>{children}</>
}

// ──────────────────────────────────────────────────────────────────
// Auth Callback Page (for admin impersonation)
// ──────────────────────────────────────────────────────────────────
const AuthCallback = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  useEffect(() => {
    const token = searchParams.get('token')
    const userStr = searchParams.get('user')

    if (token && userStr) {
      try {
        localStorage.setItem('token', token)
        localStorage.setItem('user', userStr)
        toast.success('Yönetici tarafından giriş yapıldı')
        navigate('/', { replace: true })
      } catch (err) {
        console.error('Callback error:', err)
        navigate('/login', { replace: true })
      }
    } else {
      navigate('/login', { replace: true })
    }
  }, [searchParams, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Loader2 className="w-12 h-12 animate-spin text-primary" />
    </div>
  )
}

// ──────────────────────────────────────────────────────────────────
// Login Page
// ──────────────────────────────────────────────────────────────────
const LoginPage = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light')

  useEffect(() => {
    // Zaten giriş yapılmışsa yönlendir
    if (localStorage.getItem('token') && localStorage.getItem('user')) {
      navigate('/', { replace: true })
    }
  }, [navigate])

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light')

  const handleSuccess = async (credentialResponse: any) => {
    setLoading(true)
    try {
      const data = await apiFetch('/auth/google', {
        method: 'POST',
        body: JSON.stringify({
          credential: credentialResponse.credential,
          deviceId: getDeviceId()
        }),
      })
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      navigate('/', { replace: true })
    } catch (err) {
      console.error('Auth error:', err)
      toast.error('Giriş yapılırken bir hata oluştu.')
    } finally {
      setLoading(false)
    }
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
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-secondary/50 border border-border hover:border-primary/50 text-foreground transition-all"
              aria-label="Toggle Theme"
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
            ) : (
              <GoogleLogin
                onSuccess={handleSuccess}
                onError={() => console.log('Login Failed')}
                useOneTap
                shape="pill"
                theme={theme === 'dark' ? 'filled_black' : 'filled_blue'}
              />
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
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
              {loading ? (
                <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
              ) : (
                <GoogleLogin
                  onSuccess={handleSuccess}
                  onError={() => console.log('Login Failed')}
                  text="signin_with"
                  shape="pill"
                  size="large"
                  width="280"
                />
              )}
            </div>
          </div>
        </div>

        {/* Features */}
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

// ──────────────────────────────────────────────────────────────────
// Router
// ──────────────────────────────────────────────────────────────────
function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/auth-callback" element={<AuthCallback />} />

      {/* Protected – Layout (Navbar) içinde */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Home />} />
        <Route path="kasa" element={<Kasa />} />
        <Route path="customers" element={<Customers />} />
        <Route path="customers/:id" element={<CustomerDetail />} />
        <Route path="veresiye" element={<Veresiye />} />
        <Route path="sessions" element={<SessionsView />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
