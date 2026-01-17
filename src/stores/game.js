import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { settings } from '@/config/settings'

export const useGameStore = defineStore('game', () => {
  // ============================================
  // STATE
  // ============================================

  // Current puzzle (loaded from puzzles.json by date)
  const currentPuzzle = ref(null)

  // Round tracking
  const currentRound = ref(1)
  const totalRounds = computed(() => currentPuzzle.value?.rounds?.length ?? 0)

  // Current round state
  const grid = ref([])                    // Array of tile content (9 items for 3x3)
  const selectedTiles = ref([])           // Currently selected tile indices (in order of selection)
  const foundGroups = ref([])             // [{ words: [], result: '', color: '' }]
  const solvedTiles = ref({})             // { index: colorIndex } - maps tile index to its group color
  const groupsToFind = ref(0)             // Number of groups to find in current round

  // Game progress
  const alices = ref([])                  // Collected Alice words/items
  const errorsPerRound = ref([])          // Track errors per round: [1, 0, 2, ...]
  const errorsThisRound = ref(0)
  const maxErrorsPerRound = computed(() => settings.errorsPerRound)

  // Round info (from puzzle data)
  const roundType = ref('')               // 'sounds-like', 'phrases', etc.
  const theme = ref('')                   // 'BREAKFAST', etc.
  const tileContentType = ref('text')     // 'text' | 'image' | 'mixed'

  // UI state
  const gameStatus = ref('playing')       // 'playing', 'round-complete', 'game-won', 'game-lost'

  // Meta
  const gameDate = ref(null)
  const isRestoredFromStorage = ref(false)

  // ============================================
  // GETTERS
  // ============================================

  const currentRoundData = computed(() => {
    if (!currentPuzzle.value || currentRound.value < 1) return null
    return currentPuzzle.value.rounds[currentRound.value - 1] ?? null
  })

  const remainingErrors = computed(() => {
    return maxErrorsPerRound.value - errorsThisRound.value
  })

  const isRoundComplete = computed(() => {
    return foundGroups.value.length >= groupsToFind.value
  })

  const isGameWon = computed(() => {
    return gameStatus.value === 'game-won'
  })

  const isGameLost = computed(() => {
    return gameStatus.value === 'game-lost'
  })

  const finalPhrase = computed(() => {
    return currentPuzzle.value?.finalPhrase ?? ''
  })

  // ============================================
  // ACTIONS
  // ============================================

  /**
   * Load a puzzle by date
   * @param {Object} puzzleData - The puzzle object from puzzles.json
   * @param {string} date - The date string (e.g., '2025-01-18')
   */
  function loadPuzzle(puzzleData, date) {
    currentPuzzle.value = puzzleData
    gameDate.value = date
    currentRound.value = 1
    alices.value = []
    errorsPerRound.value = []
    gameStatus.value = 'playing'
    isRestoredFromStorage.value = false

    _loadRound(1)
  }

  /**
   * Load a specific round's data into state
   */
  function _loadRound(roundNumber) {
    const roundData = currentPuzzle.value?.rounds[roundNumber - 1]
    if (!roundData) return

    grid.value = [...roundData.grid]
    selectedTiles.value = []
    foundGroups.value = []
    solvedTiles.value = {}
    groupsToFind.value = roundData.groupsToFind ?? roundData.groupings.length
    errorsThisRound.value = 0
    roundType.value = roundData.type ?? ''
    theme.value = roundData.theme ?? ''
    tileContentType.value = roundData.tileContent ?? 'text'
    gameStatus.value = 'playing'
  }

  /**
   * Select or deselect a tile
   * @param {number} index - The tile index in the grid
   */
  function selectTile(index) {
    if (gameStatus.value !== 'playing') return
    if (solvedTiles.value[index] !== undefined) return // Can't select solved tiles

    const alreadySelected = selectedTiles.value.indexOf(index)

    if (alreadySelected !== -1) {
      // Deselect: remove this tile and all tiles selected after it
      selectedTiles.value = selectedTiles.value.slice(0, alreadySelected)
    } else {
      // Select: add to the sequence
      selectedTiles.value.push(index)
    }
  }

  /**
   * Clear the current selection
   */
  function clearSelection() {
    selectedTiles.value = []
  }

  /**
   * Submit the current selection as a group attempt
   * @returns {Object} - { success: boolean, result?: string, error?: string }
   */
  function submitGroup() {
    if (selectedTiles.value.length < 2) {
      return { success: false, error: 'Select at least 2 tiles' }
    }

    const roundData = currentRoundData.value
    if (!roundData) {
      return { success: false, error: 'No round data' }
    }

    // Get the words/content for selected tiles
    const selectedWords = selectedTiles.value.map(i => grid.value[i])

    // Check if this matches any grouping
    const match = roundData.groupings.find(g => {
      if (g.words.length !== selectedWords.length) return false
      return g.words.every((word, i) => word === selectedWords[i])
    })

    if (match) {
      // Correct! Add to found groups
      const colorIndex = (foundGroups.value.length % 4) + 1
      foundGroups.value.push({
        words: [...selectedWords],
        result: match.result,
        color: colorIndex
      })

      // Mark matched tiles as solved (instead of removing them)
      selectedTiles.value.forEach(i => {
        solvedTiles.value[i] = colorIndex
      })

      clearSelection()

      // Check if round is complete
      if (foundGroups.value.length >= groupsToFind.value) {
        _completeRound()
      }

      return { success: true, result: match.result }
    } else {
      // Wrong guess
      errorsThisRound.value++
      clearSelection()

      if (errorsThisRound.value >= maxErrorsPerRound.value) {
        _loseGame()
        return { success: false, error: 'Out of guesses' }
      }

      return { success: false, error: 'Incorrect grouping' }
    }
  }

  /**
   * Complete the current round and collect the Alice
   */
  function _completeRound() {
    const roundData = currentRoundData.value
    if (roundData?.alice) {
      alices.value.push(roundData.alice)
    }

    errorsPerRound.value.push(errorsThisRound.value)

    if (currentRound.value >= totalRounds.value) {
      gameStatus.value = 'game-won'
    } else {
      gameStatus.value = 'round-complete'
    }
  }

  /**
   * Advance to the next round
   */
  function nextRound() {
    if (currentRound.value >= totalRounds.value) return

    currentRound.value++
    _loadRound(currentRound.value)
  }

  /**
   * Handle game loss
   */
  function _loseGame() {
    errorsPerRound.value.push(errorsThisRound.value)
    gameStatus.value = 'game-lost'
  }

  /**
   * Reset the entire game
   */
  function resetGame() {
    if (currentPuzzle.value && gameDate.value) {
      loadPuzzle(currentPuzzle.value, gameDate.value)
    }
  }

  /**
   * Skip to a specific round (dev only)
   * @param {number} roundNumber
   */
  function skipToRound(roundNumber) {
    if (!settings.debugMode) return
    if (roundNumber < 1 || roundNumber > totalRounds.value) return

    currentRound.value = roundNumber
    _loadRound(roundNumber)
  }

  /**
   * Restore game state from storage
   * @param {Object} savedState
   */
  function restoreFromStorage(savedState) {
    if (!savedState) return

    // This would be called by the localStorage composable
    // Implementation depends on the exact storage format
    isRestoredFromStorage.value = true

    // TODO: Implement full state restoration
  }

  /**
   * Get state for saving to storage
   */
  function getStateForStorage() {
    return {
      date: gameDate.value,
      round: currentRound.value,
      alices: [...alices.value],
      errorsUsed: [...errorsPerRound.value],
      foundGroupsByRound: [] // TODO: track per-round
    }
  }

  // ============================================
  // EXPOSE
  // ============================================

  return {
    // State
    currentPuzzle,
    currentRound,
    totalRounds,
    grid,
    selectedTiles,
    foundGroups,
    solvedTiles,
    groupsToFind,
    alices,
    errorsPerRound,
    errorsThisRound,
    maxErrorsPerRound,
    roundType,
    theme,
    tileContentType,
    gameStatus,
    gameDate,
    isRestoredFromStorage,

    // Getters
    currentRoundData,
    remainingErrors,
    isRoundComplete,
    isGameWon,
    isGameLost,
    finalPhrase,

    // Actions
    loadPuzzle,
    selectTile,
    clearSelection,
    submitGroup,
    nextRound,
    resetGame,
    skipToRound,
    restoreFromStorage,
    getStateForStorage
  }
})
