import React from 'react';
import { ContentItem, TaskItem } from '../../types';
import { formatFriendlyDate, isOverdue, isToday } from '../../utils/date';
import { PlatformBadge, StageBadge, PriorityBadge } from '../common/Badge';
import { Clock, AlertCircle, CheckCircle2, ChevronRight, Calendar } from 'lucide-react';

interface DeadlinesWidgetProps {
  content: ContentItem[];
  tasks: TaskItem[];
  onSelectContent: (item: ContentItem) => void;
  onToggleTask: (id: string) => void;
}

export const DeadlinesWidget: React.FC<DeadlinesWidgetProps> = ({
  content,
  tasks,
  onSelectContent,
  onToggleTask,
}) => {
  const activeContent = content.filter((c) => !c.isArchived && c.stage !== 'published');
  
  // Sort upcoming content by due date ascending
  const sortedUpcoming = [...activeContent].sort((a, b) => a.dueDate.localeCompare(b.dueDate)).slice(0, 5);

  // Today's priority tasks + overdue tasks
  const pendingTasks = tasks.filter((t) => !t.completed);
  const todaysTasks = pendingTasks
    .filter((t) => isToday(t.dueDate) || isOverdue(t.dueDate) || t.priority === 'urgent')
    .sort((a, b) => {
      if (a.priority === 'urgent') return -1;
      if (b.priority === 'urgent') return 1;
      return a.dueDate.localeCompare(b.dueDate);
    })
    .slice(0, 5);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Approaching Deadlines Card */}
      <div className="p-5 rounded-2xl bg-surface border border-border shadow-card flex flex-col">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-accent" />
            <h3 className="text-sm font-bold text-text-primary tracking-tight">
              Approaching Deadlines
            </h3>
          </div>
          <span className="text-xs text-text-muted">
            {sortedUpcoming.length} tracked
          </span>
        </div>

        {sortedUpcoming.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-xs text-text-muted">
            <CheckCircle2 className="w-8 h-8 text-status-success/60 mb-2" />
            <p className="font-medium text-text-secondary">No immediate deadlines!</p>
            <p>You're all caught up with scheduled video releases.</p>
          </div>
        ) : (
          <div className="space-y-2.5 flex-1">
            {sortedUpcoming.map((item) => {
              const overdue = isOverdue(item.dueDate);
              const dueToday = isToday(item.dueDate);

              return (
                <div
                  key={item.id}
                  onClick={() => onSelectContent(item)}
                  className="flex items-center justify-between p-3 rounded-xl bg-surface-elevated/40 border border-border hover:border-accent/40 hover:bg-surface-elevated transition-all cursor-pointer group"
                >
                  <div className="flex-1 min-w-0 pr-3">
                    <div className="flex items-center gap-2 mb-1">
                      <PlatformBadge platform={item.platform} size="sm" />
                      <StageBadge stage={item.stage} size="sm" />
                    </div>
                    <h4 className="text-xs font-semibold text-text-primary truncate group-hover:text-accent transition-colors">
                      {item.title}
                    </h4>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0 text-right">
                    <div className="text-xs">
                      <span className={`font-semibold flex items-center gap-1 ${
                        overdue
                          ? 'text-status-error'
                          : dueToday
                          ? 'text-amber-400'
                          : 'text-text-secondary'
                      }`}>
                        {overdue && <AlertCircle className="w-3 h-3 flex-shrink-0" />}
                        {formatFriendlyDate(item.dueDate)}
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-text-primary group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Today's Focus & Action Tasks */}
      <div className="p-5 rounded-2xl bg-surface border border-border shadow-card flex flex-col">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-text-primary tracking-tight">
              Today's Priorities & Actions
            </h3>
          </div>
          <span className="text-xs text-text-muted">
            {todaysTasks.length} pending
          </span>
        </div>

        {todaysTasks.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-xs text-text-muted">
            <CheckCircle2 className="w-8 h-8 text-status-success/60 mb-2" />
            <p className="font-medium text-text-secondary">All daily priorities completed!</p>
            <p>Great job staying on top of your production queue.</p>
          </div>
        ) : (
          <div className="space-y-2.5 flex-1">
            {todaysTasks.map((task) => {
              const overdue = isOverdue(task.dueDate);

              return (
                <div
                  key={task.id}
                  onClick={() => onToggleTask(task.id)}
                  className="flex items-center justify-between p-3 rounded-xl bg-surface-elevated/40 border border-border hover:border-accent/40 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3 min-w-0 pr-3">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => onToggleTask(task.id)}
                      className="rounded border-border text-accent focus:ring-accent w-4 h-4 cursor-pointer"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-text-primary truncate group-hover:text-accent transition-colors">
                        {task.title}
                      </p>
                      <span className="text-[11px] text-text-muted flex items-center gap-1 mt-0.5">
                        Due: {formatFriendlyDate(task.dueDate)}
                        {overdue && <span className="text-status-error font-semibold">• Overdue</span>}
                      </span>
                    </div>
                  </div>

                  <PriorityBadge priority={task.priority} size="sm" />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
