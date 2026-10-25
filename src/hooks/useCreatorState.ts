import { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  AppStateData, 
  ContentItem, 
  DiaryNote, 
  NavigationTab, 
  ProductionChecklist, 
  TaskItem, 
  ToastMessage, 
  UserSettings 
} from '../types';
import { 
  loadStateFromStorage, 
  saveStateToStorage, 
  validateStateData, 
  exportStateToJsonFile 
} from '../utils/storage';
import { createInitialSeedData } from '../utils/seedData';

export function useCreatorState() {
  const [state, setState] = useState<AppStateData>(() => loadStateFromStorage());
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [activeTab, setActiveTabState] = useState<NavigationTab>(() => {
    const hash = window.location.hash.replace('#', '') as NavigationTab;
    const validTabs: NavigationTab[] = ['dashboard', 'planner', 'diary', 'tasks', 'calendar', 'settings'];
    return validTabs.includes(hash) ? hash : 'dashboard';
  });

  // Keep window hash synchronized with activeTab
  const setActiveTab = useCallback((tab: NavigationTab) => {
    setActiveTabState(tab);
    window.location.hash = tab;
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') as NavigationTab;
      const validTabs: NavigationTab[] = ['dashboard', 'planner', 'diary', 'tasks', 'calendar', 'settings'];
      if (validTabs.includes(hash)) {
        setActiveTabState(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Synchronize theme with DOM classList
  useEffect(() => {
    const root = document.documentElement;
    if (state.settings.theme === 'light') {
      root.classList.remove('dark');
      root.classList.add('light');
    } else {
      root.classList.remove('light');
      root.classList.add('dark');
    }
  }, [state.settings.theme]);

  // Toast Management
  const addToast = useCallback((type: ToastMessage['type'], title: string, message?: string, duration: number = 4000) => {
    const id = 'toast-' + Math.random().toString(36).substring(2, 9);
    const newToast: ToastMessage = { id, type, title, message, duration };
    setToasts(prev => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, duration);
    }
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Persist state changes to storage
  const persist = useCallback((nextState: AppStateData) => {
    setState(nextState);
    const result = saveStateToStorage(nextState);
    if (!result.success) {
      addToast('error', 'Storage Warning', result.error || 'Failed to save changes to browser storage.');
    }
  }, [addToast]);

  // Content Actions
  const addContent = useCallback((item: Omit<ContentItem, 'id' | 'createdAt' | 'isArchived'>) => {
    const id = 'c-' + Date.now().toString(36);
    const newItem: ContentItem = {
      ...item,
      id,
      isArchived: false,
      createdAt: new Date().toISOString(),
    };
    persist({
      ...state,
      content: [newItem, ...state.content],
    });
    addToast('success', 'Content Created', `"${newItem.title}" added to your workspace.`);
    return newItem;
  }, [state, persist, addToast]);

  const updateContent = useCallback((id: string, updates: Partial<ContentItem>) => {
    const item = state.content.find(c => c.id === id);
    if (!item) return;

    const updatedList = state.content.map(c => {
      if (c.id === id) {
        return {
          ...c,
          ...updates,
          updatedAt: new Date().toISOString(),
        };
      }
      return c;
    });

    persist({
      ...state,
      content: updatedList,
    });
    addToast('info', 'Content Updated', `Changes to "${item.title}" saved.`);
  }, [state, persist, addToast]);

  const toggleChecklistItem = useCallback((contentId: string, itemKey: keyof ProductionChecklist) => {
    const updatedContent = state.content.map(item => {
      if (item.id === contentId) {
        const nextChecklist = {
          ...item.checklist,
          [itemKey]: !item.checklist[itemKey],
        };

        // If published is ticked, optionally update stage to published if not already
        let nextStage = item.stage;
        if (itemKey === 'published' && nextChecklist.published && item.stage !== 'published') {
          nextStage = 'published';
        }

        return {
          ...item,
          stage: nextStage,
          checklist: nextChecklist,
          updatedAt: new Date().toISOString(),
        };
      }
      return item;
    });

    persist({
      ...state,
      content: updatedContent,
    });
  }, [state, persist]);

  const deleteContent = useCallback((id: string) => {
    const item = state.content.find(c => c.id === id);
    if (!item) return;

    persist({
      ...state,
      content: state.content.filter(c => c.id !== id),
      // Clean up linked tasks and notes if orphaned
      tasks: state.tasks.filter(t => t.contentId !== id),
    });
    addToast('warning', 'Content Deleted', `"${item.title}" was deleted.`);
  }, [state, persist, addToast]);

  const archiveContent = useCallback((id: string, archive: boolean = true) => {
    const item = state.content.find(c => c.id === id);
    if (!item) return;

    persist({
      ...state,
      content: state.content.map(c => c.id === id ? { ...c, isArchived: archive } : c),
    });
    addToast('info', archive ? 'Content Archived' : 'Content Restored', `"${item.title}" has been ${archive ? 'archived' : 'restored'}.`);
  }, [state, persist, addToast]);

  // Task Actions
  const addTask = useCallback((task: Omit<TaskItem, 'id' | 'createdAt'>) => {
    const id = 't-' + Date.now().toString(36);
    const newTask: TaskItem = {
      ...task,
      id,
      createdAt: new Date().toISOString(),
    };
    persist({
      ...state,
      tasks: [newTask, ...state.tasks],
    });
    addToast('success', 'Task Added', `"${newTask.title}" added.`);
    return newTask;
  }, [state, persist, addToast]);

  const updateTask = useCallback((id: string, updates: Partial<TaskItem>) => {
    persist({
      ...state,
      tasks: state.tasks.map(t => t.id === id ? { ...t, ...updates } : t),
    });
    addToast('info', 'Task Updated', 'Task details saved.');
  }, [state, persist, addToast]);

  const toggleTaskCompletion = useCallback((id: string) => {
    let completedState = false;
    const updated = state.tasks.map(t => {
      if (t.id === id) {
        completedState = !t.completed;
        return { ...t, completed: completedState };
      }
      return t;
    });

    persist({
      ...state,
      tasks: updated,
    });

    if (completedState) {
      addToast('success', 'Task Completed', 'Nicely done! One step closer to publishing.');
    }
  }, [state, persist, addToast]);

  const deleteTask = useCallback((id: string) => {
    persist({
      ...state,
      tasks: state.tasks.filter(t => t.id !== id),
    });
    addToast('warning', 'Task Removed', 'Task has been deleted.');
  }, [state, persist, addToast]);

  // Diary Note Actions
  const addNote = useCallback((note: Omit<DiaryNote, 'id' | 'createdAt'>) => {
    const id = 'n-' + Date.now().toString(36);
    const newNote: DiaryNote = {
      ...note,
      id,
      createdAt: new Date().toISOString(),
    };
    persist({
      ...state,
      notes: [newNote, ...state.notes],
    });
    addToast('success', 'Idea Captured', `"${newNote.title}" saved to Diary.`);
    return newNote;
  }, [state, persist, addToast]);

  const updateNote = useCallback((id: string, updates: Partial<DiaryNote>) => {
    persist({
      ...state,
      notes: state.notes.map(n => n.id === id ? { ...n, ...updates } : n),
    });
    addToast('info', 'Note Updated', 'Your changes have been saved.');
  }, [state, persist, addToast]);

  const deleteNote = useCallback((id: string) => {
    persist({
      ...state,
      notes: state.notes.filter(n => n.id !== id),
    });
    addToast('warning', 'Note Deleted', 'Note removed from your diary.');
  }, [state, persist, addToast]);

  // Settings Actions
  const updateSettings = useCallback((updates: Partial<UserSettings>) => {
    const nextSettings: UserSettings = {
      ...state.settings,
      ...updates,
    };
    persist({
      ...state,
      settings: nextSettings,
    });
    addToast('success', 'Settings Saved', 'Preferences updated successfully.');
  }, [state, persist, addToast]);

  // Export State
  const exportData = useCallback(() => {
    const success = exportStateToJsonFile(state);
    if (success) {
      addToast('success', 'Backup Exported', 'Downloaded creator-os-backup.json');
    } else {
      addToast('error', 'Export Failed', 'Unable to generate JSON backup file.');
    }
  }, [state, addToast]);

  // Import State with deep validation
  const importData = useCallback((jsonString: string): { success: boolean; error?: string } => {
    try {
      const parsed = JSON.parse(jsonString);
      const validation = validateStateData(parsed);

      if (!validation.isValid || !validation.cleanData) {
        addToast('error', 'Import Failed', validation.error || 'Backup file is corrupted or unsupported.');
        return { success: false, error: validation.error };
      }

      persist(validation.cleanData);
      addToast('success', 'Workspace Restored', `Imported ${validation.cleanData.content.length} content items, ${validation.cleanData.tasks.length} tasks, and ${validation.cleanData.notes.length} notes.`);
      return { success: true };
    } catch {
      const errorMsg = 'Invalid JSON file format. Please check the file.';
      addToast('error', 'Import Error', errorMsg);
      return { success: false, error: errorMsg };
    }
  }, [persist, addToast]);

  // Reset to sample data
  const resetToSampleData = useCallback(() => {
    const initial = createInitialSeedData();
    persist(initial);
    addToast('info', 'Sample Data Restored', 'Workspace reset to original sample data.');
  }, [persist, addToast]);

  // Clear all workspace data
  const clearAllData = useCallback(() => {
    const emptyState: AppStateData = {
      version: 1,
      content: [],
      tasks: [],
      notes: [],
      settings: state.settings,
    };
    persist(emptyState);
    addToast('warning', 'Workspace Cleared', 'All local content, tasks, and notes were cleared.');
  }, [state.settings, persist, addToast]);

  // Derived metrics for UI widgets
  const metrics = useMemo(() => {
    const activeContent = state.content.filter(c => !c.isArchived);
    const publishedCount = activeContent.filter(c => c.stage === 'published').length;
    const pendingTasks = state.tasks.filter(t => !t.completed);
    const urgentTasks = pendingTasks.filter(t => t.priority === 'urgent' || t.priority === 'high');
    
    // Calculate stage distribution
    const stageBreakdown: Record<string, number> = {
      idea: 0,
      research: 0,
      scripting: 0,
      recording: 0,
      editing: 0,
      published: 0,
    };

    activeContent.forEach(item => {
      stageBreakdown[item.stage] = (stageBreakdown[item.stage] || 0) + 1;
    });

    return {
      totalContent: activeContent.length,
      publishedCount,
      inProductionCount: activeContent.length - publishedCount,
      pendingTasksCount: pendingTasks.length,
      urgentTasksCount: urgentTasks.length,
      savedIdeasCount: state.notes.length,
      stageBreakdown,
    };
  }, [state.content, state.tasks, state.notes]);

  return {
    state,
    activeTab,
    setActiveTab,
    toasts,
    addToast,
    dismissToast,
    metrics,
    // Content CRUD
    addContent,
    updateContent,
    toggleChecklistItem,
    deleteContent,
    archiveContent,
    // Task CRUD
    addTask,
    updateTask,
    toggleTaskCompletion,
    deleteTask,
    // Notes CRUD
    addNote,
    updateNote,
    deleteNote,
    // Settings & State maintenance
    updateSettings,
    exportData,
    importData,
    resetToSampleData,
    clearAllData,
  };
}

export type CreatorStateHook = ReturnType<typeof useCreatorState>;
