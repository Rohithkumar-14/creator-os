import { AppStateData, ContentItem, DiaryNote, TaskItem, UserSettings } from '../types';
import { createInitialSeedData } from './seedData';

export const STORAGE_KEY = 'creator_os_state_v1';

export interface StorageOperationResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface StorageStats {
  usedBytes: number;
  totalItems: {
    content: number;
    tasks: number;
    notes: number;
  };
  storageSupported: boolean;
}

/**
 * Check if localStorage is available and writable
 */
export function isStorageAvailable(): boolean {
  try {
    const testKey = '__creator_os_test__';
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

/**
 * Deep validation for imported or stored state
 */
export function validateStateData(data: unknown): { isValid: boolean; error?: string; cleanData?: AppStateData } {
  if (!data || typeof data !== 'object') {
    return { isValid: false, error: 'Backup data must be a valid JSON object.' };
  }

  const candidate = data as Partial<AppStateData>;

  if (!Array.isArray(candidate.content)) {
    return { isValid: false, error: 'Backup is missing a valid "content" list.' };
  }

  if (!Array.isArray(candidate.tasks)) {
    return { isValid: false, error: 'Backup is missing a valid "tasks" list.' };
  }

  if (!Array.isArray(candidate.notes)) {
    return { isValid: false, error: 'Backup is missing a valid "notes" list.' };
  }

  // Validate content item structures safely
  const validatedContent: ContentItem[] = [];
  for (const item of candidate.content) {
    if (!item || typeof item !== 'object' || typeof item.id !== 'string' || typeof item.title !== 'string') {
      return { isValid: false, error: 'One or more content items have an invalid structure.' };
    }
    const platform = (item.platform === 'instagram' ? 'instagram' : 'youtube');
    const validStages = ['idea', 'research', 'scripting', 'recording', 'editing', 'published'];
    const stage = validStages.includes(item.stage) ? item.stage : 'idea';
    
    const checklist = item.checklist && typeof item.checklist === 'object' ? {
      research: Boolean(item.checklist.research),
      scripting: Boolean(item.checklist.scripting),
      recording: Boolean(item.checklist.recording),
      editing: Boolean(item.checklist.editing),
      thumbnails: Boolean(item.checklist.thumbnails),
      captions: Boolean(item.checklist.captions),
      published: Boolean(item.checklist.published),
    } : {
      research: false,
      scripting: false,
      recording: false,
      editing: false,
      thumbnails: false,
      captions: false,
      published: false,
    };

    validatedContent.push({
      id: item.id,
      title: item.title.trim() || 'Untitled Content',
      platform,
      stage,
      dueDate: typeof item.dueDate === 'string' ? item.dueDate : '',
      publishDate: typeof item.publishDate === 'string' ? item.publishDate : undefined,
      tags: Array.isArray(item.tags) ? item.tags.map(t => String(t)) : [],
      scriptNotes: typeof item.scriptNotes === 'string' ? item.scriptNotes : '',
      researchLinks: Array.isArray(item.researchLinks) ? item.researchLinks.map(l => String(l)) : [],
      checklist,
      isArchived: Boolean(item.isArchived),
      createdAt: typeof item.createdAt === 'string' ? item.createdAt : new Date().toISOString(),
      updatedAt: typeof item.updatedAt === 'string' ? item.updatedAt : undefined,
    });
  }

  // Validate tasks
  const validatedTasks: TaskItem[] = [];
  for (const t of candidate.tasks) {
    if (!t || typeof t !== 'object' || typeof t.id !== 'string' || typeof t.title !== 'string') {
      return { isValid: false, error: 'One or more tasks have an invalid structure.' };
    }
    const validPriorities = ['low', 'medium', 'high', 'urgent'];
    const priority = validPriorities.includes(t.priority) ? t.priority : 'medium';
    validatedTasks.push({
      id: t.id,
      contentId: typeof t.contentId === 'string' ? t.contentId : undefined,
      title: t.title.trim() || 'Untitled Task',
      description: typeof t.description === 'string' ? t.description : '',
      priority,
      dueDate: typeof t.dueDate === 'string' ? t.dueDate : '',
      completed: Boolean(t.completed),
      createdAt: typeof t.createdAt === 'string' ? t.createdAt : new Date().toISOString(),
    });
  }

  // Validate notes
  const validatedNotes: DiaryNote[] = [];
  for (const n of candidate.notes) {
    if (!n || typeof n !== 'object' || typeof n.id !== 'string' || typeof n.title !== 'string') {
      return { isValid: false, error: 'One or more diary notes have an invalid structure.' };
    }
    const validTypes = ['idea', 'hook', 'script', 'research'];
    const type = validTypes.includes(n.type) ? n.type : 'idea';
    validatedNotes.push({
      id: n.id,
      title: n.title.trim() || 'Untitled Note',
      content: typeof n.content === 'string' ? n.content : '',
      tags: Array.isArray(n.tags) ? n.tags.map(tag => String(tag)) : [],
      type,
      contentId: typeof n.contentId === 'string' ? n.contentId : undefined,
      createdAt: typeof n.createdAt === 'string' ? n.createdAt : new Date().toISOString(),
    });
  }

  // Validate settings
  const settings: UserSettings = {
    theme: candidate.settings?.theme === 'light' ? 'light' : 'dark',
    notificationsEnabled: candidate.settings?.notificationsEnabled ?? true,
    defaultPlatform: candidate.settings?.defaultPlatform === 'instagram' ? 'instagram' : 'youtube',
    compactView: Boolean(candidate.settings?.compactView),
  };

  return {
    isValid: true,
    cleanData: {
      version: 1,
      content: validatedContent,
      tasks: validatedTasks,
      notes: validatedNotes,
      settings,
    },
  };
}

/**
 * Load state from localStorage with safe fallback to initial seed
 */
export function loadStateFromStorage(): AppStateData {
  if (!isStorageAvailable()) {
    return createInitialSeedData();
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = createInitialSeedData();
      saveStateToStorage(initial);
      return initial;
    }

    const parsed = JSON.parse(raw);
    const validation = validateStateData(parsed);
    if (validation.isValid && validation.cleanData) {
      return validation.cleanData;
    } else {
      console.warn('Invalid data found in storage, repairing with initial seed:', validation.error);
      const initial = createInitialSeedData();
      saveStateToStorage(initial);
      return initial;
    }
  } catch (err) {
    console.error('Failed to parse localStorage state:', err);
    return createInitialSeedData();
  }
}

/**
 * Save state to localStorage with quota error handling
 */
export function saveStateToStorage(data: AppStateData): StorageOperationResult<AppStateData> {
  if (!isStorageAvailable()) {
    return { success: false, error: 'Browser storage is unavailable in this environment.' };
  }

  try {
    const serialized = JSON.stringify(data);
    window.localStorage.setItem(STORAGE_KEY, serialized);
    return { success: true, data };
  } catch (err: unknown) {
    let message = 'Failed to save to local storage.';
    if (err instanceof DOMException && (err.name === 'QuotaExceededError' || err.code === 22)) {
      message = 'Browser storage quota exceeded. Please free up space by archiving or deleting items.';
    }
    return { success: false, error: message };
  }
}

/**
 * Export state as JSON file download
 */
export function exportStateToJsonFile(state: AppStateData): boolean {
  try {
    const exportData = {
      exportDate: new Date().toISOString(),
      appName: 'Creator OS',
      ...state,
    };
    const jsonStr = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `creator-os-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    return true;
  } catch (err) {
    console.error('Failed to export state JSON:', err);
    return false;
  }
}

/**
 * Calculate approximate storage footprint
 */
export function getStorageStats(state: AppStateData): StorageStats {
  const supported = isStorageAvailable();
  let usedBytes = 0;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      usedBytes = new Blob([raw]).size;
    } else {
      usedBytes = new Blob([JSON.stringify(state)]).size;
    }
  } catch {
    usedBytes = 0;
  }

  return {
    usedBytes,
    totalItems: {
      content: state.content.length,
      tasks: state.tasks.length,
      notes: state.notes.length,
    },
    storageSupported: supported,
  };
}
