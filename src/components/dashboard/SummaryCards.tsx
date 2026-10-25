import React from 'react';
import { 
  Film, 
  CheckSquare, 
  Clock, 
  Lightbulb, 
  ArrowRight 
} from 'lucide-react';
import { ContentItem, NavigationTab, TaskItem } from '../../types';
import { isUpcoming } from '../../utils/date';

interface SummaryCardsProps {
  content: ContentItem[];
  tasks: TaskItem[];
  notesCount: number;
  onNavigate: (tab: NavigationTab) => void;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({
  content,
  tasks,
  notesCount,
  onNavigate,
}) => {
  const activeContent = content.filter((c) => !c.isArchived);
  const pendingTasks = tasks.filter((t) => !t.completed);
  const urgentTasks = pendingTasks.filter((t) => t.priority === 'urgent' || t.priority === 'high');
  const upcomingDeadlines = activeContent.filter((c) => isUpcoming(c.dueDate, 7) && c.stage !== 'published');

  const ytCount = activeContent.filter((c) => c.platform === 'youtube').length;
  const igCount = activeContent.filter((c) => c.platform === 'instagram').length;

  const cards = [
    {
      title: 'Active Content',
      value: activeContent.length,
      subtitle: `${ytCount} YouTube • ${igCount} Reels`,
      icon: Film,
      color: 'from-accent/20 to-purple-600/10 text-accent',
      borderColor: 'hover:border-accent/40',
      tab: 'planner' as NavigationTab,
    },
    {
      title: 'Tasks In Progress',
      value: pendingTasks.length,
      subtitle: urgentTasks.length > 0 ? `${urgentTasks.length} urgent / high priority` : 'All priorities managed',
      icon: CheckSquare,
      color: 'from-amber-500/20 to-yellow-600/10 text-amber-400',
      borderColor: 'hover:border-amber-500/40',
      tab: 'tasks' as NavigationTab,
    },
    {
      title: '7-Day Deadlines',
      value: upcomingDeadlines.length,
      subtitle: upcomingDeadlines.length === 1 ? '1 video due this week' : `${upcomingDeadlines.length} videos due this week`,
      icon: Clock,
      color: 'from-rose-500/20 to-pink-600/10 text-rose-400',
      borderColor: 'hover:border-rose-500/40',
      tab: 'calendar' as NavigationTab,
    },
    {
      title: 'Idea Vault',
      value: notesCount,
      subtitle: 'Hooks, scripts & inspirations',
      icon: Lightbulb,
      color: 'from-blue-500/20 to-cyan-600/10 text-blue-400',
      borderColor: 'hover:border-blue-500/40',
      tab: 'diary' as NavigationTab,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c, i) => {
        const Icon = c.icon;
        return (
          <div
            key={i}
            onClick={() => onNavigate(c.tab)}
            className={`p-5 rounded-2xl bg-surface border border-border shadow-card transition-all duration-200 ${c.borderColor} hover:-translate-y-0.5 cursor-pointer group relative overflow-hidden`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                {c.title}
              </span>
              <div className={`p-2 rounded-xl bg-gradient-to-br ${c.color} border border-border/50`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-3xl font-extrabold text-text-primary tracking-tight">
                {c.value}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-xs text-text-secondary truncate">
                {c.subtitle}
              </p>
              <ArrowRight className="w-3.5 h-3.5 text-text-muted opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
            </div>
          </div>
        );
      })}
    </div>
  );
};
