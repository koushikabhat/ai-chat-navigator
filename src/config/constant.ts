// PURPOSE:
// Central place for all constant values.
// WHY: Avoid magic strings, improve maintainability, and allow easy updates.

/**
 * DOM selectors for extracting chat structure
 * WHY:
 * Chat platforms (like ChatGPT) change DOM often.
 * Keeping selectors here allows quick updates without touching logic.
 */
export const DOM_SELECTORS = {
    CHAT_CONTAINER: 'main',
    MESSAGE_BLOCK: '[data-message-id]',
  };
  
  /**
   * Scroll behavior configuration
   * WHY:
   * Used when navigating to sections.
   * Centralized so behavior can be changed globally.
   */
  export const SCROLL_BEHAVIOR: ScrollBehavior = 'smooth';
  
  /**
   * Maximum number of sections to track
   * WHY:
   * Prevent performance issues in extremely long chats.
   */
  export const MAX_SECTIONS = 200;