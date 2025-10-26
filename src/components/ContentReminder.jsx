import React, { useState, useEffect } from 'react';
import './ContentReminder.css';
import {
  parseContentCalendar,
  getUpcomingContent,
  isToday,
  formatDisplayDate,
  getDaysUntil
} from '../utils/contentCalendarParser';

/**
 * ContentReminder Component
 * 
 * Displays upcoming scheduled content from the content calendar
 * with reminders for today's tasks and upcoming deadlines.
 */
const ContentReminder = () => {
  const [upcomingContent, setUpcomingContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch and parse the content calendar CSV
    const loadContentCalendar = async () => {
      try {
        const response = await fetch('/content_calendar.csv');
        if (!response.ok) {
          throw new Error('Failed to load content calendar');
        }
        const csvText = await response.text();
        const allContent = parseContentCalendar(csvText);
        const upcoming = getUpcomingContent(allContent, 5);
        setUpcomingContent(upcoming);
        setLoading(false);
      } catch (err) {
        console.error('Error loading content calendar:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    loadContentCalendar();
  }, []);

  /**
   * Get visual indicator text for date proximity
   */
  const getDateIndicator = (dateStr) => {
    if (isToday(dateStr)) {
      return '오늘'; // Today in Korean
    }
    const daysUntil = getDaysUntil(dateStr);
    if (daysUntil === 1) {
      return '내일'; // Tomorrow in Korean
    }
    if (daysUntil <= 7) {
      return `${daysUntil}일 후`; // N days later in Korean
    }
    return '';
  };

  /**
   * Get CSS class for content item based on date
   */
  const getItemClass = (dateStr) => {
    if (isToday(dateStr)) {
      return 'reminder-item today';
    }
    const daysUntil = getDaysUntil(dateStr);
    if (daysUntil <= 3) {
      return 'reminder-item soon';
    }
    return 'reminder-item';
  };

  if (loading) {
    return (
      <div className="content-reminder loading">
        <div className="loading-spinner">⏳</div>
        <p>콘텐츠 캘린더 로딩 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="content-reminder error">
        <div className="error-icon">⚠️</div>
        <p>콘텐츠 캘린더를 불러올 수 없습니다: {error}</p>
      </div>
    );
  }

  if (upcomingContent.length === 0) {
    return (
      <div className="content-reminder empty">
        <div className="empty-icon">📅</div>
        <p>예정된 콘텐츠가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="content-reminder">
      <h2>📅 콘텐츠 캘린더 리마인더</h2>
      <div className="reminder-subtitle">
        <p>다가오는 콘텐츠 일정 (15분 퍼블리시)</p>
      </div>
      
      <div className="reminder-list">
        {upcomingContent.map((item, index) => (
          <div key={`${item.date}-${index}`} className={getItemClass(item.date)}>
            <div className="reminder-header">
              <div className="reminder-date">
                <span className="date-text">{formatDisplayDate(item.date)}</span>
                {getDateIndicator(item.date) && (
                  <span className="date-indicator">{getDateIndicator(item.date)}</span>
                )}
              </div>
              <div className="reminder-format">{item.format}</div>
            </div>
            <div className="reminder-content">
              <div className="content-title">
                <strong>주제:</strong> {item.title_seed}
              </div>
              <div className="content-cta">
                <strong>CTA:</strong> {item.cta}
              </div>
            </div>
            {isToday(item.date) && (
              <div className="today-action">
                <span className="action-icon">🔥</span>
                <span className="action-text">오늘 제작 & 업로드</span>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="reminder-footer">
        <p className="reminder-tip">
          💡 <strong>팁:</strong> RUNBOOK.md를 참고하여 15분 내 제작 & 퍼블리시
        </p>
      </div>
    </div>
  );
};

export default ContentReminder;
