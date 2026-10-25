import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { ContentItem, ContentStage, Platform, ProductionChecklist } from '../../types';
import { getTodayString } from '../../utils/date';
import { Plus, X, Link as LinkIcon } from 'lucide-react';
import { YoutubeIcon, InstagramIcon } from '../common/PlatformIcons';

interface ContentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<ContentItem, 'id' | 'createdAt' | 'isArchived'>) => void;
  initialData?: ContentItem | null;
  defaultStage?: ContentStage;
  defaultDueDate?: string;
}

interface ContentFormProps {
  onClose: () => void;
  onSubmit: (data: Omit<ContentItem, 'id' | 'createdAt' | 'isArchived'>) => void;
  initialData?: ContentItem | null;
  defaultStage?: ContentStage;
  defaultDueDate?: string;
}

const ContentForm: React.FC<ContentFormProps> = ({
  onClose,
  onSubmit,
  initialData,
  defaultStage,
  defaultDueDate,
}) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [platform, setPlatform] = useState<Platform>(initialData?.platform || 'youtube');
  const [stage, setStage] = useState<ContentStage>(initialData?.stage || defaultStage || 'idea');
  const [dueDate, setDueDate] = useState(initialData?.dueDate || defaultDueDate || getTodayString());
  const [publishDate, setPublishDate] = useState(initialData?.publishDate || '');
  const [tags, setTags] = useState<string[]>(initialData?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [scriptNotes, setScriptNotes] = useState(initialData?.scriptNotes || '');
  const [researchLinks, setResearchLinks] = useState<string[]>(initialData?.researchLinks || []);
  const [linkInput, setLinkInput] = useState('');
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

  const handleAddLink = () => {
    const clean = linkInput.trim();
    if (clean && !researchLinks.includes(clean)) {
      // Basic URL auto-prepend
      const url = clean.startsWith('http://') || clean.startsWith('https://') ? clean : `https://${clean}`;
      setResearchLinks([...researchLinks, url]);
      setLinkInput('');
    }
  };

  const handleRemoveLink = (linkToRemove: string) => {
    setResearchLinks(researchLinks.filter(l => l !== linkToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Content title is required.');
      return;
    }

    const defaultChecklist: ProductionChecklist = initialData?.checklist || {
      research: stage !== 'idea',
      scripting: ['recording', 'editing', 'published'].includes(stage),
      recording: ['editing', 'published'].includes(stage),
      editing: stage === 'published',
      thumbnails: stage === 'published',
      captions: stage === 'published',
      published: stage === 'published',
    };

    onSubmit({
      title: title.trim(),
      platform,
      stage,
      dueDate: dueDate || getTodayString(),
      publishDate: publishDate || undefined,
      tags,
      scriptNotes: scriptNotes.trim() || undefined,
      researchLinks: researchLinks.length > 0 ? researchLinks : undefined,
      checklist: defaultChecklist,
    });

    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-lg bg-status-error/15 border border-status-error/30 text-status-error text-xs font-medium">
            {error}
          </div>
        )}

        {/* Title */}
        <div>
          <label className="block text-xs font-semibold text-text-primary mb-1">
            Title <span className="text-status-error">*</span>
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (error) setError(null);
            }}
            placeholder="e.g., How I Code With 3 Autonomous AI Agents"
            className="w-full px-3.5 py-2.5 rounded-xl bg-surface-elevated border border-border text-text-primary text-sm placeholder:text-text-muted focus-ring"
          />
        </div>

        {/* Platform Selection */}
        <div>
          <label className="block text-xs font-semibold text-text-primary mb-1.5">
            Platform
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setPlatform('youtube')}
              className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-sm font-medium transition-all ${
                platform === 'youtube'
                  ? 'bg-red-500/15 border-red-500 text-red-400 font-semibold shadow-sm'
                  : 'bg-surface-elevated border-border text-text-secondary hover:text-text-primary'
              }`}
            >
              <YoutubeIcon className="w-4 h-4 text-red-500" />
              <span>YouTube Video</span>
            </button>

            <button
              type="button"
              onClick={() => setPlatform('instagram')}
              className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-sm font-medium transition-all ${
                platform === 'instagram'
                  ? 'bg-pink-500/15 border-pink-500 text-pink-400 font-semibold shadow-sm'
                  : 'bg-surface-elevated border-border text-text-secondary hover:text-text-primary'
              }`}
            >
              <InstagramIcon className="w-4 h-4 text-pink-500" />
              <span>Instagram Reel</span>
            </button>
          </div>
        </div>

        {/* Stage and Due Date row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-text-primary mb-1">
              Production Stage
            </label>
            <select
              value={stage}
              onChange={(e) => setStage(e.target.value as ContentStage)}
              className="w-full px-3 py-2.5 rounded-xl bg-surface-elevated border border-border text-text-primary text-sm focus-ring cursor-pointer"
            >
              <option value="idea">💡 Idea Backlog</option>
              <option value="research">🔍 Research & Outline</option>
              <option value="scripting">📝 Scripting</option>
              <option value="recording">🎬 Recording (A/B Roll)</option>
              <option value="editing">✂️ Editing & Polish</option>
              <option value="published">🚀 Published</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-primary mb-1">
              Target Deadline
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-surface-elevated border border-border text-text-primary text-sm focus-ring"
            />
          </div>
        </div>

        {/* Publishing Date */}
        <div>
          <label className="block text-xs font-semibold text-text-primary mb-1">
            Planned Publishing Date (Optional)
          </label>
          <input
            type="date"
            value={publishDate}
            onChange={(e) => setPublishDate(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-surface-elevated border border-border text-text-primary text-sm focus-ring"
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-xs font-semibold text-text-primary mb-1">
            Categories & Tags
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="Add tag (e.g., coding, tutorial) and press Enter"
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
                  className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-md bg-accent/15 text-accent border border-accent/25"
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

        {/* Script Notes / Outline */}
        <div>
          <label className="block text-xs font-semibold text-text-primary mb-1">
            Script Outline & Hook Notes
          </label>
          <textarea
            rows={3}
            value={scriptNotes}
            onChange={(e) => setScriptNotes(e.target.value)}
            placeholder="Write hook, talking points, key transitions, call to action..."
            className="w-full px-3 py-2 rounded-xl bg-surface-elevated border border-border text-text-primary text-sm placeholder:text-text-muted focus-ring resize-y"
          />
        </div>

        {/* Research Links */}
        <div>
          <label className="block text-xs font-semibold text-text-primary mb-1">
            Research & Asset Links
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={linkInput}
              onChange={(e) => setLinkInput(e.target.value)}
              placeholder="e.g. https://github.com/example"
              className="flex-1 px-3 py-1.5 rounded-lg bg-surface-elevated border border-border text-text-primary text-xs focus-ring"
            />
            <Button type="button" variant="secondary" size="sm" icon={Plus} onClick={handleAddLink}>
              Link
            </Button>
          </div>
          {researchLinks.length > 0 && (
            <ul className="space-y-1.5 pt-1">
              {researchLinks.map((link) => (
                <li key={link} className="flex items-center justify-between text-xs px-2.5 py-1.5 rounded-lg bg-surface-muted text-text-secondary border border-border">
                  <span className="flex items-center gap-1.5 truncate max-w-xs sm:max-w-md">
                    <LinkIcon className="w-3.5 h-3.5 text-accent flex-shrink-0" />
                    <span className="truncate">{link}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveLink(link)}
                    className="text-text-muted hover:text-status-error ml-2"
                    aria-label={`Remove link ${link}`}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-border">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm">
            {initialData ? 'Save Changes' : 'Create Video'}
          </Button>
        </div>
      </form>
  );
};

export const ContentFormModal: React.FC<ContentFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  defaultStage,
  defaultDueDate,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Content Details' : 'Create New Video Project'}
      description="Plan scripts, deadlines, and publishing schedule for YouTube or Instagram."
      maxWidth="lg"
    >
      <ContentForm
        key={initialData ? initialData.id : `new-${defaultStage || 'idea'}-${defaultDueDate || 'default'}`}
        onClose={onClose}
        onSubmit={onSubmit}
        initialData={initialData}
        defaultStage={defaultStage}
        defaultDueDate={defaultDueDate}
      />
    </Modal>
  );
};
