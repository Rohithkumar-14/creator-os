import React from 'react';
import { 
  Plus, 
  Film, 
  Sparkles, 
  CheckSquare, 
  ArrowRight, 
  Layers, 
  Info 
} from 'lucide-react';
import { ContentItem, NavigationTab, TaskItem, DiaryNote } from '../../types';
import { SummaryCards } from './SummaryCards';
import { DeadlinesWidget } from './DeadlinesWidget';
import { Button } from '../common/Button';
import { PlatformBadge, StageBadge } from '../common/Badge';
import { formatFriendlyDate } from '../../utils/date';

interface DashboardViewProps {
  content: ContentItem[];
  tasks: TaskItem[];
  notes: DiaryNote[];
  metrics: {
    totalContent: number;
    publishedCount: number;
    inProductionCount: number;
    pendingTasksCount: number;
    urgentTasksCount: number;
    savedIdeasCount: number;
    stageBreakdown: Record<string, number>;
  };
  onNavigate: (tab: NavigationTab) => void;
  onSelectContent: (item: ContentItem) => void;
  onToggleTask: (id: string) => void;
  onOpenNewContent: () => void;
  onOpenNewTask: () => void;
  onOpenNewNote: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  content,
  tasks,
  notes,
  metrics,
  onNavigate,
  onSelectContent,
  onToggleTask,
  onOpenNewContent,
  onOpenNewTask,
  onOpenNewNote,
}) => {
  const activeContent = content.filter((c) => !c.isArchived);
  const recentContent = [...activeContent].slice(0, 4);

  const stages = [
    { key: 'idea', label: 'Ideas', color: 'bg-amber-500' },
    { key: 'research', label: 'Research', color: 'bg-blue-500' },
    { key: 'scripting', label: 'Scripting', color: 'bg-purple-500' },
    { key: 'recording', label: 'Recording', color: 'bg-rose-500' },
    { key: 'editing', label: 'Editing', color: 'bg-indigo-500' },
    { key: 'published', label: 'Published', color: 'bg-emerald-500' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Sample Data Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-accent/10 border border-accent/25 text-xs">
        <div className="flex items-center gap-2.5">
          <span className="p-1.5 rounded-lg bg-accent/20 text-accent flex-shrink-0">
            <Info className="w-4 h-4" />
          </span>
          <p className="text-text-primary leading-tight">
            <strong className="font-semibold text-accent">Sample Workspace Data:</strong> Preloaded with realistic YouTube tech deep-dives and Instagram Reels workflows. You can customize, edit, or reset anytime in Settings.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
          <Button
            variant="outline"
            size="sm"
            icon={Sparkles}
            onClick={onOpenNewNote}
            className="text-xs py-1"
          >
            Capture Idea
          </Button>
          <Button
            variant="outline"
            size="sm"
            icon={CheckSquare}
            onClick={onOpenNewTask}
            className="text-xs py-1"
          >
            Add Task
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={onOpenNewContent}
            className="text-xs py-1"
          >
            New Video
          </Button>
        </div>
      </div>

      {/* Primary Summary Metric Cards */}
      <SummaryCards
        content={content}
        tasks={tasks}
        notesCount={notes.length}
        onNavigate={onNavigate}
      />

      {/* Production Pipeline Funnel Breakdown */}
      <div className="p-5 rounded-2xl bg-surface border border-border shadow-card space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-accent" />
            <h3 className="text-sm font-bold text-text-primary tracking-tight">
              Production Pipeline Distribution
            </h3>
          </div>
          <span className="text-xs text-text-muted">
            {metrics.totalContent} total items in active catalog
          </span>
        </div>

        {/* Visual Pipeline Bar */}
        <div className="h-3 w-full bg-surface-muted rounded-full overflow-hidden flex border border-border">
          {stages.map((st) => {
            const count = metrics.stageBreakdown[st.key] || 0;
            const percentage = metrics.totalContent > 0 ? (count / metrics.totalContent) * 100 : 0;
            if (percentage === 0) return null;

            return (
              <div
                key={st.key}
                style={{ width: `${percentage}%` }}
                className={`h-full ${st.color} transition-all duration-300 relative group cursor-pointer`}
                title={`${st.label}: ${count} (${Math.round(percentage)}%)`}
              />
            );
          })}
        </div>

        {/* Pipeline Stage Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-1">
          {stages.map((st) => {
            const count = metrics.stageBreakdown[st.key] || 0;
            return (
              <div
                key={st.key}
                onClick={() => onNavigate('planner')}
                className="flex items-center justify-between p-2.5 rounded-xl bg-surface-elevated/40 border border-border hover:bg-surface-elevated transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${st.color}`} />
                  <span className="text-xs font-medium text-text-secondary">{st.label}</span>
                </div>
                <span className="text-xs font-bold text-text-primary">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Deadlines and Actions Widget */}
      <DeadlinesWidget
        content={content}
        tasks={tasks}
        onSelectContent={onSelectContent}
        onToggleTask={onToggleTask}
      />

      {/* Bottom Section: Active Projects Quick List & Rapid Creation */}
      <div className="p-5 rounded-2xl bg-surface border border-border shadow-card">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
          <div>
            <h3 className="text-sm font-bold text-text-primary tracking-tight">
              Active Video Projects
            </h3>
            <p className="text-xs text-text-muted">Recently updated video pipelines</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            icon={ArrowRight}
            iconPosition="right"
            onClick={() => onNavigate('planner')}
            className="text-xs"
          >
            Open Full Planner
          </Button>
        </div>

        {recentContent.length === 0 ? (
          <div className="text-center py-8">
            <Film className="w-8 h-8 text-text-muted mx-auto mb-2" />
            <p className="text-sm font-medium text-text-primary">No active video projects</p>
            <p className="text-xs text-text-secondary mt-1 mb-4">Start planning your next YouTube video or Instagram Reel.</p>
            <Button variant="primary" size="sm" icon={Plus} onClick={onOpenNewContent}>
              Create Video Project
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {recentContent.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectContent(item)}
                className="p-3.5 rounded-xl bg-surface-elevated/40 border border-border hover:border-accent/40 hover:bg-surface-elevated transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <PlatformBadge platform={item.platform} size="sm" />
                      <StageBadge stage={item.stage} size="sm" />
                    </div>
                    <span className="text-xs text-text-muted">
                      Due: {formatFriendlyDate(item.dueDate)}
                    </span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-semibold text-text-primary group-hover:text-accent transition-colors line-clamp-1">
                    {item.title}
                  </h4>
                  {item.scriptNotes && (
                    <p className="text-xs text-text-secondary line-clamp-2 mt-1 font-mono text-[11px]">
                      {item.scriptNotes}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 mt-2 border-t border-border/50 text-xs">
                  <span className="text-[11px] text-text-muted">
                    {Object.values(item.checklist || {}).filter(Boolean).length}/7 milestones complete
                  </span>
                  <span className="text-accent font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform text-xs">
                    View Studio <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
