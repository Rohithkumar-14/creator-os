import React, { useState } from 'react';
import { ContentItem } from '../../types';
import { PlatformBadge, StageBadge, TagBadge } from '../common/Badge';
import { formatFriendlyDate, isOverdue } from '../../utils/date';
import { 
  ArrowUpDown, 
  ChevronRight, 
  Edit3, 
  Archive, 
  Trash2, 
  RotateCcw 
} from 'lucide-react';

interface ContentTableProps {
  content: ContentItem[];
  onSelect: (item: ContentItem) => void;
  onEdit: (item: ContentItem) => void;
  onArchive: (id: string, archive: boolean) => void;
  onDelete: (id: string) => void;
}

type SortField = 'title' | 'stage' | 'dueDate' | 'progress';

export const ContentTable: React.FC<ContentTableProps> = ({
  content,
  onSelect,
  onEdit,
  onArchive,
  onDelete,
}) => {
  const [sortField, setSortField] = useState<SortField>('dueDate');
  const [sortAsc, setSortAsc] = useState(true);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const sortedContent = [...content].sort((a, b) => {
    let comp = 0;
    if (sortField === 'title') {
      comp = a.title.localeCompare(b.title);
    } else if (sortField === 'stage') {
      comp = a.stage.localeCompare(b.stage);
    } else if (sortField === 'dueDate') {
      comp = a.dueDate.localeCompare(b.dueDate);
    } else if (sortField === 'progress') {
      const aDone = Object.values(a.checklist || {}).filter(Boolean).length;
      const bDone = Object.values(b.checklist || {}).filter(Boolean).length;
      comp = aDone - bDone;
    }
    return sortAsc ? comp : -comp;
  });

  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-border bg-surface shadow-card">
      <table className="w-full text-left text-xs border-collapse">
        <thead className="bg-surface-elevated/80 border-b border-border text-text-muted uppercase font-semibold tracking-wider">
          <tr>
            <th className="py-3.5 px-4 cursor-pointer hover:text-text-primary" onClick={() => handleSort('title')}>
              <div className="flex items-center gap-1.5">
                <span>Video Project</span>
                <ArrowUpDown className="w-3 h-3" />
              </div>
            </th>
            <th className="py-3.5 px-4 cursor-pointer hover:text-text-primary" onClick={() => handleSort('stage')}>
              <div className="flex items-center gap-1.5">
                <span>Stage</span>
                <ArrowUpDown className="w-3 h-3" />
              </div>
            </th>
            <th className="py-3.5 px-4 cursor-pointer hover:text-text-primary" onClick={() => handleSort('dueDate')}>
              <div className="flex items-center gap-1.5">
                <span>Deadline</span>
                <ArrowUpDown className="w-3 h-3" />
              </div>
            </th>
            <th className="py-3.5 px-4 cursor-pointer hover:text-text-primary" onClick={() => handleSort('progress')}>
              <div className="flex items-center gap-1.5">
                <span>Milestones</span>
                <ArrowUpDown className="w-3 h-3" />
              </div>
            </th>
            <th className="py-3.5 px-4 hidden md:table-cell">Tags</th>
            <th className="py-3.5 px-4 text-right">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-border/60">
          {sortedContent.map((item) => {
            const completedMilestones = Object.values(item.checklist || {}).filter(Boolean).length;
            const progress = Math.round((completedMilestones / 7) * 100);
            const overdue = isOverdue(item.dueDate) && item.stage !== 'published';

            return (
              <tr
                key={item.id}
                onClick={() => onSelect(item)}
                className="hover:bg-surface-elevated/60 transition-colors cursor-pointer group"
              >
                {/* Title & Platform */}
                <td className="py-3.5 px-4 max-w-xs">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5">
                      <PlatformBadge platform={item.platform} size="sm" />
                    </div>
                    <span className="font-semibold text-text-primary group-hover:text-accent transition-colors line-clamp-1">
                      {item.title}
                    </span>
                  </div>
                </td>

                {/* Stage */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <StageBadge stage={item.stage} size="sm" />
                </td>

                {/* Due Date */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <span className={`font-medium ${overdue ? 'text-status-error font-semibold' : 'text-text-secondary'}`}>
                    {formatFriendlyDate(item.dueDate)}
                  </span>
                  {overdue && (
                    <span className="block text-[10px] text-status-error font-semibold">
                      Overdue
                    </span>
                  )}
                </td>

                {/* Milestones / Progress */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <div className="flex items-center gap-2 max-w-[120px]">
                    <div className="w-16 h-1.5 bg-surface-muted rounded-full overflow-hidden border border-border">
                      <div
                        className={`h-full rounded-full ${progress === 100 ? 'bg-status-success' : 'bg-accent'}`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <span className="text-[11px] font-semibold text-text-muted">
                      {completedMilestones}/7
                    </span>
                  </div>
                </td>

                {/* Tags */}
                <td className="py-3.5 px-4 hidden md:table-cell">
                  <div className="flex flex-wrap gap-1 max-w-[180px]">
                    {item.tags.slice(0, 2).map((t) => (
                      <TagBadge key={t} tag={t} />
                    ))}
                    {item.tags.length > 2 && (
                      <span className="text-[10px] text-text-muted">+{item.tags.length - 2}</span>
                    )}
                  </div>
                </td>

                {/* Actions */}
                <td className="py-3.5 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => onEdit(item)}
                      className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-elevated focus-ring"
                      title="Edit project"
                      aria-label="Edit project"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onArchive(item.id, !item.isArchived)}
                      className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-elevated focus-ring"
                      title={item.isArchived ? 'Restore' : 'Archive'}
                      aria-label={item.isArchived ? 'Restore' : 'Archive'}
                    >
                      {item.isArchived ? <RotateCcw className="w-3.5 h-3.5" /> : <Archive className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(item.id)}
                      className="p-1.5 rounded-lg text-text-secondary hover:text-status-error hover:bg-status-error/10 focus-ring"
                      title="Delete project"
                      aria-label="Delete project"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onSelect(item)}
                      className="p-1.5 rounded-lg text-text-muted hover:text-accent focus-ring"
                      title="View details"
                      aria-label="View details"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
