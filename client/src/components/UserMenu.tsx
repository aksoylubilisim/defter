import React, { useState } from 'react';
import { 
  User, 
  Settings, 
  LogOut, 
  Smartphone, 
  ChevronDown 
} from 'lucide-react';

interface UserMenuProps {
  user: any;
  onLogout: () => void;
  onNavigate: (view: string) => void;
}

const UserMenu: React.FC<UserMenuProps> = ({ user, onLogout, onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1 pl-3 rounded-full bg-secondary/50 border border-border hover:border-primary/50 transition-all group"
      >
        <span className="text-sm font-medium hidden sm:block">{user.name}</span>
        <div className="w-8 h-8 rounded-full overflow-hidden border border-border group-hover:border-primary/30 transition-all">
          <img src={user.picture} alt={user.name} className="w-full h-full object-cover" />
        </div>
        <ChevronDown className={`w-4 h-4 mr-2 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-[90]" 
            onClick={() => setIsOpen(false)} 
          />
          <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-card/95 backdrop-blur-xl border border-border shadow-2xl z-[100] py-2 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="px-4 py-3 border-b border-border">
              <p className="text-sm font-bold text-foreground truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
            
            <button 
              onClick={() => { onNavigate('sessions'); setIsOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-secondary/50 transition-colors"
            >
              <Smartphone className="w-4 h-4 text-primary" />
              Oturumlarım
            </button>
            
            <button 
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-secondary/50 transition-colors"
            >
              <Settings className="w-4 h-4 text-muted-foreground" />
              Ayarlar
            </button>
            
            <div className="border-t border-border mt-1 pt-1">
              <button 
                onClick={onLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-rose-500 hover:bg-rose-500/10 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Çıkış Yap
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserMenu;
