import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  LayoutDashboard, 
  Film, 
  BookOpen, 
  CheckSquare, 
  Calendar, 
  Settings, 
  Clapperboard 
} from 'lucide-react';
import { NavigationTab } from '../../types';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  pendingTasksCount: number;
  inProductionCount: number;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({
  isOpen,
  onClose,
  activeTab,
  onSelectTab,
  pendingTasksCount,
  inProductionCount,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const navItems = [
    { id: 'dashboard' as NavigationTab, label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'planner' as NavigationTab, label: 'Content Planner', icon: Film, badge: inProductionCount > 0 ? inProductionCount : null },
    { id: 'diary' as NavigationTab, label: 'Creator Diary', icon: BookOpen, badge: null },
    { id: 'tasks' as NavigationTab, label: 'Tasks', icon: CheckSquare, badge: pendingTasksCount > 0 ? pendingTasksCount : null },
    { id: 'calendar' as NavigationTab, label: 'Calendar', icon: Calendar, badge: null },
    { id: 'settings' as NavigationTab, label: 'Settings', icon: Settings, badge: null },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Drawer Menu */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-4/5 max-w-xs bg-surface border-r border-border h-full flex flex-col p-4 shadow-elevated z-10"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-accent to-purple-400 flex items-center justify-center text-white">
                  <Clapperboard className="w-4 h-4" />
                </div>
                <span className="font-bold text-text-primary text-base">Creator OS</span>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="text-text-secondary hover:text-text-primary p-1.5 rounded-lg hover:bg-surface-elevated focus-ring"
                aria-label="Close navigation menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation links */}
            <nav className="flex-1 py-4 space-y-1.5 overflow-y-auto">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelectTab(item.id);
                      onClose();
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-colors ${
                      isActive
                        ? 'bg-accent text-white font-semibold shadow-sm'
                        : 'text-text-secondary hover:text-text-primary hover:bg-surface-elevated'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </div>

                    {item.badge !== null && (
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          isActive ? 'bg-white/20 text-white' : 'bg-surface-muted text-text-secondary border border-border'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Footer note */}
            <div className="pt-3 border-t border-border text-center">
              <p className="text-xs text-text-muted">Creator OS v1.0 • Offline Ready</p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
