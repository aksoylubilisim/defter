import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  ShieldCheck,
  LogOut, 
  Menu, 
  X, 
  Bell,
  Search,
  Sun,
  Moon,
  ChevronDown,
  User
} from 'lucide-react';

const Layout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('admin_theme') || 'dark');
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('admin_user') || '{}');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('admin_theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Üyeler', icon: Users, path: '/members' },
    { name: 'Admin Kullanıcılar', icon: ShieldCheck, path: '/admin-users' },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex transition-colors duration-300">
      {/* Sidebar */}
      <aside 
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } bg-card border-r border-border transition-all duration-300 flex flex-col fixed h-full z-50`}
      >
        <div className="p-6 flex items-center justify-between">
          {isSidebarOpen && (
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent font-heading">
              Defter Admin
            </span>
          )}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1.5 rounded-lg hover:bg-accent transition-colors"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                location.pathname === item.path 
                  ? 'bg-primary/10 text-primary border border-primary/20 shadow-sm' 
                  : 'hover:bg-accent text-muted-foreground hover:text-foreground'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {isSidebarOpen && <span className="font-medium">{item.name}</span>}
            </Link>
          ))}
        </nav>

        <div className="p-6 border-t border-border">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                {(user.username || 'A')[0].toUpperCase()}
             </div>
             {isSidebarOpen && (
               <div className="flex-1 overflow-hidden">
                 <p className="text-sm font-bold truncate">{user.username || 'Admin'}</p>
                 <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">Yönetici</p>
               </div>
             )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Navbar */}
        <header className="h-20 border-b border-border flex items-center justify-between px-8 sticky top-0 bg-background/80 backdrop-blur-md z-40">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Sistemde ara..." 
                className="w-full bg-accent/50 border border-border rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-full hover:bg-accent text-muted-foreground hover:text-foreground transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-background"></span>
            </button>
            
            {/* User Menu Dropdown */}
            <div className="relative pl-4 border-l border-border">
              <button 
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-accent transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary font-bold group-hover:scale-105 transition-transform">
                  {(user.username || 'A')[0].toUpperCase()}
                </div>
                <div className="text-left hidden md:block">
                  <p className="text-xs font-bold text-foreground leading-tight">{user.username || 'Admin'}</p>
                  <p className="text-[9px] text-muted-foreground uppercase tracking-tighter">Sistem Yöneticisi</p>
                </div>
                <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {isUserMenuOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setIsUserMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-2xl shadow-2xl py-2 z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-3 border-b border-border mb-1">
                      <p className="text-xs font-medium text-muted-foreground">Oturum</p>
                      <p className="text-sm font-bold text-foreground truncate">{user.username}</p>
                    </div>

                    <button 
                      onClick={toggleTheme}
                      className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-foreground hover:bg-accent transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {theme === 'light' ? <Moon className="w-4 h-4 text-primary" /> : <Sun className="w-4 h-4 text-primary" />}
                        <span>Görünüm</span>
                      </div>
                      <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold uppercase">
                        {theme === 'light' ? 'Koyu' : 'Açık'}
                      </span>
                    </button>

                    <button 
                      onClick={() => { setIsUserMenuOpen(false); navigate('/profile'); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-accent transition-colors"
                    >
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span>Profilim</span>
                    </button>

                    <div className="h-px bg-border my-1" />

                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-rose-500 hover:bg-rose-500/10 transition-colors font-bold"
                    >
                      <LogOut className="w-4 h-4" />
                      Çıkış Yap
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
