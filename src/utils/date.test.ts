import { describe, it, expect } from 'vitest';
import { 
  getTodayString, 
  parseLocalDate, 
  formatFriendlyDate, 
  isOverdue, 
  isToday, 
  isUpcoming, 
  getMonthMatrix 
} from './date';

describe('Date Utilities', () => {
  it('should return today string in YYYY-MM-DD format', () => {
    const today = getTodayString();
    expect(today).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('should parse local date correctly without timezone shift', () => {
    const parsed = parseLocalDate('2026-10-25');
    expect(parsed.getFullYear()).toBe(2026);
    expect(parsed.getMonth()).toBe(9); // 0-indexed October
    expect(parsed.getDate()).toBe(25);
  });

  it('should format friendly dates appropriately', () => {
    const today = getTodayString();
    expect(formatFriendlyDate(today)).toBe('Today');

    // Tomorrow
    const tmrw = parseLocalDate(today);
    tmrw.setDate(tmrw.getDate() + 1);
    const tmrwStr = `${tmrw.getFullYear()}-${String(tmrw.getMonth() + 1).padStart(2, '0')}-${String(tmrw.getDate()).padStart(2, '0')}`;
    expect(formatFriendlyDate(tmrwStr)).toBe('Tomorrow');

    // In 4 days
    const in4 = parseLocalDate(today);
    in4.setDate(in4.getDate() + 4);
    const in4Str = `${in4.getFullYear()}-${String(in4.getMonth() + 1).padStart(2, '0')}-${String(in4.getDate()).padStart(2, '0')}`;
    expect(formatFriendlyDate(in4Str)).toBe('In 4 days');

    expect(formatFriendlyDate('')).toBe('No deadline');
  });

  it('should accurately calculate isToday, isOverdue, and isUpcoming', () => {
    const today = getTodayString();
    expect(isToday(today)).toBe(true);
    expect(isOverdue(today)).toBe(false);

    // Yesterday
    const yest = parseLocalDate(today);
    yest.setDate(yest.getDate() - 1);
    const yestStr = `${yest.getFullYear()}-${String(yest.getMonth() + 1).padStart(2, '0')}-${String(yest.getDate()).padStart(2, '0')}`;
    expect(isOverdue(yestStr)).toBe(true);
    expect(isUpcoming(yestStr, 7)).toBe(false);

    // In 3 days
    const in3 = parseLocalDate(today);
    in3.setDate(in3.getDate() + 3);
    const in3Str = `${in3.getFullYear()}-${String(in3.getMonth() + 1).padStart(2, '0')}-${String(in3.getDate()).padStart(2, '0')}`;
    expect(isUpcoming(in3Str, 7)).toBe(true);
    expect(isUpcoming(in3Str, 2)).toBe(false);
  });

  it('should generate valid calendar month matrix with correct dimensions', () => {
    // October 2026 (starts on Thursday, 31 days)
    const matrix = getMonthMatrix(2026, 9);
    expect(matrix.length).toBeGreaterThanOrEqual(35);
    expect(matrix.length % 7).toBe(0);

    const currentMonthDays = matrix.filter((d) => d.isCurrentMonth);
    expect(currentMonthDays.length).toBe(31);
  });
});
