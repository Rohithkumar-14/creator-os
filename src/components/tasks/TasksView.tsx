import React, { useState, useMemo } from 'react';
import { 
  CheckSquare, 
  Plus, 
  Search, 
  X, 
  ArrowUpDown 
} from 'lucide-react';
import { ContentItem, TaskItem as ITaskItem, TaskPriority } from '../../types';
import { TaskItem } from './TaskItem';
import { Button } from '../common/Button';
import { EmptyState } from '../common/EmptyState';
import { isOverdue, isToday, isUpcoming } from '../../utils/date';
import { useDebounce } from '../../hooks/useDebounce';

interface TasksViewProps {
  tasks: ITaskItem[];
  contentList: ContentItem[];
  onToggleTask: (id: string) => void;
  onEditTask: (task: ITaskItem) => void;
  onDeleteTask: (id: string) => void;
  onOpenNewModal: () => void;
  onSelectContent?: (item: ContentItem) => void;
}

type TabFilter = 'all' | 'today' | 'upcoming' | 'completed';
type SortMode = 'dueDate' | 'priority';

const priorityWeight: Record<TaskPriority, number> = {
  urgent: 4,
  high: 3,
  medium: 2,
  low: 1,
};

export const TasksView: React.FC<TasksViewProps> = ({
  tasks,
  contentList,
  onToggleTask,
  onEditTask,
  onDeleteTask,
  onOpenNewModal,
  onSelectContent,
}) => {
  const [activeTab, setActiveTab] = useState<TabFilter>('all');
  const [selectedPriority, setSelectedPriority] = useState<TaskPriority | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortMode, setSortMode] = useState<SortMode>('dueDate');

  const debouncedSearch = useDebounce(searchTerm, 250);
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // Tab filter
      if (activeTab === 'today') {
        if (task.completed || (!isToday(task.dueDate) && !isOverdue(task.dueDate))) {
          return false;
        }
      } else if (activeTab === 'upcoming') {
        if (task.completed || !isUpcoming(task.dueDate, 14) || isToday(task.dueDate) || isOverdue(task.dueDate)) {
          return false;
        }
      } else if (activeTab === 'completed') {
        if (!task.completed) {
          return false;
        }
      }

      // Priority filter
      if (selectedPriority !== 'all' && task.priority !== selectedPriority) {
        return false;
      }

      // Search term
      if (debouncedSearch.trim()) {
        const q = debouncedSearch.toLowerCase().trim();
        const titleMatch = task.title.toLowerCase().includes(q);
        const descMatch = task.description?.toLowerCase().includes(q);
        if (!titleMatch && !descMatch) return false;
      }

      return true;
    });
  }, [tasks, activeTab, selectedPriority, debouncedSearch]);

  // Sort tasks
  const sortedTasks = useMemo(() => {
    return [...filteredTasks].sort((a, b) => {
      // Put incomplete tasks before completed
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }

      if (sortMode === 'priority') {
        const diff = priorityWeight[b.priority] - priorityWeight[a.priority];
        if (diff !== 0) return diff;
        return a.dueDate.localeCompare(b.dueDate);
      } else {
        const dateComp = a.dueDate.localeCompare(b.dueDate);
        if (dateComp !== 0) return dateComp;
        return priorityWeight[b.priority] - priorityWeight[a.priority];
      }
    });
  }, [filteredTasks, sortMode]);

  const tabs: { id: TabFilter; label: string; count: number }[] = [
    { id: 'all', label: 'All Tasks', count: tasks.filter((t) => !t.completed).length },
    { id: 'today', label: 'Today & Overdue', count: tasks.filter((t) => !t.completed && (isToday(t.dueDate) || isOverdue(t.dueDate))).length },
    { id: 'upcoming', label: 'Upcoming', count: tasks.filter((t) => !t.completed && isUpcoming(t.dueDate, 14) && !isToday(t.dueDate) && !isOverdue(t.dueDate)).length },
    { id: 'completed', label: 'Completed', count: tasks.filter((t) => t.completed).length },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-surface border border-border shadow-card">
        {/* Tabs */}
        <div className="flex flex-wrap gap-1.5">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all focus-ring ${
                activeTab === tab.id
                  ? 'bg-accent text-white shadow-sm'
                  : 'bg-surface-elevated text-text-secondary hover:text-text-primary border border-border'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-surface-muted text-text-muted'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Right controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search bar */}
          <div className="relative w-full sm:w-44">
            <Search className="w-3.5 h-3.5 text-text-muted absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search tasks..."
              className="w-full pl-8 pr-7 py-1.5 rounded-xl bg-surface-elevated border border-border text-text-primary text-xs focus-ring placeholder:text-text-muted"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary p-0.5"
                aria-label="Clear search"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Priority filter */}
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value as TaskPriority | 'all')}
            className="px-2.5 py-1.5 rounded-xl bg-surface-elevated border border-border text-xs font-medium text-text-primary focus-ring cursor-pointer"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">🔴 Urgent</option>
            <option value="high">🟠 High</option>
            <option value="medium">🔵 Medium</option>
            <option value="low">⚪ Low</option>
          </select>

          {/* Sort toggle */}
          <button
            type="button"
            onClick={() => setSortMode(sortMode === 'dueDate' ? 'priority' : 'dueDate')}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-surface-elevated border border-border text-xs font-medium text-text-secondary hover:text-text-primary focus-ring"
            title="Toggle sort by date or priority"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-accent" />
            <span className="hidden sm:inline">Sort: {sortMode === 'dueDate' ? 'Due Date' : 'Priority'}</span>
          </button>

          {/* New Task Button */}
          <Button variant="primary" size="sm" icon={Plus} onClick={onOpenNewModal}>
            Add Task
          </Button>
        </div>
      </div>

      {/* Task List */}
      {sortedTasks.length === 0 ? (
        <EmptyState
          icon={CheckSquare}
          title={
            activeTab === 'today'
              ? 'No tasks due today'
              : activeTab === 'completed'
              ? 'No completed tasks yet'
              : 'No tasks found'
          }
          description={
            activeTab === 'today'
              ? 'You have no pending tasks scheduled for today. Great job keeping your production queue clean!'
              : 'Add to-dos for recording B-roll, creating thumbnails, or fine-tuning sound design.'
          }
          actionLabel="Create Task"
          onAction={onOpenNewModal}
        />
      ) : (
        <div className="space-y-3">
          {sortedTasks.map((task) => {
            const linked = task.contentId ? contentList.find((c) => c.id === task.contentId) : undefined;
            return (
              <TaskItem
                key={task.id}
                task={task}
                linkedContent={linked}
                onToggle={onToggleTask}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
                onSelectContent={onSelectContent}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
