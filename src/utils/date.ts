/**
 * Utility functions for reliable date formatting and comparison
 * using local timezone without UTC offset surprises.
 */

export function getTodayString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseLocalDate(dateStr: string): Date {
  if (!dateStr) return new Date();
  const [yearStr, monthStr, dayStr] = dateStr.split('-');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10) - 1;
  const day = parseInt(dayStr, 10);
  return new Date(year, month, day);
}

export function formatFriendlyDate(dateStr: string): string {
  if (!dateStr) return 'No deadline';
  const today = getTodayString();
  
  if (dateStr === today) {
    return 'Today';
  }

  const parsed = parseLocalDate(dateStr);
  const todayDate = parseLocalDate(today);
  const diffTime = parsed.getTime() - todayDate.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) return 'Tomorrow';
  if (diffDays === -1) return 'Yesterday';
  if (diffDays > 1 && diffDays <= 7) return `In ${diffDays} days`;
  if (diffDays < -1 && diffDays >= -7) return `${Math.abs(diffDays)}d ago`;

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[parsed.getMonth()]} ${parsed.getDate()}, ${parsed.getFullYear()}`;
}

export function isOverdue(dateStr: string): boolean {
  if (!dateStr) return false;
  const today = getTodayString();
  return dateStr < today;
}

export function isToday(dateStr: string): boolean {
  if (!dateStr) return false;
  return dateStr === getTodayString();
}

export function isUpcoming(dateStr: string, withinDays: number = 7): boolean {
  if (!dateStr) return false;
  const today = getTodayString();
  if (dateStr < today) return false;
  
  const parsed = parseLocalDate(dateStr);
  const todayDate = parseLocalDate(today);
  const diffTime = parsed.getTime() - todayDate.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= withinDays;
}

export interface CalendarDay {
  dateString: string;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isPast: boolean;
}

export function getMonthMatrix(year: number, monthIndex: number): CalendarDay[] {
  const firstDayOfMonth = new Date(year, monthIndex, 1);
  const startingDayOfWeek = firstDayOfMonth.getDay(); // 0 is Sunday
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, monthIndex, 0).getDate();
  
  const today = getTodayString();
  const days: CalendarDay[] = [];

  // Previous month trailing days
  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i;
    const prevMonth = monthIndex === 0 ? 11 : monthIndex - 1;
    const prevYear = monthIndex === 0 ? year - 1 : year;
    const dateString = `${prevYear}-${String(prevMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    days.push({
      dateString,
      dayNumber: day,
      isCurrentMonth: false,
      isToday: dateString === today,
      isPast: dateString < today,
    });
  }

  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    const dateString = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    days.push({
      dateString,
      dayNumber: day,
      isCurrentMonth: true,
      isToday: dateString === today,
      isPast: dateString < today,
    });
  }

  // Next month leading days to complete full grid (multiple of 7, up to 42)
  const remaining = (7 - (days.length % 7)) % 7;
  const targetTotal = days.length + remaining < 35 ? 35 : (days.length + remaining <= 42 ? days.length + remaining : 42);
  const needed = targetTotal - days.length;
  
  for (let day = 1; day <= needed; day++) {
    const nextMonth = monthIndex === 11 ? 0 : monthIndex + 1;
    const nextYear = monthIndex === 11 ? year + 1 : year;
    const dateString = `${nextYear}-${String(nextMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    days.push({
      dateString,
      dayNumber: day,
      isCurrentMonth: false,
      isToday: dateString === today,
      isPast: dateString < today,
    });
  }

  return days;
}
