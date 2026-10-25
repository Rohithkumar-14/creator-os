export type Platform = 'youtube' | 'instagram';

export type ContentStage =
  | 'idea'
  | 'research'
  | 'scripting'
  | 'recording'
  | 'editing'
  | 'published';

export type TaskPriority =
  | 'low'
  | 'medium'
  | 'high'
  | 'urgent';

export interface ProductionChecklist {
  research: boolean;
  scripting: boolean;
  recording: boolean;
  editing: boolean;
  thumbnails: boolean;
  captions: boolean;
  published: boolean;
}

export interface ContentItem {
  id: string;
  title: string;
  platform: Platform;
  stage: ContentStage;
  dueDate: string; // YYYY-MM-DD
  publishDate?: string; // YYYY-MM-DD
  tags: string[];
  scriptNotes?: string;
  researchLinks?: string[];
  checklist: ProductionChecklist;
  isArchived: boolean;
  createdAt: string; // ISO date string
  updatedAt?: string;
}

export interface TaskItem {
  id: string;
  contentId?: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  dueDate: string; // YYYY-MM-DD
  completed: boolean;
  createdAt: string;
}

export type NoteType = 'idea' | 'hook' | 'script' | 'research';

export interface DiaryNote {
  id: string;
  title: string;
  content: string;
  tags: string[];
  type: NoteType;
  contentId?: string;
  createdAt: string;
}

export interface UserSettings {
  theme: 'dark' | 'light';
  notificationsEnabled: boolean;
  defaultPlatform: Platform;
  compactView?: boolean;
}

export type NavigationTab = 
  | 'dashboard'
  | 'planner'
  | 'diary'
  | 'tasks'
  | 'calendar'
  | 'settings';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

export interface AppStateData {
  version: number;
  content: ContentItem[];
  tasks: TaskItem[];
  notes: DiaryNote[];
  settings: UserSettings;
}
