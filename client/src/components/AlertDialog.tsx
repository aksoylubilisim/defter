import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface AlertDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'danger' | 'warning' | 'default';
}

const AlertDialog: React.FC<AlertDialogProps> = ({
  open,
  title,
  description,
  confirmLabel = 'Onayla',
  cancelLabel = 'İptal',
  onConfirm,
  onCancel,
  variant = 'danger',
}) => {
  if (!open) return null;

  const confirmColors = {
    danger: 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/20',
    warning: 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/20',
    default: 'bg-primary hover:bg-primary/90 shadow-primary/20',
  };

  const iconColors = {
    danger: 'bg-rose-500/10 text-rose-500',
    warning: 'bg-amber-500/10 text-amber-500',
    default: 'bg-primary/10 text-primary',
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-card border border-border rounded-[2rem] shadow-2xl p-8 animate-in zoom-in-95 duration-200">
        <div className="flex items-start gap-4 mb-6">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${iconColors[variant]}`}>
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-heading font-bold text-foreground">{title}</h3>
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{description}</p>
          </div>
          <button onClick={onCancel} className="p-1 rounded-lg hover:bg-secondary transition-colors text-muted-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-2xl border border-border bg-secondary/50 hover:bg-secondary font-medium text-foreground transition-all"
          >
            {cancelLabel}
          </button>
          <button
            onClick={() => { onConfirm(); }}
            className={`flex-1 py-3 rounded-2xl font-bold text-white shadow-lg transition-all ${confirmColors[variant]}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertDialog;
