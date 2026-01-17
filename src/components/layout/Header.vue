<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import Tooltip from '@/components/ui/Tooltip.vue'
import { useGameStore } from '@/stores/game'
import { storeToRefs } from 'pinia'
import { getPuzzleType } from '@/data/puzzleTypes'

const gameStore = useGameStore()
const { roundType, currentRound, totalRounds } = storeToRefs(gameStore)

const showHelp = ref(false)

function toggleHelp() {
  showHelp.value = !showHelp.value
}
</script>

<template>
  <header class="header">
    <div class="header__container">
      <RouterLink to="/" class="header__logo">
        Alice
      </RouterLink>

      <div class="header__info">
        <span v-if="currentRound && totalRounds" class="header__round">
          Round {{ currentRound }} / {{ totalRounds }}
        </span>
      </div>

      <nav class="header__nav">
        <button
          class="header__help-btn"
          aria-label="Show help"
          @click="toggleHelp"
        >
          ?
        </button>

        <RouterLink to="/about" class="header__link">
          About
        </RouterLink>
      </nav>
    </div>

    <!-- Help tooltip -->
    <Tooltip
      v-if="showHelp"
      :title="getPuzzleType(roundType)?.name || 'How to Play'"
      @close="showHelp = false"
    >
      <p>{{ getPuzzleType(roundType)?.instructions || 'Select tiles in sequence to form groups.' }}</p>
      <p>Find all groups, leaving one tile behind - the Alice!</p>
    </Tooltip>
  </header>
</template>

<style scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
}

.header__container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 600px;
  margin: 0 auto;
  padding: 0.75rem 1rem;
}

.header__logo {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-primary);
  text-decoration: none;
  letter-spacing: -0.02em;
}

.header__logo:hover {
  color: var(--color-accent);
}

.header__info {
  flex: 1;
  text-align: center;
}

.header__round {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-secondary);
}

.header__nav {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.header__help-btn {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 50%;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-secondary);
  cursor: pointer;
  transition: all 0.15s ease;
}

.header__help-btn:hover {
  background-color: var(--color-accent);
  border-color: var(--color-accent);
  color: white;
}

.header__link {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-secondary);
  text-decoration: none;
  transition: color 0.15s ease;
}

.header__link:hover {
  color: var(--color-accent);
}
</style>
