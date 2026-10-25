import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Calendar, 
  ExternalLink, 
  Edit3, 
  Archive, 
  Trash2, 
  RotateCcw, 
  Plus, 
  FileText, 
  CheckSquare, 
  BookOpen, 
  Clock 
} from 'lucide-react';
import { ContentItem, ContentStage, TaskItem, DiaryNote } from '../../types';
import { PlatformBadge, StageBadge, TagBadge, PriorityBadge } from '../common/Badge';
import { Button } from '../common/Button';
import { ProductionChecklist } from '../checklists/ProductionChecklist';
import { formatFriendlyDate, isOverdue } from '../../utils/date';

interface ContentDetailDrawerProps {
  content: ContentItem | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (item: ContentItem) => void;
  onDelete: (id: string) => void;
  onArchive: (id: string, archive: boolean) => void;
  onToggleChecklist: (contentId: string, itemKey: keyof ContentItem['checklist']) => void;
  onUpdateStage: (id: string, stage: ContentStage) => void;
  relatedTasks: TaskItem[];
  relatedNotes: DiaryNote[];
  onToggleTask: (id: string) => void;
  onAddTask: (contentId: string) => void;
  onAddNote: (contentId: string) => void;
}

export const ContentDetailDrawer: React.FC<ContentDetailDrawerProps> = ({
  content,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onArchive,
  onToggleChecklist,
  onUpdateStage,
  relatedTasks,
  relatedNotes,
  onToggleTask,
  onAddTask,
  onAddNote,
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

  if (!content) return null;

  const overdue = isOverdue(content.dueDate) && content.stage !== 'published';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Drawer content */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 300 }}
            className="relative w-full max-w-xl bg-surface border-l border-border h-full flex flex-col shadow-elevated z-10 overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-label={`Content details for ${content.title}`}
          >
            {/* Header */}
            <div className="p-5 border-b border-border bg-surface-elevated/40 flex items-start justify-between gap-4">
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <PlatformBadge platform={content.platform} />
                  <StageBadge stage={content.stage} />
                  {content.isArchived && (
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-surface-muted text-text-muted border border-border">
                      Archived
                    </span>
                  )}
                </div>
                <h2 className="text-lg font-bold text-text-primary tracking-tight leading-snug break-words">
                  {content.title}
                </h2>
              </div>

              <div className="flex items-center gap-1.5 flex-shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(content)}
                  aria-label="Edit content"
                  icon={Edit3}
                >
                  Edit
                </Button>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-text-secondary hover:text-text-primary p-2 rounded-lg hover:bg-surface-elevated focus-ring"
                  aria-label="Close detail drawer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 p-5 overflow-y-auto space-y-6">
              {/* Status & Deadline Card */}
              <div className="p-4 rounded-xl bg-surface-elevated/60 border border-border grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-text-muted mb-1 uppercase tracking-wider">
                    Update Stage
                  </label>
                  <select
                    value={content.stage}
                    onChange={(e) => onUpdateStage(content.id, e.target.value as ContentStage)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-surface border border-border text-text-primary text-xs font-medium focus-ring cursor-pointer"
                  >
                    <option value="idea">💡 Idea</option>
                    <option value="research">🔍 Research</option>
                    <option value="scripting">📝 Scripting</option>
                    <option value="recording">🎬 Recording</option>
                    <option value="editing">✂️ Editing</option>
                    <option value="published">🚀 Published</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-muted mb-1 uppercase tracking-wider">
                    Target Deadline
                  </label>
                  <div className={`flex items-center gap-1.5 text-xs font-semibold ${overdue ? 'text-status-error' : 'text-text-primary'}`}>
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{formatFriendlyDate(content.dueDate)}</span>
                    {overdue && (
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-status-error/15 text-status-error">
                        Overdue
                      </span>
                    )}
                  </div>
                  {content.publishDate && (
                    <div className="flex items-center gap-1.5 text-xs text-text-muted mt-1">
                      <Clock className="w-3 h-3" />
                      <span>Publishes: {formatFriendlyDate(content.publishDate)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Tags */}
              {content.tags && content.tags.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted mb-2">
                    Categories & Tags
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {content.tags.map((t) => (
                      <TagBadge key={t} tag={t} />
                    ))}
                  </div>
                </div>
              )}

              {/* Production Checklist */}
              <div>
                <ProductionChecklist
                  contentId={content.id}
                  checklist={content.checklist}
                  onToggle={onToggleChecklist}
                />
              </div>

              {/* Script Notes / Hook */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-accent" />
                    Script Notes & Hook Outline
                  </h4>
                </div>
                <div className="p-3.5 rounded-xl bg-surface-elevated/40 border border-border text-xs text-text-primary whitespace-pre-line leading-relaxed font-mono">
                  {content.scriptNotes || (
                    <span className="text-text-muted italic">No script notes added yet. Click Edit to add outline.</span>
                  )}
                </div>
              </div>

              {/* Research Links */}
              {content.researchLinks && content.researchLinks.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted mb-2">
                    Research & Assets
                  </h4>
                  <ul className="space-y-1.5">
                    {content.researchLinks.map((url, i) => (
                      <li key={i}>
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-xs p-2.5 rounded-lg bg-surface-elevated border border-border text-accent hover:text-accent-hover hover:underline transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
                          <span className="truncate">{url}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Linked Tasks */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
                    <CheckSquare className="w-3.5 h-3.5 text-accent" />
                    Linked Tasks ({relatedTasks.length})
                  </h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={Plus}
                    onClick={() => onAddTask(content.id)}
                    className="text-xs py-1"
                  >
                    Add Task
                  </Button>
                </div>

                {relatedTasks.length === 0 ? (
                  <p className="text-xs text-text-muted italic p-3 rounded-lg bg-surface-elevated/30 border border-border">
                    No tasks linked specifically to this video project.
                  </p>
                ) : (
                  <div className="space-y-1.5">
                    {relatedTasks.map((task) => (
                      <div
                        key={task.id}
                        onClick={() => onToggleTask(task.id)}
                        className={`flex items-center justify-between p-2.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                          task.completed
                            ? 'bg-surface-muted/60 border-border text-text-muted line-through'
                            : 'bg-surface-elevated border-border text-text-primary hover:border-accent/40'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate pr-2">
                          <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => onToggleTask(task.id)}
                            className="rounded border-border text-accent focus:ring-accent"
                          />
                          <span className="truncate font-medium">{task.title}</span>
                        </div>
                        <PriorityBadge priority={task.priority} size="sm" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Linked Diary Notes */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-accent" />
                    Diary Notes & Hooks ({relatedNotes.length})
                  </h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={Plus}
                    onClick={() => onAddNote(content.id)}
                    className="text-xs py-1"
                  >
                    Add Note
                  </Button>
                </div>

                {relatedNotes.length === 0 ? (
                  <p className="text-xs text-text-muted italic p-3 rounded-lg bg-surface-elevated/30 border border-border">
                    No notes linked to this video yet.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {relatedNotes.map((note) => (
                      <div key={note.id} className="p-3 rounded-xl bg-surface-elevated border border-border text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-text-primary">{note.title}</span>
                          <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-accent/10 text-accent">
                            {note.type}
                          </span>
                        </div>
                        <p className="text-text-secondary line-clamp-2 leading-relaxed">
                          {note.content}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-border bg-surface-elevated/40 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  icon={content.isArchived ? RotateCcw : Archive}
                  onClick={() => onArchive(content.id, !content.isArchived)}
                >
                  {content.isArchived ? 'Restore' : 'Archive'}
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  icon={Trash2}
                  onClick={() => onDelete(content.id)}
                >
                  Delete
                </Button>
              </div>

              <Button variant="secondary" size="sm" onClick={onClose}>
                Done
              </Button>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
};
