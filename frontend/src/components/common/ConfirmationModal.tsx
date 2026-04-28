import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
  isLoading?: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'warning',
  isLoading = false,
}) => {
  if (!isOpen) return null;

  const typeStyles = {
    danger: {
      icon: <X className="w-6 h-6 text-red-500" />,
      bg: 'bg-red-500/10',
      btn: 'bg-red-500 hover:bg-red-600 text-white',
    },
    warning: {
      icon: <AlertTriangle className="w-6 h-6 text-yellow-500" />,
      bg: 'bg-yellow-500/10',
      btn: 'bg-yellow-500 hover:bg-yellow-600 text-gray-900',
    },
    info: {
      icon: <AlertTriangle className="w-6 h-6 text-primary" />,
      bg: 'bg-primary/10',
      btn: 'bg-primary hover:bg-primary/90 text-gray-900',
    },
  };

  const style = typeStyles[type];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={isLoading ? undefined : onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-[#1a1d24] border border-gray-800 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-fade-in-scale">
        <div className="p-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className={`w-12 h-12 rounded-2xl ${style.bg} flex items-center justify-center flex-shrink-0`}>
              {style.icon}
            </div>
            <h3 className="text-xl font-bold text-white leading-tight">{title}</h3>
          </div>
          
          <p className="text-gray-400 mb-8 leading-relaxed">
            {message}
          </p>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className={`flex-1 py-3.5 rounded-xl font-bold transition-all duration-200 flex items-center justify-center space-x-2 ${style.btn} disabled:opacity-50`}
            >
              {isLoading && <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />}
              <span>{isLoading ? 'Processing...' : confirmText}</span>
            </button>
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 py-3.5 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl font-bold border border-white/10 transition-all duration-200 disabled:opacity-50"
            >
              {cancelText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
