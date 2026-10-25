import React from 'react';
import { Platform, ContentStage, TaskPriority } from '../../types';
import { Lightbulb, Search, FileText, Video, Scissors, CheckCircle2 } from 'lucide-react';
import { YoutubeIcon, InstagramIcon } from './PlatformIcons';

interface BaseBadgeProps {
  className?: string;
  size?: 'sm' | 'md';
}

export const PlatformBadge: React.FC<{ platform: Platform } & BaseBadgeProps> = ({ platform, className = '', size = 'md' }) => {
  const isYt = platform === 'youtube';
  const sizeClass = size === 'sm' ? 'text-xs px-2 py-0.5 gap-1' : 'text-xs px-2.5 py-1 gap-1.5';

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${sizeClass} ${
        isYt
          ? 'bg-red-500/10 text-red-400 border-red-500/20'
          : 'bg-pink-500/10 text-pink-400 border-pink-500/20'
      } ${className}`}
    >
      {isYt ? (
        <YoutubeIcon className={size === 'sm' ? 'w-3 h-3 text-red-500' : 'w-3.5 h-3.5 text-red-500'} />
      ) : (
        <InstagramIcon className={size === 'sm' ? 'w-3 h-3 text-pink-500' : 'w-3.5 h-3.5 text-pink-500'} />
      )}
      <span>{isYt ? 'YouTube' : 'Instagram Reel'}</span>
    </span>
  );
};

export const StageBadge: React.FC<{ stage: ContentStage } & BaseBadgeProps> = ({ stage, className = '', size = 'md' }) => {
  const config: Record<ContentStage, { label: string; icon: React.FC<{ className?: string }>; color: string }> = {
    idea: { label: 'Idea', icon: Lightbulb, color: 'bg-amber-500/10 text-amber-300 border-amber-500/20' },
    research: { label: 'Research', icon: Search, color: 'bg-blue-500/10 text-blue-300 border-blue-500/20' },
    scripting: { label: 'Scripting', icon: FileText, color: 'bg-purple-500/10 text-purple-300 border-purple-500/20' },
    recording: { label: 'Recording', icon: Video, color: 'bg-rose-500/10 text-rose-300 border-rose-500/20' },
    editing: { label: 'Editing', icon: Scissors, color: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20' },
    published: { label: 'Published', icon: CheckCircle2, color: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' },
  };

  const current = config[stage] || config.idea;
  const Icon = current.icon;
  const sizeClass = size === 'sm' ? 'text-xs px-2 py-0.5 gap-1' : 'text-xs px-2.5 py-1 gap-1.5';

  return (
    <span className={`inline-flex items-center font-medium rounded-md border ${sizeClass} ${current.color} ${className}`}>
      <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      <span>{current.label}</span>
    </span>
  );
};

export const PriorityBadge: React.FC<{ priority: TaskPriority } & BaseBadgeProps> = ({ priority, className = '', size = 'md' }) => {
  const config: Record<TaskPriority, { label: string; color: string; dot: string }> = {
    urgent: { label: 'Urgent', color: 'bg-red-500/10 text-red-400 border-red-500/30', dot: 'bg-red-400' },
    high: { label: 'High', color: 'bg-amber-500/10 text-amber-300 border-amber-500/30', dot: 'bg-amber-400' },
    medium: { label: 'Medium', color: 'bg-blue-500/10 text-blue-300 border-blue-500/30', dot: 'bg-blue-400' },
    low: { label: 'Low', color: 'bg-slate-500/10 text-slate-400 border-slate-500/30', dot: 'bg-slate-400' },
  };

  const current = config[priority] || config.medium;
  const sizeClass = size === 'sm' ? 'text-xs px-1.5 py-0.5 gap-1' : 'text-xs px-2 py-0.5 gap-1.5';

  return (
    <span className={`inline-flex items-center font-medium rounded border ${sizeClass} ${current.color} ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${current.dot} animate-pulse`} />
      <span>{current.label}</span>
    </span>
  );
};

export const TagBadge: React.FC<{ tag: string; onRemove?: () => void }> = ({ tag, onRemove }) => {
  const displayTag = tag.startsWith('#') ? tag : `#${tag}`;
  return (
    <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-md bg-surface-muted text-text-secondary border border-border">
      <span>{displayTag}</span>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="hover:text-status-error ml-0.5 focus:outline-none"
          aria-label={`Remove tag ${tag}`}
        >
          &times;
        </button>
      )}
    </span>
  );
};
