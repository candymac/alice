import { ref, watch } from 'vue'
import { settings } from '@/config/settings'

/**
 * LocalStorage keys used by the game
 */
export const STORAGE_KEYS = {
  CURRENT: 'alice-current',
  COMPLETED: 'alice-completed',
  STATS: 'alice-stats'
}

/**
 * Default values for storage
 */
const DEFAULTS = {
  current: null,
  completed: [],
  stats: {
    played: 0,
    won: 0,
    currentStreak: 0,
    maxStreak: 0
  }
}

/**
 * Composable for managing localStorage with settings toggle
 */
export function useLocalStorage() {
  /**
   * Check if localStorage is available and enabled
   */
  function isEnabled() {
    if (!settings.enableLocalStorage) return false

    try {
      const test = '__storage_test__'
      localStorage.setItem(test, test)
      localStorage.removeItem(test)
      return true
    } catch (e) {
      return false
    }
  }

  /**
   * Save data to localStorage
   * @param {string} key - Storage key
   * @param {any} value - Value to store (will be JSON stringified)
   */
  function save(key, value) {
    if (!isEnabled()) return false

    try {
      localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch (e) {
      console.warn('Failed to save to localStorage:', e)
      return false
    }
  }

  /**
   * Load data from localStorage
   * @param {string} key - Storage key
   * @param {any} defaultValue - Default value if key doesn't exist
   * @returns {any} - Parsed value or default
   */
  function load(key, defaultValue = null) {
    if (!isEnabled()) return defaultValue

    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (e) {
      console.warn('Failed to load from localStorage:', e)
      return defaultValue
    }
  }

  /**
   * Remove data from localStorage
   * @param {string} key - Storage key
   */
  function remove(key) {
    if (!isEnabled()) return

    try {
      localStorage.removeItem(key)
    } catch (e) {
      console.warn('Failed to remove from localStorage:', e)
    }
  }

  /**
   * Clear all game-related localStorage
   */
  function clearAll() {
    Object.values(STORAGE_KEYS).forEach(key => remove(key))
  }

  // ============================================
  // GAME-SPECIFIC HELPERS
  // ============================================

  /**
   * Save current game state
   * @param {Object} gameState - The game state to save
   */
  function saveCurrentGame(gameState) {
    return save(STORAGE_KEYS.CURRENT, gameState)
  }

  /**
   * Load current game state
   * @returns {Object|null}
   */
  function loadCurrentGame() {
    return load(STORAGE_KEYS.CURRENT, DEFAULTS.current)
  }

  /**
   * Clear current game state
   */
  function clearCurrentGame() {
    remove(STORAGE_KEYS.CURRENT)
  }

  /**
   * Get list of completed puzzle dates
   * @returns {string[]}
   */
  function getCompletedDates() {
    return load(STORAGE_KEYS.COMPLETED, DEFAULTS.completed)
  }

  /**
   * Add a date to completed puzzles
   * @param {string} date
   */
  function addCompletedDate(date) {
    const completed = getCompletedDates()
    if (!completed.includes(date)) {
      completed.push(date)
      save(STORAGE_KEYS.COMPLETED, completed)
    }
  }

  /**
   * Get player stats
   * @returns {Object}
   */
  function getStats() {
    return load(STORAGE_KEYS.STATS, { ...DEFAULTS.stats })
  }

  /**
   * Update player stats
   * @param {Object} updates - Partial stats object
   */
  function updateStats(updates) {
    const stats = getStats()
    Object.assign(stats, updates)
    save(STORAGE_KEYS.STATS, stats)
    return stats
  }

  /**
   * Record a game result
   * @param {boolean} won - Whether the player won
   */
  function recordGameResult(won) {
    const stats = getStats()
    stats.played++

    if (won) {
      stats.won++
      stats.currentStreak++
      if (stats.currentStreak > stats.maxStreak) {
        stats.maxStreak = stats.currentStreak
      }
    } else {
      stats.currentStreak = 0
    }

    save(STORAGE_KEYS.STATS, stats)
    return stats
  }

  return {
    // Core functions
    isEnabled,
    save,
    load,
    remove,
    clearAll,

    // Game-specific helpers
    saveCurrentGame,
    loadCurrentGame,
    clearCurrentGame,
    getCompletedDates,
    addCompletedDate,
    getStats,
    updateStats,
    recordGameResult,

    // Constants
    STORAGE_KEYS
  }
}
