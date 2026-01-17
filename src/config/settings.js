/**
 * Global game settings
 * Centralized configuration for easy adjustment
 */
export const settings = {
  // ============================================
  // PERSISTENCE
  // ============================================

  /** Toggle localStorage persistence (disable for testing) */
  enableLocalStorage: true,

  // ============================================
  // GAMEPLAY
  // ============================================

  /** Number of allowed errors per round */
  errorsPerRound: 3,

  // ============================================
  // DEBUG / DEV
  // ============================================

  /** Automatically true in development mode */
  debugMode: import.meta.env.DEV,

  /** Jump to a specific round on load (dev only) */
  skipToRound: null,

  /** Show all valid groupings (cheat mode for testing) */
  showAllGroupings: false,

  // ============================================
  // ANIMATION
  // ============================================

  /** Toggle animations on/off (disable for faster testing) */
  enableAnimations: true,

  /** Animation speed multiplier (0.5 = slow, 1 = normal, 2 = fast) */
  animationSpeed: 1,

  // ============================================
  // FUTURE FEATURES
  // ============================================

  /** Dark mode toggle (not implemented) */
  darkMode: false,

  /** Sound effects toggle (not implemented) */
  soundEnabled: false,
}

/**
 * Color palette for found groups
 * Each group gets assigned a color based on order found
 */
export const groupColors = {
  1: { name: 'blue', hex: '#3B82F6', bg: '#DBEAFE' },
  2: { name: 'green', hex: '#10B981', bg: '#D1FAE5' },
  3: { name: 'purple', hex: '#8B5CF6', bg: '#EDE9FE' },
  4: { name: 'orange', hex: '#F59E0B', bg: '#FEF3C7' },
}

/**
 * Get color config for a group by its index (1-based)
 * @param {number} index - 1-based index
 * @returns {Object} - { name, hex, bg }
 */
export function getGroupColor(index) {
  return groupColors[index] ?? groupColors[1]
}
