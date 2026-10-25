import React from 'react';
import { TaskItem as ITaskItem, ContentItem } from '../../types';
import { PriorityBadge } from '../common/Badge';
import { formatFriendlyDate, isOverdue, isToday } from '../../utils/date';
import { 
  Check, 
  Calendar, 
  Edit3, 
  Trash2, 
  Film 
} from 'lucide-react';

interface TaskItemProps {
  task: ITaskItem;
  linkedContent?: ContentItem;
  onToggle: (id: string) => void;
  onEdit: (task: ITaskItem) => void;
  onDelete: (id: string) => void;
  onSelectContent?: (item: ContentItem) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  linkedContent,
  onToggle,
  onEdit,
  onDelete,
  onSelectContent,
}) => {
  const overdue = isOverdue(task.dueDate) && !task.completed;
  const dueToday = isToday(task.dueDate) && !task.completed;

  return (
    <div
      className={`p-4 rounded-2xl border transition-all flex items-start gap-3.5 group ${
        task.completed
          ? 'bg-surface/50 border-border/60 opacity-70'
          : 'bg-surface border-border hover:border-accent/40 shadow-card'
      }`}
    >
      {/* Checkbox */}
      <button
        type="button"
        onClick={() => onToggle(task.id)}
        className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all mt-0.5 flex-shrink-0 cursor-pointer focus-ring ${
          task.completed
            ? 'bg-status-success border-status-success text-white'
            : 'border-border bg-surface-elevated hover:border-accent'
        }`}
        aria-label={task.completed ? 'Mark task as incomplete' : 'Mark task as completed'}
      >
        {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
      </button>

      {/* Task Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <PriorityBadge priority={task.priority} size="sm" />
          <span className={`text-[11px] font-semibold flex items-center gap-1 ${
            overdue
              ? 'text-status-error'
              : dueToday
              ? 'text-amber-400'
              : 'text-text-muted'
          }`}>
            <Calendar className="w-3 h-3" />
            {formatFriendlyDate(task.dueDate)}
            {overdue && <span className="font-bold uppercase tracking-wider text-[10px]">• Overdue</span>}
          </span>
        </div>

        <h4 className={`text-sm font-semibold text-text-primary ${
          task.completed ? 'line-through text-text-muted' : ''
        }`}>
          {task.title}
        </h4>

        {task.description && (
          <p className="text-xs text-text-secondary mt-1 leading-relaxed">
            {task.description}
          </p>
        )}

        {/* Linked Video */}
        {linkedContent && (
          <div
            onClick={() => onSelectContent && onSelectContent(linkedContent)}
            className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-surface-elevated border border-border text-[11px] text-text-secondary hover:text-accent transition-colors cursor-pointer"
          >
            <Film className="w-3 h-3 text-accent flex-shrink-0" />
            <span className="text-text-muted">Linked:</span>
            <span className="font-medium truncate max-w-[220px]">{linkedContent.title}</span>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity flex-shrink-0">
        <button
          type="button"
          onClick={() => onEdit(task)}
          className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-elevated focus-ring"
          title="Edit task"
          aria-label="Edit task"
        >
          <Edit3 className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => onDelete(task.id)}
          className="p-1.5 rounded-lg text-text-muted hover:text-status-error hover:bg-status-error/10 focus-ring"
          title="Delete task"
          aria-label="Delete task"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
