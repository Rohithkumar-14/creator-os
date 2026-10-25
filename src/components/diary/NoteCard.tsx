import React, { useState } from 'react';
import { DiaryNote, ContentItem } from '../../types';
import { TagBadge } from '../common/Badge';
import { 
  Lightbulb, 
  Zap, 
  FileText, 
  Search, 
  Copy, 
  Check, 
  Edit3, 
  Trash2, 
  Film 
} from 'lucide-react';
import { formatFriendlyDate } from '../../utils/date';

interface NoteCardProps {
  note: DiaryNote;
  linkedContent?: ContentItem;
  onEdit: (note: DiaryNote) => void;
  onDelete: (id: string) => void;
}

export const NoteCard: React.FC<NoteCardProps> = ({
  note,
  linkedContent,
  onEdit,
  onDelete,
}) => {
  const [copied, setCopied] = useState(false);

  const typeConfig = {
    idea: { label: 'Idea', icon: Lightbulb, badge: 'bg-amber-500/15 text-amber-300 border-amber-500/25' },
    hook: { label: 'Hook', icon: Zap, badge: 'bg-rose-500/15 text-rose-300 border-rose-500/25' },
    script: { label: 'Script', icon: FileText, badge: 'bg-purple-500/15 text-purple-300 border-purple-500/25' },
    research: { label: 'Research', icon: Search, badge: 'bg-blue-500/15 text-blue-300 border-blue-500/25' },
  }[note.type];

  const Icon = typeConfig.icon;

  const handleCopy = () => {
    navigator.clipboard.writeText(`${note.title}\n\n${note.content}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-4 rounded-2xl bg-surface border border-border shadow-card hover:border-accent/40 transition-all flex flex-col justify-between group">
      <div>
        {/* Header: Category and Actions */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className={`inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${typeConfig.badge}`}>
            <Icon className="w-3 h-3" />
            <span>{typeConfig.label}</span>
          </span>

          <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={handleCopy}
              className="p-1 rounded-md text-text-muted hover:text-text-primary hover:bg-surface-elevated focus-ring"
              title="Copy note to clipboard"
              aria-label="Copy note to clipboard"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-status-success" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
            <button
              type="button"
              onClick={() => onEdit(note)}
              className="p-1 rounded-md text-text-muted hover:text-text-primary hover:bg-surface-elevated focus-ring"
              title="Edit note"
              aria-label="Edit note"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(note.id)}
              className="p-1 rounded-md text-text-muted hover:text-status-error hover:bg-status-error/10 focus-ring"
              title="Delete note"
              aria-label="Delete note"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Note Title */}
        <h4 className="text-sm font-bold text-text-primary mb-1.5 leading-snug">
          {note.title}
        </h4>

        {/* Note Content */}
        <p className="text-xs text-text-secondary whitespace-pre-line leading-relaxed font-sans line-clamp-6">
          {note.content}
        </p>

        {/* Linked Video project indicator if any */}
        {linkedContent && (
          <div className="mt-3 p-2 rounded-lg bg-surface-elevated/70 border border-border text-[11px] text-text-secondary flex items-center gap-1.5 truncate">
            <Film className="w-3 h-3 text-accent flex-shrink-0" />
            <span className="text-text-muted">Linked to:</span>
            <span className="font-medium text-text-primary truncate">{linkedContent.title}</span>
          </div>
        )}
      </div>

      {/* Footer Tags & Date */}
      <div className="pt-3 mt-3 border-t border-border/50 flex items-center justify-between gap-2">
        <div className="flex flex-wrap gap-1">
          {note.tags.map((t) => (
            <TagBadge key={t} tag={t} />
          ))}
        </div>
        <span className="text-[10px] text-text-muted whitespace-nowrap">
          {formatFriendlyDate(note.createdAt.slice(0, 10))}
        </span>
      </div>
    </div>
  );
};
