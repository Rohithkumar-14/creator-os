import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { TaskItem, TaskPriority, ContentItem } from '../../types';
import { getTodayString } from '../../utils/date';

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<TaskItem, 'id' | 'createdAt'>) => void;
  contentList: ContentItem[];
  initialData?: TaskItem | null;
  defaultContentId?: string;
  defaultDueDate?: string;
}

interface TaskFormProps {
  onClose: () => void;
  onSubmit: (data: Omit<TaskItem, 'id' | 'createdAt'>) => void;
  contentList: ContentItem[];
  initialData?: TaskItem | null;
  defaultContentId?: string;
  defaultDueDate?: string;
}

const TaskForm: React.FC<TaskFormProps> = ({
  onClose,
  onSubmit,
  contentList,
  initialData,
  defaultContentId,
  defaultDueDate,
}) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [priority, setPriority] = useState<TaskPriority>(initialData?.priority || 'medium');
  const [dueDate, setDueDate] = useState(initialData?.dueDate || defaultDueDate || getTodayString());
  const [contentId, setContentId] = useState<string>(initialData?.contentId || defaultContentId || '');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Task title is required.');
      return;
    }

    onSubmit({
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      dueDate: dueDate || getTodayString(),
      completed: initialData ? initialData.completed : false,
      contentId: contentId || undefined,
    });

    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-2.5 rounded-lg bg-status-error/15 border border-status-error/30 text-status-error text-xs font-medium">
          {error}
        </div>
      )}

      {/* Task Title */}
      <div>
        <label className="block text-xs font-semibold text-text-primary mb-1">
          Task Title <span className="text-status-error">*</span>
        </label>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (error) setError(null);
          }}
          placeholder="e.g. Export 4K master file and render captions"
          className="w-full px-3.5 py-2.5 rounded-xl bg-surface-elevated border border-border text-text-primary text-sm focus-ring placeholder:text-text-muted"
        />
      </div>

      {/* Priority & Due Date */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-text-primary mb-1">
            Priority
          </label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as TaskPriority)}
            className="w-full px-3 py-2 rounded-xl bg-surface-elevated border border-border text-text-primary text-sm focus-ring cursor-pointer"
          >
            <option value="urgent">🔴 Urgent</option>
            <option value="high">🟠 High</option>
            <option value="medium">🔵 Medium</option>
            <option value="low">⚪ Low</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-text-primary mb-1">
            Due Date
          </label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-surface-elevated border border-border text-text-primary text-sm focus-ring"
          />
        </div>
      </div>

      {/* Link to Content Item */}
      <div>
        <label className="block text-xs font-semibold text-text-primary mb-1">
          Link to Content Video (Optional)
        </label>
        <select
          value={contentId}
          onChange={(e) => setContentId(e.target.value)}
          className="w-full px-3 py-2 rounded-xl bg-surface-elevated border border-border text-text-primary text-sm focus-ring cursor-pointer"
        >
          <option value="">None (Independent Task)</option>
          {contentList.map((item) => (
            <option key={item.id} value={item.id}>
              {item.platform === 'youtube' ? '▶ YouTube: ' : '📸 Reel: '}
              {item.title}
            </option>
          ))}
        </select>
      </div>

      {/* Description */}
      <div>
        <label className="block text-xs font-semibold text-text-primary mb-1">
          Notes & Details (Optional)
        </label>
        <textarea
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Equipment needed, camera angles, color grading notes..."
          className="w-full px-3 py-2 rounded-xl bg-surface-elevated border border-border text-text-primary text-sm placeholder:text-text-muted focus-ring"
        />
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border">
        <Button type="button" variant="outline" size="sm" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" size="sm">
          {initialData ? 'Save Changes' : 'Add Task'}
        </Button>
      </div>
    </form>
  );
};

export const TaskFormModal: React.FC<TaskFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  contentList,
  initialData,
  defaultContentId,
  defaultDueDate,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Task' : 'Add Production Task'}
      description="Keep track of recording steps, thumbnail assets, and editing milestones."
      maxWidth="md"
    >
      <TaskForm
        key={initialData ? initialData.id : `new-${defaultContentId || 'none'}-${defaultDueDate || 'default'}`}
        onClose={onClose}
        onSubmit={onSubmit}
        contentList={contentList}
        initialData={initialData}
        defaultContentId={defaultContentId}
        defaultDueDate={defaultDueDate}
      />
    </Modal>
  );
};
