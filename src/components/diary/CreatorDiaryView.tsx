import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  Search, 
  Plus, 
  X, 
  BookOpen 
} from 'lucide-react';
import { ContentItem, DiaryNote, NoteType } from '../../types';
import { NoteCard } from './NoteCard';
import { Button } from '../common/Button';
import { EmptyState } from '../common/EmptyState';
import { useDebounce } from '../../hooks/useDebounce';

interface CreatorDiaryViewProps {
  notes: DiaryNote[];
  contentList: ContentItem[];
  onAddNote: (note: Omit<DiaryNote, 'id' | 'createdAt'>) => void;
  onEditNote: (note: DiaryNote) => void;
  onDeleteNote: (id: string) => void;
  onOpenNewModal: () => void;
}

export const CreatorDiaryView: React.FC<CreatorDiaryViewProps> = ({
  notes,
  contentList,
  onAddNote,
  onEditNote,
  onDeleteNote,
  onOpenNewModal,
}) => {
  const [activeCategory, setActiveCategory] = useState<NoteType | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [quickTitle, setQuickTitle] = useState('');
  const [quickType, setQuickType] = useState<NoteType>('idea');

  const debouncedSearch = useDebounce(searchTerm, 250);

  const filteredNotes = useMemo(() => {
    return notes.filter((n) => {
      if (activeCategory !== 'all' && n.type !== activeCategory) {
        return false;
      }
      if (debouncedSearch.trim()) {
        const q = debouncedSearch.toLowerCase().trim();
        const titleMatch = n.title.toLowerCase().includes(q);
        const contentMatch = n.content.toLowerCase().includes(q);
        const tagMatch = n.tags.some((t) => t.toLowerCase().includes(q));
        if (!titleMatch && !contentMatch && !tagMatch) return false;
      }
      return true;
    });
  }, [notes, activeCategory, debouncedSearch]);

  const handleQuickCapture = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;

    onAddNote({
      title: quickTitle.trim(),
      type: quickType,
      content: '',
      tags: [quickType],
    });

    setQuickTitle('');
  };

  const categories: { id: NoteType | 'all'; label: string; count: number }[] = [
    { id: 'all', label: 'All Notes', count: notes.length },
    { id: 'idea', label: 'Ideas', count: notes.filter((n) => n.type === 'idea').length },
    { id: 'hook', label: 'Hooks', count: notes.filter((n) => n.type === 'hook').length },
    { id: 'script', label: 'Scripts', count: notes.filter((n) => n.type === 'script').length },
    { id: 'research', label: 'Research', count: notes.filter((n) => n.type === 'research').length },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Quick Capture Bar */}
      <form
        onSubmit={handleQuickCapture}
        className="p-4 rounded-2xl bg-surface border border-border shadow-card flex flex-col sm:flex-row items-center gap-3"
      >
        <div className="flex items-center gap-2 flex-shrink-0">
          <Sparkles className="w-4 h-4 text-accent" />
          <select
            value={quickType}
            onChange={(e) => setQuickType(e.target.value as NoteType)}
            className="px-2.5 py-1.5 rounded-lg bg-surface-elevated border border-border text-xs font-semibold text-text-primary focus-ring cursor-pointer"
          >
            <option value="idea">💡 Idea</option>
            <option value="hook">⚡ Hook</option>
            <option value="script">📝 Script</option>
            <option value="research">🔍 Research</option>
          </select>
        </div>

        <input
          type="text"
          value={quickTitle}
          onChange={(e) => setQuickTitle(e.target.value)}
          placeholder="Quick idea capture: Type a concept or hook and press Enter..."
          className="flex-1 w-full px-3.5 py-2 rounded-xl bg-surface-elevated border border-border text-text-primary text-xs focus-ring placeholder:text-text-muted"
        />

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <Button type="submit" variant="primary" size="sm" disabled={!quickTitle.trim()}>
            Quick Save
          </Button>
          <Button type="button" variant="outline" size="sm" icon={Plus} onClick={onOpenNewModal}>
            Detailed Note
          </Button>
        </div>
      </form>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-surface border border-border shadow-card">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all focus-ring ${
                activeCategory === cat.id
                  ? 'bg-accent text-white shadow-sm'
                  : 'bg-surface-elevated text-text-secondary hover:text-text-primary border border-border'
              }`}
            >
              <span>{cat.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                activeCategory === cat.id ? 'bg-white/20 text-white' : 'bg-surface-muted text-text-muted'
              }`}>
                {cat.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search notes & hooks..."
            className="w-full pl-9 pr-8 py-1.5 rounded-xl bg-surface-elevated border border-border text-text-primary text-xs focus-ring placeholder:text-text-muted"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Notes Grid */}
      {filteredNotes.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title={searchTerm ? 'No matching notes' : 'Your vault is empty'}
          description={
            searchTerm
              ? `No notes match "${searchTerm}". Clear your search query to view all items.`
              : 'Save high-converting video hooks, B-roll ideas, and script outlines right here.'
          }
          actionLabel={searchTerm ? 'Clear Search' : 'Capture First Idea'}
          onAction={searchTerm ? () => setSearchTerm('') : onOpenNewModal}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNotes.map((note) => {
            const linked = note.contentId ? contentList.find((c) => c.id === note.contentId) : undefined;
            return (
              <NoteCard
                key={note.id}
                note={note}
                linkedContent={linked}
                onEdit={onEditNote}
                onDelete={onDeleteNote}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
