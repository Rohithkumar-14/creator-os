import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { ToastMessage } from '../../types';

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <aside aria-label="Notifications" className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          const config = {
            success: {
              icon: CheckCircle2,
              border: 'border-status-success/30',
              bg: 'bg-surface-elevated/95',
              iconColor: 'text-status-success',
            },
            error: {
              icon: AlertCircle,
              border: 'border-status-error/30',
              bg: 'bg-surface-elevated/95',
              iconColor: 'text-status-error',
            },
            warning: {
              icon: AlertTriangle,
              border: 'border-status-warning/30',
              bg: 'bg-surface-elevated/95',
              iconColor: 'text-status-warning',
            },
            info: {
              icon: Info,
              border: 'border-accent/30',
              bg: 'bg-surface-elevated/95',
              iconColor: 'text-accent',
            },
          }[toast.type];

          const Icon = config.icon;

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border ${config.border} ${config.bg} shadow-elevated backdrop-blur-md`}
              role="alert"
              aria-live="polite"
            >
              <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${config.iconColor}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-text-primary">{toast.title}</p>
                {toast.message && (
                  <p className="text-xs text-text-secondary mt-0.5 break-words">{toast.message}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => onDismiss(toast.id)}
                className="text-text-secondary hover:text-text-primary p-1 rounded-md transition-colors focus-ring"
                aria-label="Dismiss notification"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </aside>
  );
};
