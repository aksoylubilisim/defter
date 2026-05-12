import React, { useState, useEffect } from 'react'
import { Outlet, useNavigate, Link } from 'react-router-dom'
import { BookOpen, Sun, Moon } from 'lucide-react'
import UserMenu from './UserMenu'

const Layout: React.FC = () => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light')
  const navigate = useNavigate()

  const user = JSON.parse(localStorage.getItem('user') || 'null')

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light')

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      <nav className="border-b border-border bg-background/50 backdrop-blur-xl sticky top-0 z-[80]">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-heading font-bold tracking-tight">Defter</span>
          </Link>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-secondary/50 border border-border hover:border-primary/50 transition-all"
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
            {user && (
              <UserMenu
                user={user}
                onLogout={handleLogout}
                onNavigate={(v: string) => navigate(`/${v}`)}
              />
            )}
          </div>
        </div>
      </nav>

      <Outlet />
    </div>
  )
}

export default Layout
