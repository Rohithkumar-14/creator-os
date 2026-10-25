import React from 'react';
import { ContentItem, ContentStage } from '../../types';
import { PlatformBadge, TagBadge } from '../common/Badge';
import { formatFriendlyDate, isOverdue } from '../../utils/date';
import { 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  Clock 
} from 'lucide-react';

interface ContentKanbanProps {
  content: ContentItem[];
  onSelect: (item: ContentItem) => void;
  onUpdateStage: (id: string, stage: ContentStage) => void;
  onAddNew: (defaultStage?: ContentStage) => void;
}

export const ContentKanban: React.FC<ContentKanbanProps> = ({
  content,
  onSelect,
  onUpdateStage,
  onAddNew,
}) => {
  const columns: { stage: ContentStage; title: string; color: string }[] = [
    { stage: 'idea', title: 'Idea Backlog', color: 'border-amber-500/30' },
    { stage: 'research', title: 'Research & Angle', color: 'border-blue-500/30' },
    { stage: 'scripting', title: 'Scripting', color: 'border-purple-500/30' },
    { stage: 'recording', title: 'Recording (A/B)', color: 'border-rose-500/30' },
    { stage: 'editing', title: 'Editing & Sound', color: 'border-indigo-500/30' },
    { stage: 'published', title: 'Published', color: 'border-emerald-500/30' },
  ];

  const stageOrder: ContentStage[] = ['idea', 'research', 'scripting', 'recording', 'editing', 'published'];

  const getNextStage = (curr: ContentStage): ContentStage | null => {
    const idx = stageOrder.indexOf(curr);
    return idx < stageOrder.length - 1 ? stageOrder[idx + 1] : null;
  };

  const getPrevStage = (curr: ContentStage): ContentStage | null => {
    const idx = stageOrder.indexOf(curr);
    return idx > 0 ? stageOrder[idx - 1] : null;
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-6 pt-1 snap-x select-none">
      {columns.map((col) => {
        const stageItems = content.filter((item) => item.stage === col.stage);

        return (
          <div
            key={col.stage}
            className="flex-shrink-0 w-80 flex flex-col bg-surface/80 rounded-2xl border border-border shadow-card overflow-hidden snap-start"
          >
            {/* Column Header */}
            <div className={`p-3.5 border-b ${col.color} bg-surface-elevated/60 flex items-center justify-between`}>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs uppercase tracking-wider text-text-primary">
                  {col.title}
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-surface-muted text-text-secondary border border-border">
                  {stageItems.length}
                </span>
              </div>

              <button
                type="button"
                onClick={() => onAddNew(col.stage)}
                className="p-1 rounded-md text-text-muted hover:text-text-primary hover:bg-surface-elevated transition-colors focus-ring"
                title={`Add card in ${col.title}`}
                aria-label={`Add card in ${col.title}`}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Column Cards List */}
            <div className="p-3 flex-1 overflow-y-auto space-y-3 min-h-[350px] max-h-[calc(100vh-280px)]">
              {stageItems.length === 0 ? (
                <div className="h-32 flex flex-col items-center justify-center text-center p-4 border border-dashed border-border/70 rounded-xl text-text-muted text-xs">
                  <p>No video projects in {col.title.toLowerCase()}</p>
                </div>
              ) : (
                stageItems.map((item) => {
                  const completedMilestones = Object.values(item.checklist || {}).filter(Boolean).length;
                  const progress = Math.round((completedMilestones / 7) * 100);
                  const overdue = isOverdue(item.dueDate) && item.stage !== 'published';
                  const next = getNextStage(item.stage);
                  const prev = getPrevStage(item.stage);

                  return (
                    <div
                      key={item.id}
                      onClick={() => onSelect(item)}
                      className="p-3.5 rounded-xl bg-surface-elevated border border-border hover:border-accent/50 shadow-subtle hover:shadow-card transition-all cursor-pointer group space-y-2.5 relative"
                    >
                      {/* Top row: Platform & Due date */}
                      <div className="flex items-center justify-between gap-2">
                        <PlatformBadge platform={item.platform} size="sm" />
                        <span className={`text-[11px] font-medium flex items-center gap-1 ${
                          overdue ? 'text-status-error font-semibold' : 'text-text-muted'
                        }`}>
                          <Clock className="w-3 h-3" />
                          {formatFriendlyDate(item.dueDate)}
                        </span>
                      </div>

                      {/* Card Title */}
                      <h4 className="text-xs font-semibold text-text-primary group-hover:text-accent transition-colors line-clamp-2 leading-snug">
                        {item.title}
                      </h4>

                      {/* Tags */}
                      {item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {item.tags.slice(0, 2).map((t) => (
                            <TagBadge key={t} tag={t} />
                          ))}
                          {item.tags.length > 2 && (
                            <span className="text-[10px] text-text-muted">+{item.tags.length - 2}</span>
                          )}
                        </div>
                      )}

                      {/* Milestones bar */}
                      <div className="space-y-1 pt-1 border-t border-border/50">
                        <div className="flex items-center justify-between text-[10px] text-text-muted">
                          <span>Progress</span>
                          <span className="font-semibold text-text-secondary">{completedMilestones}/7</span>
                        </div>
                        <div className="w-full bg-surface-muted rounded-full h-1 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${progress === 100 ? 'bg-status-success' : 'bg-accent'}`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>

                      {/* Stage Transition Quick Buttons */}
                      <div
                        className="flex items-center justify-between pt-1 border-t border-border/40"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {prev ? (
                          <button
                            type="button"
                            onClick={() => onUpdateStage(item.id, prev)}
                            className="p-1 rounded text-text-muted hover:text-text-primary hover:bg-surface-muted transition-colors flex items-center gap-1 text-[10px] focus-ring"
                            title={`Move back to ${prev}`}
                            aria-label={`Move back to ${prev}`}
                          >
                            <ChevronLeft className="w-3 h-3" />
                            <span>Back</span>
                          </button>
                        ) : <span />}

                        {next && (
                          <button
                            type="button"
                            onClick={() => onUpdateStage(item.id, next)}
                            className="p-1 px-2 rounded-md bg-accent/15 text-accent hover:bg-accent/25 transition-colors flex items-center gap-1 text-[10px] font-semibold focus-ring ml-auto"
                            title={`Advance to ${next}`}
                            aria-label={`Advance to ${next}`}
                          >
                            <span>Next</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
