/**
 * Utility functions for date formatting and validation
 */

/**
 * Formats a date string to a readable format
 * @param {string} dateString - The date string to format
 * @returns {string} Formatted date string or 'N/A' if invalid
 */
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';

  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return 'Invalid Date';
  }

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

/**
 * Checks if a date has expired
 * @param {string} expiryDate - The expiry date to check
 * @returns {boolean} True if the date has expired or is invalid date, false otherwise
 */
export const isExpired = (expiryDate) => {
  if (!expiryDate) return true;

  const date = new Date(expiryDate);

  if (isNaN(date.getTime())) {
    return true; // Invalid dates are considered as expired
  }

  return date < new Date();
}; 