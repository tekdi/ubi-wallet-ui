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
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (error) {
    return 'Invalid Date';
  }
};

/**
 * Checks if a date has expired
 * @param {string} expiryDate - The expiry date to check
 * @returns {boolean} True if the date has expired, false otherwise
 */
export const isExpired = (expiryDate) => {
  if (!expiryDate) return false;
  return new Date(expiryDate) < new Date();
}; 