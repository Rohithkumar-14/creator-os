import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCreatorState } from './hooks/useCreatorState';
import { AppShell } from './components/layout/AppShell';
import { ToastContainer } from './components/common/Toast';
import { ConfirmDialog } from './components/common/ConfirmDialog';

// Views
import { DashboardView } from './components/dashboard/DashboardView';
import { ContentPlannerView } from './components/planner/ContentPlannerView';
import { CreatorDiaryView } from './components/diary/CreatorDiaryView';
import { TasksView } from './components/tasks/TasksView';
import { CalendarView } from './components/calendar/CalendarView';
import { SettingsView } from './components/settings/SettingsView';

// Modals and Drawers
import { ContentFormModal } from './components/planner/ContentFormModal';
import { TaskFormModal } from './components/tasks/TaskFormModal';
import { NoteFormModal } from './components/diary/NoteFormModal';
import { ContentDetailDrawer } from './components/planner/ContentDetailDrawer';

// Types
import { ContentItem, ContentStage, DiaryNote, TaskItem } from './types';

export function App() {
  const {
    state,
    activeTab,
    setActiveTab,
    toasts,
    dismissToast,
    metrics,
    addContent,
    updateContent,
    toggleChecklistItem,
    deleteContent,
    archiveContent,
    addTask,
    updateTask,
    toggleTaskCompletion,
    deleteTask,
    addNote,
    updateNote,
    deleteNote,
    updateSettings,
    exportData,
    importData,
    resetToSampleData,
    clearAllData,
  } = useCreatorState();

  // Mobile drawer state
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // Content Modals & Detail Drawer state
  const [contentModalOpen, setContentModalOpen] = useState(false);
  const [editingContent, setEditingContent] = useState<ContentItem | null>(null);
  const [contentDefaultStage, setContentDefaultStage] = useState<ContentStage | undefined>();
  const [contentDefaultDate, setContentDefaultDate] = useState<string | undefined>();
  const [selectedContentId, setSelectedContentId] = useState<string | null>(null);

  // Task Modal state
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskItem | null>(null);
  const [taskDefaultContentId, setTaskDefaultContentId] = useState<string | undefined>();
  const [taskDefaultDate, setTaskDefaultDate] = useState<string | undefined>();

  // Note Modal state
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<DiaryNote | null>(null);
  const [noteDefaultContentId, setNoteDefaultContentId] = useState<string | undefined>();

  // Generic Deletion Confirm Dialog state
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    type: 'content' | 'task' | 'note';
    id: string;
    title: string;
  }>({
    isOpen: false,
    type: 'content',
    id: '',
    title: '',
  });

  // Theme toggle helper
  const handleToggleTheme = () => {
    updateSettings({
      theme: state.settings.theme === 'dark' ? 'light' : 'dark',
    });
  };

  // Find currently open content item for detail drawer
  const selectedContent = state.content.find((c) => c.id === selectedContentId) || null;

  // Handlers for Content
  const handleOpenNewContent = (defaultStage?: ContentStage, defaultDate?: string) => {
    setEditingContent(null);
    setContentDefaultStage(defaultStage);
    setContentDefaultDate(defaultDate);
    setContentModalOpen(true);
  };

  const handleEditContent = (item: ContentItem) => {
    setEditingContent(item);
    setContentModalOpen(true);
  };

  const handleContentSubmit = (data: Omit<ContentItem, 'id' | 'createdAt' | 'isArchived'>) => {
    if (editingContent) {
      updateContent(editingContent.id, data);
    } else {
      addContent(data);
    }
  };

  const handleDeleteContentPrompt = (id: string) => {
    const item = state.content.find((c) => c.id === id);
    setDeleteConfirm({
      isOpen: true,
      type: 'content',
      id,
      title: item ? `Delete "${item.title}"?` : 'Delete Video Project?',
    });
  };

  // Handlers for Tasks
  const handleOpenNewTask = (contentId?: string, dueDate?: string) => {
    setEditingTask(null);
    setTaskDefaultContentId(contentId);
    setTaskDefaultDate(dueDate);
    setTaskModalOpen(true);
  };

  const handleEditTask = (task: TaskItem) => {
    setEditingTask(task);
    setTaskModalOpen(true);
  };

  const handleTaskSubmit = (data: Omit<TaskItem, 'id' | 'createdAt'>) => {
    if (editingTask) {
      updateTask(editingTask.id, data);
    } else {
      addTask(data);
    }
  };

  const handleDeleteTaskPrompt = (id: string) => {
    const task = state.tasks.find((t) => t.id === id);
    setDeleteConfirm({
      isOpen: true,
      type: 'task',
      id,
      title: task ? `Delete "${task.title}"?` : 'Delete Task?',
    });
  };

  // Handlers for Notes
  const handleOpenNewNote = (contentId?: string) => {
    setEditingNote(null);
    setNoteDefaultContentId(contentId);
    setNoteModalOpen(true);
  };

  const handleEditNote = (note: DiaryNote) => {
    setEditingNote(note);
    setNoteModalOpen(true);
  };

  const handleNoteSubmit = (data: Omit<DiaryNote, 'id' | 'createdAt'>) => {
    if (editingNote) {
      updateNote(editingNote.id, data);
    } else {
      addNote(data);
    }
  };

  const handleDeleteNotePrompt = (id: string) => {
    const note = state.notes.find((n) => n.id === id);
    setDeleteConfirm({
      isOpen: true,
      type: 'note',
      id,
      title: note ? `Delete "${note.title}"?` : 'Delete Note?',
    });
  };

  // Confirm delete execution
  const handleConfirmDelete = () => {
    if (deleteConfirm.type === 'content') {
      deleteContent(deleteConfirm.id);
      if (selectedContentId === deleteConfirm.id) {
        setSelectedContentId(null);
      }
    } else if (deleteConfirm.type === 'task') {
      deleteTask(deleteConfirm.id);
    } else if (deleteConfirm.type === 'note') {
      deleteNote(deleteConfirm.id);
    }
  };

  return (
    <AppShell
      activeTab={activeTab}
      onSelectTab={setActiveTab}
      theme={state.settings.theme}
      onToggleTheme={handleToggleTheme}
      pendingTasksCount={metrics.pendingTasksCount}
      inProductionCount={metrics.inProductionCount}
      isMobileDrawerOpen={isMobileDrawerOpen}
      onOpenMobileDrawer={() => setIsMobileDrawerOpen(true)}
      onCloseMobileDrawer={() => setIsMobileDrawerOpen(false)}
      onOpenNewContentModal={() => handleOpenNewContent()}
      onOpenNewTaskModal={() => handleOpenNewTask()}
      onOpenNewNoteModal={() => handleOpenNewNote()}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.15 }}
          className="h-full"
        >
          {activeTab === 'dashboard' && (
            <DashboardView
              content={state.content}
              tasks={state.tasks}
              notes={state.notes}
              metrics={metrics}
              onNavigate={setActiveTab}
              onSelectContent={(item) => setSelectedContentId(item.id)}
              onToggleTask={toggleTaskCompletion}
              onOpenNewContent={() => handleOpenNewContent()}
              onOpenNewTask={() => handleOpenNewTask()}
              onOpenNewNote={() => handleOpenNewNote()}
            />
          )}

          {activeTab === 'planner' && (
            <ContentPlannerView
              content={state.content}
              onSelect={(item) => setSelectedContentId(item.id)}
              onEdit={handleEditContent}
              onArchive={archiveContent}
              onDelete={handleDeleteContentPrompt}
              onUpdateStage={(id, stage) => updateContent(id, { stage })}
              onOpenNewModal={handleOpenNewContent}
            />
          )}

          {activeTab === 'diary' && (
            <CreatorDiaryView
              notes={state.notes}
              contentList={state.content}
              onAddNote={addNote}
              onEditNote={handleEditNote}
              onDeleteNote={handleDeleteNotePrompt}
              onOpenNewModal={() => handleOpenNewNote()}
            />
          )}

          {activeTab === 'tasks' && (
            <TasksView
              tasks={state.tasks}
              contentList={state.content}
              onToggleTask={toggleTaskCompletion}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTaskPrompt}
              onOpenNewModal={() => handleOpenNewTask()}
              onSelectContent={(item) => setSelectedContentId(item.id)}
            />
          )}

          {activeTab === 'calendar' && (
            <CalendarView
              content={state.content}
              tasks={state.tasks}
              onSelectContent={(item) => setSelectedContentId(item.id)}
              onToggleTask={toggleTaskCompletion}
              onOpenNewContentWithDate={(dateStr) => handleOpenNewContent(undefined, dateStr)}
              onOpenNewTaskWithDate={(dateStr) => handleOpenNewTask(undefined, dateStr)}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              state={state}
              onUpdateSettings={updateSettings}
              onExportData={exportData}
              onImportData={importData}
              onResetToSample={resetToSampleData}
              onClearAll={clearAllData}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Global Content Creation / Edit Modal */}
      <ContentFormModal
        isOpen={contentModalOpen}
        onClose={() => {
          setContentModalOpen(false);
          setEditingContent(null);
          setContentDefaultStage(undefined);
          setContentDefaultDate(undefined);
        }}
        onSubmit={handleContentSubmit}
        initialData={editingContent}
        defaultStage={contentDefaultStage}
        defaultDueDate={contentDefaultDate}
      />

      {/* Global Task Creation / Edit Modal */}
      <TaskFormModal
        isOpen={taskModalOpen}
        onClose={() => {
          setTaskModalOpen(false);
          setEditingTask(null);
          setTaskDefaultContentId(undefined);
          setTaskDefaultDate(undefined);
        }}
        onSubmit={handleTaskSubmit}
        contentList={state.content.filter((c) => !c.isArchived)}
        initialData={editingTask}
        defaultContentId={taskDefaultContentId}
        defaultDueDate={taskDefaultDate}
      />

      {/* Global Note Creation / Edit Modal */}
      <NoteFormModal
        isOpen={noteModalOpen}
        onClose={() => {
          setNoteModalOpen(false);
          setEditingNote(null);
          setNoteDefaultContentId(undefined);
        }}
        onSubmit={handleNoteSubmit}
        contentList={state.content.filter((c) => !c.isArchived)}
        initialData={editingNote}
        defaultContentId={noteDefaultContentId}
      />

      {/* Content Detail Drawer */}
      <ContentDetailDrawer
        content={selectedContent}
        isOpen={Boolean(selectedContent)}
        onClose={() => setSelectedContentId(null)}
        onEdit={(item) => {
          setSelectedContentId(null);
          handleEditContent(item);
        }}
        onDelete={(id) => {
          handleDeleteContentPrompt(id);
        }}
        onArchive={archiveContent}
        onToggleChecklist={toggleChecklistItem}
        onUpdateStage={(id, stage) => updateContent(id, { stage })}
        relatedTasks={selectedContent ? state.tasks.filter((t) => t.contentId === selectedContent.id) : []}
        relatedNotes={selectedContent ? state.notes.filter((n) => n.contentId === selectedContent.id) : []}
        onToggleTask={toggleTaskCompletion}
        onAddTask={(contentId) => handleOpenNewTask(contentId)}
        onAddNote={(contentId) => handleOpenNewNote(contentId)}
      />

      {/* Destructive Action Confirm Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={handleConfirmDelete}
        title={deleteConfirm.title}
        message="Are you sure you want to permanently delete this item? This action cannot be undone."
        confirmLabel="Delete Permanently"
        isDestructive={true}
      />

      {/* Floating Notification Toasts */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </AppShell>
  );
}

export default App;
