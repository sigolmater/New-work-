/**
 * Content Calendar Parser Utility
 * 
 * Parses the content_calendar.csv file and provides utilities
 * for filtering and managing scheduled content reminders.
 */

/**
 * Parse CSV content into an array of content objects
 * @param {string} csvText - Raw CSV text content
 * @returns {Array} Array of content objects with date, format, title_seed, and cta
 */
export const parseContentCalendar = (csvText) => {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) return [];

  // Skip header row
  const dataLines = lines.slice(1);
  
  return dataLines.map(line => {
    const [date, format, title_seed, cta] = line.split(',');
    return {
      date: date?.trim(),
      format: format?.trim(),
      title_seed: title_seed?.trim(),
      cta: cta?.trim()
    };
  }).filter(item => item.date); // Filter out invalid entries
};

/**
 * Get today's date in YYYY-MM-DD format
 * @returns {string} Today's date
 */
export const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Check if a date is today
 * @param {string} dateStr - Date string in YYYY-MM-DD format
 * @returns {boolean} True if the date is today
 */
export const isToday = (dateStr) => {
  return dateStr === getTodayDate();
};

/**
 * Check if a date is in the future (including today)
 * @param {string} dateStr - Date string in YYYY-MM-DD format
 * @returns {boolean} True if the date is today or in the future
 */
export const isFutureOrToday = (dateStr) => {
  const date = new Date(dateStr);
  const today = new Date(getTodayDate());
  return date >= today;
};

/**
 * Get upcoming content items (today and future)
 * @param {Array} contentItems - Array of content objects
 * @param {number} limit - Maximum number of items to return (default: 5)
 * @returns {Array} Filtered and sorted array of upcoming content
 */
export const getUpcomingContent = (contentItems, limit = 5) => {
  return contentItems
    .filter(item => isFutureOrToday(item.date))
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, limit);
};

/**
 * Format date for display (e.g., "2025-10-26" -> "Oct 26, 2025")
 * @param {string} dateStr - Date string in YYYY-MM-DD format
 * @returns {string} Formatted date string
 */
export const formatDisplayDate = (dateStr) => {
  const date = new Date(dateStr);
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
};

/**
 * Get days until a specific date
 * @param {string} dateStr - Date string in YYYY-MM-DD format
 * @returns {number} Number of days until the date
 */
export const getDaysUntil = (dateStr) => {
  const targetDate = new Date(dateStr);
  const today = new Date(getTodayDate());
  const diffTime = targetDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};
