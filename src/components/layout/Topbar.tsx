import React from 'react';
import { 
  Menu, 
  Sun, 
  Moon, 
  Plus, 
  CheckSquare, 
  Sparkles 
} from 'lucide-react';
import { NavigationTab, UserSettings } from '../../types';
import { Button } from '../common/Button';

interface TopbarProps {
  activeTab: NavigationTab;
  theme: UserSettings['theme'];
  onToggleTheme: () => void;
  onOpenMobileMenu: () => void;
  onOpenNewContentModal: () => void;
  onOpenNewTaskModal: () => void;
  onOpenNewNoteModal: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  activeTab,
  theme,
  onToggleTheme,
  onOpenMobileMenu,
  onOpenNewContentModal,
  onOpenNewTaskModal,
  onOpenNewNoteModal,
}) => {
  const titles: Record<NavigationTab, { title: string; subtitle: string }> = {
    dashboard: {
      title: 'Studio Dashboard',
      subtitle: 'Overview of your pipeline, deadlines, and publishing schedule',
    },
    planner: {
      title: 'Content Planner',
      subtitle: 'Kanban & table views for YouTube videos and Instagram Reels',
    },
    diary: {
      title: 'Creator Diary & Idea Vault',
      subtitle: 'Hooks, video ideas, script snippets, and research notes',
    },
    tasks: {
      title: 'Production Tasks',
      subtitle: 'To-dos organized by priority, deadlines, and video links',
    },
    calendar: {
      title: 'Publishing Calendar',
      subtitle: 'Monthly visual schedule of release dates and production milestones',
    },
    settings: {
      title: 'Settings & Storage',
      subtitle: 'Preferences, backups, import/export, and local data safety',
    },
  };

  const current = titles[activeTab] || titles.dashboard;

  return (
    <header className="h-16 bg-surface border-b border-border px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20 backdrop-blur-md">
      {/* Left: Mobile hamburger & Page Title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="md:hidden text-text-secondary hover:text-text-primary p-2 rounded-lg hover:bg-surface-elevated focus-ring"
          aria-label="Open mobile navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-base sm:text-lg font-bold text-text-primary tracking-tight leading-tight">
            {current.title}
          </h1>
          <p className="text-xs text-text-muted hidden sm:block truncate">
            {current.subtitle}
          </p>
        </div>
      </div>

      {/* Right: Quick Action CTAs & Theme Toggle */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* Quick action buttons */}
        <div className="hidden lg:flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            icon={Sparkles}
            onClick={onOpenNewNoteModal}
            className="text-xs"
          >
            Idea
          </Button>
          <Button
            variant="outline"
            size="sm"
            icon={CheckSquare}
            onClick={onOpenNewTaskModal}
            className="text-xs"
          >
            Task
          </Button>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={Plus}
          onClick={onOpenNewContentModal}
          className="shadow-glow"
        >
          <span className="hidden sm:inline">New Content</span>
          <span className="sm:hidden">New</span>
        </Button>

        {/* Theme Toggle Button */}
        <button
          type="button"
          onClick={onToggleTheme}
          className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-elevated transition-colors border border-border focus-ring"
          title={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-accent" />
          )}
        </button>
      </div>
    </header>
  );
};
