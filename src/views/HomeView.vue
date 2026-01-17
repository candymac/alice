<script setup>
import { onMounted, ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useGameStore } from '@/stores/game'
import { useLocalStorage } from '@/composables/useLocalStorage'
import { settings } from '@/config/settings'
import puzzles from '@/data/puzzles.json'

import GameBoard from '@/components/game/GameBoard.vue'
import FoundGroups from '@/components/game/FoundGroups.vue'
import AliceSlots from '@/components/game/AliceSlots.vue'
import ErrorIndicator from '@/components/game/ErrorIndicator.vue'

const gameStore = useGameStore()
const localStorage = useLocalStorage()
const gameBoardRef = ref(null)

const {
  currentPuzzle,
  currentRound,
  gameStatus,
  selectedTiles,
  roundType,
  theme,
  isGameWon,
  isGameLost,
  finalPhrase
} = storeToRefs(gameStore)

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
</script>

<template>
  <div class="home">
    <!-- No puzzle available -->
    <div v-if="!puzzleKey" class="home__empty">
      <h2>No Puzzle Today</h2>
      <p>Check back later for today's puzzle!</p>
    </div>

    <!-- Game UI -->
    <div v-else-if="currentPuzzle" class="home__game">
      <!-- Round info -->
      <div class="home__round-info">
        <span v-if="theme" class="home__theme">{{ theme }}</span>
        <span v-if="roundType" class="home__type">{{ roundType }}</span>
      </div>

      <!-- Alice slots progress -->
      <AliceSlots class="home__progress" />

      <!-- Error indicator -->
      <ErrorIndicator class="home__errors" />

      <!-- Game board -->
      <GameBoard ref="gameBoardRef" class="home__board" />

      <!-- Action buttons -->
      <div v-if="gameStatus === 'playing'" class="home__actions">
        <button
          class="home__btn home__btn--secondary"
          :disabled="selectedTiles.length === 0"
          @click="handleClear"
        >
          Clear
        </button>
        <button
          class="home__btn home__btn--primary"
          :disabled="!canSubmit"
          @click="handleSubmit"
        >
          Submit
        </button>
      </div>

      <!-- Round complete -->
      <div v-else-if="gameStatus === 'round-complete'" class="home__message">
        <h3>Round Complete!</h3>
        <button class="home__btn home__btn--primary" @click="handleNextRound">
          Next Round
        </button>
      </div>

      <!-- Game won -->
      <div v-else-if="isGameWon" class="home__message home__message--won">
        <h3>You Win!</h3>
        <p class="home__phrase">{{ finalPhrase }}</p>
      </div>

      <!-- Game lost -->
      <div v-else-if="isGameLost" class="home__message home__message--lost">
        <h3>Game Over</h3>
        <p>Better luck next time!</p>
      </div>

      <!-- Found groups sidebar -->
      <FoundGroups class="home__sidebar" />
    </div>
  </div>
</template>

<style scoped>
.home {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 1rem;
}

.home__empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.home__empty h2 {
  margin: 0 0 0.5rem;
  color: var(--color-primary);
}

.home__empty p {
  margin: 0;
  color: var(--color-muted);
}

.home__game {
  max-width: 600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.home__round-info {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.home__theme {
  padding: 0.25rem 0.5rem;
  background-color: var(--color-accent);
  color: white;
  border-radius: 0.25rem;
  font-weight: 600;
}

.home__type {
  padding: 0.25rem 0.5rem;
  background-color: var(--color-background);
  color: var(--color-secondary);
  border-radius: 0.25rem;
}

.home__progress {
  order: -1;
}

.home__errors {
  align-self: center;
}

.home__board {
  margin: 0.5rem 0;
}

.home__actions {
  display: flex;
  justify-content: center;
  gap: 0.75rem;
}

.home__btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
}

.home__btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.home__btn--primary {
  background-color: var(--color-accent);
  color: white;
}

.home__btn--primary:hover:not(:disabled) {
  background-color: var(--color-accent-hover);
}

.home__btn--secondary {
  background-color: var(--color-background);
  color: var(--color-secondary);
  border: 1px solid var(--color-border);
}

.home__btn--secondary:hover:not(:disabled) {
  background-color: var(--color-surface);
  border-color: var(--color-border-strong);
}

.home__message {
  text-align: center;
  padding: 1.5rem;
  background-color: var(--color-surface);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
}

.home__message h3 {
  margin: 0 0 0.75rem;
  font-size: 1.25rem;
  color: var(--color-primary);
}

.home__message p {
  margin: 0 0 1rem;
  color: var(--color-secondary);
}

.home__message--won {
  border: 2px solid var(--color-success);
}

.home__message--lost {
  border: 2px solid var(--color-error);
}

.home__phrase {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-accent);
  letter-spacing: 0.1em;
}

.home__sidebar {
  margin-top: 0.5rem;
}

/* Responsive adjustments */
@media (min-width: 768px) {
  .home__game {
    max-width: 480px;
  }
}
</style>
