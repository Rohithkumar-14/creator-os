import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Kanban, 
  Table as TableIcon, 
  X, 
  Archive, 
  Film 
} from 'lucide-react';
import { ContentItem, ContentStage, Platform } from '../../types';
import { Button } from '../common/Button';
import { ContentTable } from './ContentTable';
import { ContentKanban } from './ContentKanban';
import { EmptyState } from '../common/EmptyState';
import { useDebounce } from '../../hooks/useDebounce';

interface ContentPlannerViewProps {
  content: ContentItem[];
  onSelect: (item: ContentItem) => void;
  onEdit: (item: ContentItem) => void;
  onArchive: (id: string, archive: boolean) => void;
  onDelete: (id: string) => void;
  onUpdateStage: (id: string, stage: ContentStage) => void;
  onOpenNewModal: (defaultStage?: ContentStage) => void;
}

export const ContentPlannerView: React.FC<ContentPlannerViewProps> = ({
  content,
  onSelect,
  onEdit,
  onArchive,
  onDelete,
  onUpdateStage,
  onOpenNewModal,
}) => {
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | 'all'>('all');
  const [selectedStage, setSelectedStage] = useState<ContentStage | 'all'>('all');
  const [showArchived, setShowArchived] = useState(false);

  const debouncedSearch = useDebounce(searchTerm, 250);

  // Filter content
  const filteredContent = useMemo(() => {
    return content.filter((item) => {
      // Archive filter
      if (showArchived ? !item.isArchived : item.isArchived) {
        return false;
      }

      // Platform filter
      if (selectedPlatform !== 'all' && item.platform !== selectedPlatform) {
        return false;
      }

      // Stage filter
      if (selectedStage !== 'all' && item.stage !== selectedStage) {
        return false;
      }

      // Search term
      if (debouncedSearch.trim()) {
        const query = debouncedSearch.toLowerCase().trim();
        const titleMatch = item.title.toLowerCase().includes(query);
        const scriptMatch = item.scriptNotes?.toLowerCase().includes(query);
        const tagMatch = item.tags.some((t) => t.toLowerCase().includes(query));
        if (!titleMatch && !scriptMatch && !tagMatch) {
          return false;
        }
      }

      return true;
    });
  }, [content, showArchived, selectedPlatform, selectedStage, debouncedSearch]);

  const hasActiveFilters = searchTerm !== '' || selectedPlatform !== 'all' || selectedStage !== 'all' || showArchived;

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedPlatform('all');
    setSelectedStage('all');
    setShowArchived(false);
  };

  return (
    <div className="space-y-5 max-w-7xl mx-auto pb-12">
      {/* Top Filter and Controls Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 rounded-2xl bg-surface border border-border shadow-card">
        {/* Left: Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search titles, hooks, or #tags..."
            className="w-full pl-9 pr-9 py-2 rounded-xl bg-surface-elevated border border-border text-text-primary text-xs focus-ring placeholder:text-text-muted"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary p-0.5"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Center / Right: Filters and View toggles */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Platform Filter */}
          <select
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value as Platform | 'all')}
            className="px-3 py-1.5 rounded-xl bg-surface-elevated border border-border text-text-primary text-xs focus-ring cursor-pointer"
          >
            <option value="all">All Platforms</option>
            <option value="youtube">YouTube Only</option>
            <option value="instagram">Instagram Only</option>
          </select>

          {/* Stage Filter */}
          <select
            value={selectedStage}
            onChange={(e) => setSelectedStage(e.target.value as ContentStage | 'all')}
            className="px-3 py-1.5 rounded-xl bg-surface-elevated border border-border text-text-primary text-xs focus-ring cursor-pointer"
          >
            <option value="all">All Stages</option>
            <option value="idea">Idea Backlog</option>
            <option value="research">Research</option>
            <option value="scripting">Scripting</option>
            <option value="recording">Recording</option>
            <option value="editing">Editing</option>
            <option value="published">Published</option>
          </select>

          {/* Archive Toggle Button */}
          <button
            type="button"
            onClick={() => setShowArchived(!showArchived)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-colors focus-ring ${
              showArchived
                ? 'bg-accent/15 border-accent text-accent font-semibold'
                : 'bg-surface-elevated border-border text-text-secondary hover:text-text-primary'
            }`}
          >
            <Archive className="w-3.5 h-3.5" />
            <span>{showArchived ? 'Viewing Archived' : 'Archived'}</span>
          </button>

          {/* Clear filters if any active */}
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={handleClearFilters} className="text-xs py-1">
              Reset
            </Button>
          )}

          {/* View switcher: Kanban vs Table */}
          <div className="flex items-center bg-surface-elevated p-1 rounded-xl border border-border">
            <button
              type="button"
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-lg text-xs font-medium transition-colors focus-ring ${
                viewMode === 'kanban'
                  ? 'bg-accent text-white shadow-sm'
                  : 'text-text-muted hover:text-text-primary'
              }`}
              title="Kanban Board View"
              aria-label="Kanban Board View"
            >
              <Kanban className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs font-medium transition-colors focus-ring ${
                viewMode === 'table'
                  ? 'bg-accent text-white shadow-sm'
                  : 'text-text-muted hover:text-text-primary'
              }`}
              title="Table View"
              aria-label="Table View"
            >
              <TableIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Primary Create Button */}
          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={() => onOpenNewModal()}
            className="shadow-sm"
          >
            New Video
          </Button>
        </div>
      </div>

      {/* Main View Area */}
      {filteredContent.length === 0 ? (
        <EmptyState
          icon={Film}
          title={showArchived ? 'No archived video projects' : 'No video projects found'}
          description={
            hasActiveFilters
              ? 'No projects match your current filters or search terms. Try clearing or relaxing your search query.'
              : 'You have not created any video projects yet. Click New Video to plan your next YouTube or Instagram content!'
          }
          actionLabel={hasActiveFilters ? 'Clear All Filters' : 'Create First Video'}
          onAction={hasActiveFilters ? handleClearFilters : () => onOpenNewModal()}
        />
      ) : viewMode === 'kanban' ? (
        <ContentKanban
          content={filteredContent}
          onSelect={onSelect}
          onUpdateStage={onUpdateStage}
          onAddNew={onOpenNewModal}
        />
      ) : (
        <ContentTable
          content={filteredContent}
          onSelect={onSelect}
          onEdit={onEdit}
          onArchive={onArchive}
          onDelete={onDelete}
        />
      )}
    </div>
  );
};
