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
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-[#12121a] border border-gray-800 rounded-2xl shadow-2xl p-8 animate-in zoom-in-95 duration-200">
        <div className="flex items-start gap-4 mb-6">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${iconColors[variant]}`}>
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white">{title}</h3>
            <p className="text-sm text-gray-400 mt-1 leading-relaxed">{description}</p>
          </div>
          <button onClick={onCancel} className="p-1 rounded-lg hover:bg-white/5 transition-colors text-gray-500">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-xl border border-gray-700 bg-white/5 hover:bg-white/10 font-medium text-white transition-all"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 py-3 rounded-xl font-bold text-white shadow-lg transition-all ${confirmColors[variant]}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertDialog;
