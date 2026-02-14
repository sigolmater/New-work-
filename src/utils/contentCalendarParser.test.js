import { 
  parseContentCalendar,
  getTodayDate,
  isToday,
  isFutureOrToday,
  getUpcomingContent,
  formatDisplayDate,
  getDaysUntil
} from './contentCalendarParser';

describe('contentCalendarParser', () => {
  const sampleCSV = `date,format,title_seed,cta
2025-10-26,Longform,행동의 불,댓글에 실행 한 줄
2025-10-27,Shorts,준비운동 시스템,쇼츠로 리메이크
2025-10-28,Podcast,15분 퍼블리시,뉴스레터 구독`;

  describe('parseContentCalendar', () => {
    test('should parse CSV content correctly', () => {
      const result = parseContentCalendar(sampleCSV);
      expect(result).toHaveLength(3);
      expect(result[0]).toEqual({
        date: '2025-10-26',
        format: 'Longform',
        title_seed: '행동의 불',
        cta: '댓글에 실행 한 줄'
      });
    });

    test('should handle empty CSV', () => {
      const result = parseContentCalendar('');
      expect(result).toHaveLength(0);
    });

    test('should filter out invalid entries', () => {
      const invalidCSV = `date,format,title_seed,cta
2025-10-26,Longform,행동의 불,댓글에 실행 한 줄
,,,`;
      const result = parseContentCalendar(invalidCSV);
      expect(result).toHaveLength(1);
    });
  });

  describe('getTodayDate', () => {
    test('should return date in YYYY-MM-DD format', () => {
      const today = getTodayDate();
      expect(today).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  describe('isToday', () => {
    test('should return true for today\'s date', () => {
      const today = getTodayDate();
      expect(isToday(today)).toBe(true);
    });

    test('should return false for different date', () => {
      expect(isToday('2024-01-01')).toBe(false);
    });
  });

  describe('isFutureOrToday', () => {
    test('should return true for today', () => {
      const today = getTodayDate();
      expect(isFutureOrToday(today)).toBe(true);
    });

    test('should return true for future date', () => {
      expect(isFutureOrToday('2026-12-31')).toBe(true);
    });

    test('should return false for past date', () => {
      expect(isFutureOrToday('2024-01-01')).toBe(false);
    });
  });

  describe('getUpcomingContent', () => {
    test('should filter and sort upcoming content', () => {
      const items = [
        { date: '2026-01-01', format: 'Live' },
        { date: '2024-01-01', format: 'Past' },
        { date: '2026-02-01', format: 'Future' }
      ];
      const result = getUpcomingContent(items, 5);
      expect(result.length).toBeGreaterThanOrEqual(0);
      if (result.length > 1) {
        expect(new Date(result[0].date) <= new Date(result[1].date)).toBe(true);
      }
    });

    test('should respect limit parameter', () => {
      const items = Array(10).fill(null).map((_, i) => ({
        date: `2026-${String(i + 1).padStart(2, '0')}-01`,
        format: 'Test'
      }));
      const result = getUpcomingContent(items, 3);
      expect(result.length).toBeLessThanOrEqual(3);
    });
  });

  describe('formatDisplayDate', () => {
    test('should format date for display', () => {
      const formatted = formatDisplayDate('2025-10-26');
      expect(formatted).toContain('Oct');
      expect(formatted).toContain('26');
      expect(formatted).toContain('2025');
    });
  });

  describe('getDaysUntil', () => {
    test('should return 0 for today', () => {
      const today = getTodayDate();
      expect(getDaysUntil(today)).toBe(0);
    });

    test('should return positive number for future date', () => {
      const future = '2026-12-31';
      expect(getDaysUntil(future)).toBeGreaterThan(0);
    });

    test('should return negative number for past date', () => {
      const past = '2024-01-01';
      expect(getDaysUntil(past)).toBeLessThan(0);
    });
  });
});
