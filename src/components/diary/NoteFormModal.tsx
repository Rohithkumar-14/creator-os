import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { DiaryNote, NoteType, ContentItem } from '../../types';
import { X, Sparkles, Lightbulb, Zap, FileText, Search } from 'lucide-react';

interface NoteFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<DiaryNote, 'id' | 'createdAt'>) => void;
  contentList: ContentItem[];
  initialData?: DiaryNote | null;
  defaultContentId?: string;
}

interface NoteFormProps {
  onClose: () => void;
  onSubmit: (data: Omit<DiaryNote, 'id' | 'createdAt'>) => void;
  contentList: ContentItem[];
  initialData?: DiaryNote | null;
  defaultContentId?: string;
}

const NoteForm: React.FC<NoteFormProps> = ({
  onClose,
  onSubmit,
  contentList,
  initialData,
  defaultContentId,
}) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [type, setType] = useState<NoteType>(initialData?.type || 'idea');
  const [content, setContent] = useState(initialData?.content || '');
  const [tags, setTags] = useState<string[]>(initialData?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [contentId, setContentId] = useState(initialData?.contentId || defaultContentId || '');
  const [error, setError] = useState<string | null>(null);

  const handleAddTag = (e?: React.KeyboardEvent | React.MouseEvent) => {
    if (e && 'key' in e && e.key !== 'Enter') return;
    if (e) e.preventDefault();

    const clean = tagInput.trim().replace(/^#/, '');
    if (clean && !tags.includes(clean)) {
      setTags([...tags, clean]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Note title or hook summary is required.');
      return;
    }

    onSubmit({
      title: title.trim(),
      type,
      content: content.trim(),
      tags,
      contentId: contentId || undefined,
    });

    onClose();
  };

  const typeIcons: Record<NoteType, { label: string; icon: React.FC<{ className?: string }>; color: string }> = {
    idea: { label: 'Video Idea', icon: Lightbulb, color: 'text-amber-400' },
    hook: { label: 'Opening Hook', icon: Zap, color: 'text-rose-400' },
    script: { label: 'Script Snippet', icon: FileText, color: 'text-purple-400' },
    research: { label: 'Research', icon: Search, color: 'text-blue-400' },
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-2.5 rounded-lg bg-status-error/15 border border-status-error/30 text-status-error text-xs font-medium">
          {error}
        </div>
      )}

      {/* Note Type Selector */}
      <div>
        <label className="block text-xs font-semibold text-text-primary mb-1.5">
          Note Category
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {(['idea', 'hook', 'script', 'research'] as NoteType[]).map((t) => {
            const current = typeIcons[t];
            const Icon = current.icon;
            const isSelected = type === t;

            return (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-accent/15 border-accent text-accent font-semibold shadow-sm'
                    : 'bg-surface-elevated border-border text-text-secondary hover:text-text-primary'
                }`}
              >
                <Icon className={`w-4 h-4 mb-1 ${current.color}`} />
                <span>{current.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Title */}
      <div>
        <label className="block text-xs font-semibold text-text-primary mb-1">
          Title / Concept <span className="text-status-error">*</span>
        </label>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (error) setError(null);
          }}
          placeholder="e.g., 3-second counter-intuitive question hook"
          className="w-full px-3.5 py-2.5 rounded-xl bg-surface-elevated border border-border text-text-primary text-sm focus-ring placeholder:text-text-muted"
        />
      </div>

      {/* Link to Content */}
      <div>
        <label className="block text-xs font-semibold text-text-primary mb-1">
          Associated Video (Optional)
        </label>
        <select
          value={contentId}
          onChange={(e) => setContentId(e.target.value)}
          className="w-full px-3 py-2 rounded-xl bg-surface-elevated border border-border text-text-primary text-sm focus-ring cursor-pointer"
        >
          <option value="">General (Unassigned)</option>
          {contentList.map((item) => (
            <option key={item.id} value={item.id}>
              {item.platform === 'youtube' ? '▶ YouTube: ' : '📸 Reel: '}
              {item.title}
            </option>
          ))}
        </select>
      </div>

      {/* Content Body */}
      <div>
        <label className="block text-xs font-semibold text-text-primary mb-1">
          Content & Details
        </label>
        <textarea
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write full text, reference examples, talking points..."
          className="w-full px-3 py-2.5 rounded-xl bg-surface-elevated border border-border text-text-primary text-sm placeholder:text-text-muted focus-ring resize-y"
        />
      </div>

      {/* Tags */}
      <div>
        <label className="block text-xs font-semibold text-text-primary mb-1">
          Tags
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleAddTag}
            placeholder="Tag name and press Enter"
            className="flex-1 px-3 py-1.5 rounded-lg bg-surface-elevated border border-border text-text-primary text-xs focus-ring"
          />
          <Button type="button" variant="secondary" size="sm" onClick={handleAddTag}>
            Add
          </Button>
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-md bg-surface-muted text-text-secondary border border-border"
              >
                #{tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="hover:text-status-error ml-1"
                  aria-label={`Remove tag ${tag}`}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border">
        <Button type="button" variant="outline" size="sm" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" size="sm" icon={Sparkles}>
          {initialData ? 'Update Note' : 'Save Note'}
        </Button>
      </div>
    </form>
  );
};

export const NoteFormModal: React.FC<NoteFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  contentList,
  initialData,
  defaultContentId,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Note' : 'Capture Creator Note'}
      description="Quickly save inspiration, high-converting hooks, or script segments."
      maxWidth="md"
    >
      <NoteForm
        key={initialData ? initialData.id : `new-${defaultContentId || 'none'}`}
        onClose={onClose}
        onSubmit={onSubmit}
        contentList={contentList}
        initialData={initialData}
        defaultContentId={defaultContentId}
      />
    </Modal>
  );
};
