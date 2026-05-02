// frontend/src/components/common/ConfirmationModal.jsx

import { X, AlertTriangle } from 'lucide-react';

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  type = 'primary',
}) => {
  if (!isOpen) return null;

  const colors = {
    primary: 'bg-primary text-gray-900 hover:bg-primary-hover',
    danger: 'bg-rose-500 text-white hover:bg-rose-600',
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-md transition-opacity animate-fade-in"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-surface/90 border border-white/5 rounded-[2rem] p-8 max-w-md w-full shadow-2xl animate-scale-up">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex flex-col items-center text-center space-y-6">
          <div className={`w-16 h-16 rounded-3xl flex items-center justify-center ${type === 'danger' ? 'bg-rose-500/10 text-rose-500' : 'bg-primary/10 text-primary'}`}>
            <AlertTriangle className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-black text-white tracking-tight">{title}</h3>
            <p className="text-gray-400 font-medium leading-relaxed">
              {message}
            </p>
          </div>

          <div className="flex items-center gap-4 w-full pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3.5 rounded-xl border border-white/5 text-gray-400 font-black uppercase tracking-widest text-xs hover:bg-white/5 hover:text-white transition-all"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 px-6 py-3.5 rounded-xl font-black uppercase tracking-widest text-xs transition-all transform hover:scale-[1.02] active:scale-95 shadow-xl ${colors[type] || colors.primary}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
