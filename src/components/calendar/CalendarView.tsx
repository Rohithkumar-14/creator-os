import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Film, 
  CheckSquare,
  Plus 
} from 'lucide-react';
import { ContentItem, TaskItem } from '../../types';
import { getMonthMatrix, getTodayString, parseLocalDate, formatFriendlyDate } from '../../utils/date';
import { Button } from '../common/Button';
import { PlatformBadge, PriorityBadge } from '../common/Badge';

interface CalendarViewProps {
  content: ContentItem[];
  tasks: TaskItem[];
  onSelectContent: (item: ContentItem) => void;
  onToggleTask: (id: string) => void;
  onOpenNewContentWithDate: (dateStr: string) => void;
  onOpenNewTaskWithDate: (dateStr: string) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  content,
  tasks,
  onSelectContent,
  onToggleTask,
  onOpenNewContentWithDate,
  onOpenNewTaskWithDate,
}) => {
  const todayStr = getTodayString();
  const todayParsed = parseLocalDate(todayStr);

  const [currentYear, setCurrentYear] = useState(todayParsed.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(todayParsed.getMonth()); // 0-11
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const matrix = getMonthMatrix(currentYear, currentMonth);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleToday = () => {
    setCurrentYear(todayParsed.getFullYear());
    setCurrentMonth(todayParsed.getMonth());
    setSelectedDate(todayStr);
  };

  // Find events for the selected date
  const selectedDayContent = content.filter(
    (c) => !c.isArchived && (c.dueDate === selectedDate || c.publishDate === selectedDate)
  );

  const selectedDayTasks = tasks.filter((t) => t.dueDate === selectedDate);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Calendar Header Controls */}
      <div className="p-4 rounded-2xl bg-surface border border-border shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h2 className="text-base sm:text-lg font-bold text-text-primary tracking-tight">
            {months[currentMonth]} {currentYear}
          </h2>
          <Button variant="outline" size="sm" onClick={handleToday} className="text-xs py-1">
            Today
          </Button>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Create for selected day */}
          <Button
            variant="secondary"
            size="sm"
            icon={Film}
            onClick={() => onOpenNewContentWithDate(selectedDate)}
            className="text-xs"
          >
            + Video
          </Button>

          <Button
            variant="secondary"
            size="sm"
            icon={CheckSquare}
            onClick={() => onOpenNewTaskWithDate(selectedDate)}
            className="text-xs"
          >
            + Task
          </Button>

          {/* Month Navigation Buttons */}
          <div className="flex items-center bg-surface-elevated rounded-xl border border-border p-1">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-hover focus-ring"
              title="Previous month"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-hover focus-ring"
              title="Next month"
              aria-label="Next month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Month Matrix Grid */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-surface border border-border shadow-card">
          {/* Day of Week Header */}
          <div className="grid grid-cols-7 mb-2 text-center text-xs font-bold text-text-muted uppercase tracking-wider">
            {daysOfWeek.map((day) => (
              <div key={day} className="py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1.5">
            {matrix.map((cell) => {
              const dayContent = content.filter(
                (c) => !c.isArchived && (c.dueDate === cell.dateString || c.publishDate === cell.dateString)
              );
              const dayTasks = tasks.filter((t) => t.dueDate === cell.dateString && !t.completed);
              const isSelected = selectedDate === cell.dateString;

              return (
                <button
                  key={cell.dateString}
                  type="button"
                  onClick={() => setSelectedDate(cell.dateString)}
                  className={`min-h-[72px] sm:min-h-[85px] p-2 rounded-xl border text-left flex flex-col justify-between transition-all focus-ring ${
                    isSelected
                      ? 'border-accent bg-accent/10 shadow-sm'
                      : cell.isCurrentMonth
                      ? 'border-border/60 bg-surface-elevated/40 hover:bg-surface-elevated'
                      : 'border-border/30 bg-surface/20 opacity-40 hover:opacity-75'
                  }`}
                  aria-label={`Select date ${cell.dateString}`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full ${
                        cell.isToday
                          ? 'bg-accent text-white shadow-sm'
                          : isSelected
                          ? 'text-accent'
                          : 'text-text-primary'
                      }`}
                    >
                      {cell.dayNumber}
                    </span>

                    {/* Total event counter badge if multiple */}
                    {dayContent.length + dayTasks.length > 0 && (
                      <span className="text-[10px] font-semibold text-text-muted">
                        {dayContent.length + dayTasks.length}
                      </span>
                    )}
                  </div>

                  {/* Visual Event Markers */}
                  <div className="space-y-1 w-full overflow-hidden mt-1">
                    {/* Content markers */}
                    {dayContent.slice(0, 2).map((item) => (
                      <div
                        key={item.id}
                        className={`text-[10px] font-medium px-1.5 py-0.5 rounded truncate flex items-center gap-1 ${
                          item.platform === 'youtube'
                            ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                            : 'bg-pink-500/20 text-pink-300 border border-pink-500/30'
                        }`}
                        title={item.title}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${item.platform === 'youtube' ? 'bg-red-400' : 'bg-pink-400'}`} />
                        <span className="truncate">{item.title}</span>
                      </div>
                    ))}

                    {/* Tasks marker */}
                    {dayTasks.length > 0 && dayContent.length < 2 && (
                      <div className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/25 truncate flex items-center gap-1">
                        <CheckSquare className="w-2.5 h-2.5 flex-shrink-0" />
                        <span className="truncate">{dayTasks.length} task{dayTasks.length > 1 ? 's' : ''}</span>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Date Detail Sidebar */}
        <div className="p-5 rounded-2xl bg-surface border border-border shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-border">
              <div>
                <h3 className="text-sm font-bold text-text-primary">
                  {formatFriendlyDate(selectedDate)}
                </h3>
                <span className="text-xs text-text-muted">{selectedDate}</span>
              </div>

              {selectedDate === todayStr && (
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-accent/15 text-accent border border-accent/25">
                  Today
                </span>
              )}
            </div>

            {/* Video projects for selected day */}
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted mb-2 flex items-center gap-1.5">
                  <Film className="w-3.5 h-3.5 text-accent" />
                  Video Deadlines ({selectedDayContent.length})
                </h4>

                {selectedDayContent.length === 0 ? (
                  <p className="text-xs text-text-muted italic p-3 rounded-xl bg-surface-elevated/40 border border-border">
                    No video releases or deadlines scheduled for this day.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {selectedDayContent.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => onSelectContent(item)}
                        className="p-3 rounded-xl bg-surface-elevated border border-border hover:border-accent/40 transition-all cursor-pointer group"
                      >
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <PlatformBadge platform={item.platform} size="sm" />
                          <span className="text-[10px] text-text-muted capitalize">
                            {item.stage}
                          </span>
                        </div>
                        <h5 className="text-xs font-semibold text-text-primary group-hover:text-accent transition-colors line-clamp-1">
                          {item.title}
                        </h5>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Tasks for selected day */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted mb-2 flex items-center gap-1.5">
                  <CheckSquare className="w-3.5 h-3.5 text-amber-400" />
                  Tasks Due ({selectedDayTasks.length})
                </h4>

                {selectedDayTasks.length === 0 ? (
                  <p className="text-xs text-text-muted italic p-3 rounded-xl bg-surface-elevated/40 border border-border">
                    No production tasks due on this date.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {selectedDayTasks.map((task) => (
                      <div
                        key={task.id}
                        onClick={() => onToggleTask(task.id)}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-surface-elevated border border-border text-xs cursor-pointer hover:border-accent/40 transition-colors"
                      >
                        <div className="flex items-center gap-2 truncate pr-2">
                          <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => onToggleTask(task.id)}
                            className="rounded border-border text-accent focus:ring-accent"
                          />
                          <span className={`truncate font-medium ${task.completed ? 'line-through text-text-muted' : 'text-text-primary'}`}>
                            {task.title}
                          </span>
                        </div>
                        <PriorityBadge priority={task.priority} size="sm" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Add for Selected Day */}
          <div className="pt-4 mt-6 border-t border-border flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={Plus}
              onClick={() => onOpenNewContentWithDate(selectedDate)}
              className="flex-1 text-xs"
            >
              Plan Video
            </Button>
            <Button
              variant="outline"
              size="sm"
              icon={Plus}
              onClick={() => onOpenNewTaskWithDate(selectedDate)}
              className="flex-1 text-xs"
            >
              Add Task
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
