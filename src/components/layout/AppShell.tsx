import React from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { MobileDrawer } from './MobileDrawer';
import { NavigationTab, UserSettings } from '../../types';

interface AppShellProps {
  activeTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  theme: UserSettings['theme'];
  onToggleTheme: () => void;
  pendingTasksCount: number;
  inProductionCount: number;
  isMobileDrawerOpen: boolean;
  onOpenMobileDrawer: () => void;
  onCloseMobileDrawer: () => void;
  onOpenNewContentModal: () => void;
  onOpenNewTaskModal: () => void;
  onOpenNewNoteModal: () => void;
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({
  activeTab,
  onSelectTab,
  theme,
  onToggleTheme,
  pendingTasksCount,
  inProductionCount,
  isMobileDrawerOpen,
  onOpenMobileDrawer,
  onCloseMobileDrawer,
  onOpenNewContentModal,
  onOpenNewTaskModal,
  onOpenNewNoteModal,
  children,
}) => {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-text-primary">
      {/* Desktop Collapsible Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={onSelectTab}
        pendingTasksCount={pendingTasksCount}
        inProductionCount={inProductionCount}
      />

      {/* Mobile Navigation Drawer */}
      <MobileDrawer
        isOpen={isMobileDrawerOpen}
        onClose={onCloseMobileDrawer}
        activeTab={activeTab}
        onSelectTab={onSelectTab}
        pendingTasksCount={pendingTasksCount}
        inProductionCount={inProductionCount}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Sticky Topbar */}
        <Topbar
          activeTab={activeTab}
          theme={theme}
          onToggleTheme={onToggleTheme}
          onOpenMobileMenu={onOpenMobileDrawer}
          onOpenNewContentModal={onOpenNewContentModal}
          onOpenNewTaskModal={onOpenNewTaskModal}
          onOpenNewNoteModal={onOpenNewNoteModal}
        />

        {/* Dynamic View Scroll Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};
