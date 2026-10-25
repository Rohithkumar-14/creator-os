import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Film, 
  BookOpen, 
  CheckSquare, 
  Calendar, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  Sparkles,
  Clapperboard
} from 'lucide-react';
import { NavigationTab } from '../../types';

interface SidebarProps {
  activeTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  pendingTasksCount: number;
  inProductionCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  pendingTasksCount,
  inProductionCount,
}) => {
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    {
      id: 'dashboard' as NavigationTab,
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'planner' as NavigationTab,
      label: 'Content Planner',
      icon: Film,
      badge: inProductionCount > 0 ? inProductionCount : null,
    },
    {
      id: 'diary' as NavigationTab,
      label: 'Creator Diary',
      icon: BookOpen,
      badge: null,
    },
    {
      id: 'tasks' as NavigationTab,
      label: 'Task Manager',
      icon: CheckSquare,
      badge: pendingTasksCount > 0 ? pendingTasksCount : null,
    },
    {
      id: 'calendar' as NavigationTab,
      label: 'Calendar',
      icon: Calendar,
      badge: null,
    },
    {
      id: 'settings' as NavigationTab,
      label: 'Settings',
      icon: Settings,
      badge: null,
    },
  ];

  return (
    <aside
      className={`hidden md:flex flex-col bg-surface border-r border-border transition-all duration-300 relative select-none ${
        collapsed ? 'w-20' : 'w-64'
      }`}
      aria-label="Sidebar Navigation"
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-border">
        {!collapsed ? (
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-accent to-purple-400 flex items-center justify-center text-white shadow-glow flex-shrink-0">
              <Clapperboard className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-text-primary text-base tracking-tight">Creator OS</span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-accent/15 text-accent border border-accent/25">
                  Pro
                </span>
              </div>
              <span className="text-[11px] text-text-muted truncate">YouTube & Reels Studio</span>
            </div>
          </div>
        ) : (
          <div className="mx-auto w-9 h-9 rounded-xl bg-gradient-to-tr from-accent to-purple-400 flex items-center justify-center text-white shadow-glow">
            <Clapperboard className="w-5 h-5" />
          </div>
        )}

        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="text-text-secondary hover:text-text-primary p-1.5 rounded-lg hover:bg-surface-elevated transition-colors focus-ring"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Nav List */}
      <nav className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 group relative focus-ring ${
                isActive
                  ? 'bg-accent text-white shadow-md shadow-accent/20 font-semibold'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface-elevated'
              } ${collapsed ? 'justify-center px-0' : ''}`}
              title={collapsed ? item.label : undefined}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-105 ${isActive ? 'text-white' : 'text-text-secondary group-hover:text-text-primary'}`} />
              
              {!collapsed && (
                <span className="truncate text-left flex-1">{item.label}</span>
              )}

              {!collapsed && item.badge !== null && (
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-white/20 text-white' : 'bg-surface-muted text-text-secondary border border-border'
                  }`}
                >
                  {item.badge}
                </span>
              )}

              {collapsed && item.badge !== null && (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-accent" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Creator Card */}
      {!collapsed ? (
        <div className="p-3 border-t border-border m-3 rounded-xl bg-surface-elevated/60 border border-border">
          <div className="flex items-center gap-2 mb-1.5">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-xs font-semibold text-text-primary">Solo Focus Mode</span>
          </div>
          <p className="text-[11px] text-text-secondary leading-snug">
            All data stored locally in your browser. Zero cloud tracking.
          </p>
        </div>
      ) : null}
    </aside>
  );
};
