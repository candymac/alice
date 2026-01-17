<script setup>
  import { onMounted, ref, computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useGameStore } from '@/stores/game'
  import { useLocalStorage } from '@/composables/useLocalStorage'
  import { settings } from '@/config/settings'
  import { getPuzzleType } from '@/data/puzzleTypes'
  import puzzles from '@/data/puzzles.json'
  import Tooltip from '@/components/ui/Tooltip.vue'

  import GameBoard from '@/components/game/GameBoard.vue'
  import FoundGroups from '@/components/game/FoundGroups.vue'
  import AliceSlots from '@/components/game/AliceSlots.vue'
  import ErrorIndicator from '@/components/game/ErrorIndicator.vue'

  const gameStore = useGameStore()
  const localStorage = useLocalStorage()
  const gameBoardRef = ref(null)

  const { currentPuzzle, currentRound, gameStatus, selectedTiles, roundType, theme, isGameWon, isGameLost, finalPhrase } = storeToRefs(gameStore)

  // Get today's date in format matching puzzle keys
  function getTodayKey() {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }

  // Check if there's a puzzle for today (or use first available for dev)
  const puzzleKey = computed(() => {
    const today = getTodayKey()
    if (puzzles[today]) return today

    // In dev mode, use first available puzzle
    if (settings.debugMode) {
      return Object.keys(puzzles)[0]
    }

    return null
  })

  // Get display name for puzzle type
  const puzzleTypeName = computed(() => {
    return getPuzzleType(roundType.value)?.name || roundType.value
  })

  // Initialize game on mount
  onMounted(() => {
    if (puzzleKey.value && puzzles[puzzleKey.value]) {
      // Check for saved game
      const savedGame = localStorage.loadCurrentGame()
      if (savedGame && savedGame.date === puzzleKey.value) {
        // TODO: Restore from saved game
        gameStore.loadPuzzle(puzzles[puzzleKey.value], puzzleKey.value)
      } else {
        gameStore.loadPuzzle(puzzles[puzzleKey.value], puzzleKey.value)
      }

      // Handle skipToRound setting
      if (settings.debugMode && settings.skipToRound) {
        gameStore.skipToRound(settings.skipToRound)
      }
    }
  })

  // Submit current selection
  function handleSubmit() {
    const result = gameStore.submitGroup()

    if (!result.success && gameBoardRef.value) {
      // Wrong guess - shake tiles
      gameBoardRef.value.shakeSelected()
    }
  }

  // Clear selection
  function handleClear() {
    gameStore.clearSelection()
  }

  // Advance to next round
  function handleNextRound() {
    gameStore.nextRound()
  }

  // Check if we can submit (at least 2 tiles selected)
  const canSubmit = computed(() => selectedTiles.value.length >= 2)

  // Help tooltip state
  const showHelp = ref(false)

  function toggleHelp() {
    showHelp.value = !showHelp.value
  }
</script>

<template>
  <div class="home">
    <!-- No puzzle available -->
    <div
      v-if="!puzzleKey"
      class="home__empty">
      <h2>No Puzzle Today</h2>
      <p>Check back later for today's puzzle!</p>
    </div>

    <!-- Game UI - Two Column Layout -->
    <div
      v-else-if="currentPuzzle"
      class="container game-layout">
      <!-- Round Info Bar -->
      <div class="game-layout__round-info">
        <div class="round-info">
          <div class="round-info__top">
            <span class="round-info__round">Round {{ currentRound }}: {{ theme }}</span>
          </div>
          <div class="round-info__bottom">
            <span class="round-info__type">{{ puzzleTypeName }}</span>
            <button
              class="round-info__help-btn"
              aria-label="Show help"
              @click="toggleHelp">
              ?
            </button>
          </div>
        </div>

        <!-- Help tooltip -->
        <Tooltip
          v-if="showHelp"
          :title="puzzleTypeName"
          @close="showHelp = false">
          <p>{{ getPuzzleType(roundType)?.instructions || 'Select tiles in sequence to form groups.' }}</p>
          <p>Find all groups, leaving one tile behind - the Alice!</p>
        </Tooltip>
      </div>

      <!-- Main Column: Game Board + Controls -->
      <div class="game-layout__main">
        <!-- Game board -->
        <GameBoard ref="gameBoardRef" />

        <!-- Error indicator (Messes) -->
        <ErrorIndicator class="main__errors" />

        <!-- Action buttons -->
        <div
          v-if="gameStatus === 'playing'"
          class="main__actions">
          <button
            class="main__btn main__btn--secondary"
            :disabled="selectedTiles.length === 0"
            @click="handleClear">
            Clear
          </button>
          <button
            class="main__btn main__btn--primary"
            :disabled="!canSubmit"
            @click="handleSubmit">
            Submit
          </button>
        </div>

        <!-- Round complete -->
        <div
          v-else-if="gameStatus === 'round-complete'"
          class="main__message">
          <h3>Round Complete!</h3>
          <button
            class="main__btn main__btn--primary"
            @click="handleNextRound">
            Next Round
          </button>
        </div>

        <!-- Game won -->
        <div
          v-else-if="isGameWon"
          class="main__message main__message--won">
          <h3>You Win!</h3>
          <p class="main__phrase">{{ finalPhrase }}</p>
        </div>

        <!-- Game lost -->
        <div
          v-else-if="isGameLost"
          class="main__message main__message--lost">
          <h3>Game Over</h3>
          <p>Better luck next time!</p>
        </div>
      </div>

      <!-- Sidebar: Found Groups -->
      <div class="game-layout__sidebar">
        <FoundGroups />
      </div>

      <!-- Progress: Alice Slots -->
      <div class="game-layout__progress">
        <AliceSlots />
      </div>
    </div>
  </div>
</template>

<style scoped>
  .home {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .home__empty {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 1rem;
  }

  .home__empty h2 {
    margin: 0 0 0.5rem;
    color: var(--color-primary);
  }

  .home__empty p {
    margin: 0;
    color: var(--color-muted);
  }

  /* Round Info Bar */
  .round-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
  }

  .round-info__top {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .round-info__bottom {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .round-info__round {
    font-size: 1rem;
    font-weight: 600;
    color: var(--color-primary);
  }

  .round-info__type {
    font-size: 0.875rem;
    color: var(--color-secondary);
  }

  .round-info__help-btn {
    width: 20px;
    height: 20px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background-color: var(--color-background);
    border: 1px solid var(--color-border);
    border-radius: 50%;
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--color-muted);
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .round-info__help-btn:hover {
    background-color: var(--color-accent);
    border-color: var(--color-accent);
    color: white;
  }

  /* Main Column */
  .game-layout__main {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .main__actions {
    display: flex;
    justify-content: center;
    gap: 0.75rem;
  }

  .main__btn {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 0.5rem;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .main__btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .main__btn--primary {
    background-color: var(--color-accent);
    color: white;
  }

  .main__btn--primary:hover:not(:disabled) {
    background-color: var(--color-accent-hover);
  }

  .main__btn--secondary {
    background-color: var(--color-background);
    color: var(--color-secondary);
    border: 1px solid var(--color-border);
  }

  .main__btn--secondary:hover:not(:disabled) {
    background-color: var(--color-surface);
    border-color: var(--color-border-strong);
  }

  .main__message {
    text-align: center;
    padding: 1.5rem;
    background-color: var(--color-surface);
    border-radius: var(--radius-card);
    box-shadow: var(--shadow-card);
    width: 100%;
    max-width: var(--gameboard-max-mobile, 360px);
  }

  @media (min-width: 768px) {
    .main__message {
      max-width: var(--gameboard-max-desktop, 420px);
    }
  }

  .main__message h3 {
    margin: 0 0 0.75rem;
    font-size: 1.25rem;
    color: var(--color-primary);
  }

  .main__message p {
    margin: 0 0 1rem;
    color: var(--color-secondary);
  }

  .main__message--won {
    border: 2px solid var(--color-success);
  }

  .main__message--lost {
    border: 2px solid var(--color-error);
  }

  .main__phrase {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--color-accent);
    letter-spacing: 0.1em;
  }
</style>
