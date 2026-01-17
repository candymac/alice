<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useGameStore } from '@/stores/game'
import { storeToRefs } from 'pinia'

const gameStore = useGameStore()
const { totalRounds, gameDate } = storeToRefs(gameStore)

// Format date for display (e.g., "Jan 18, 2026")
const formattedDate = computed(() => {
  if (!gameDate.value) return ''
  const date = new Date(gameDate.value + 'T00:00:00')
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
})

// Puzzle number (just using 1 for now, could be calculated from launch date)
const puzzleNumber = computed(() => 1)
</script>

<template>
  <header class="header">
    <div class="container flex items-center justify-between py-3">
      <RouterLink to="/" class="header__logo">
        Alice
      </RouterLink>

      <div class="header__info">
        <span v-if="formattedDate && totalRounds" class="header__meta">
          Puzzle #{{ puzzleNumber }} · {{ formattedDate }} · {{ totalRounds }} Rounds
        </span>
      </div>

      <nav class="header__nav">
        <RouterLink to="/about" class="header__link">
          About
        </RouterLink>
      </nav>
    </div>
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

.header__meta {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--color-muted);
  letter-spacing: 0.02em;
}

@media (min-width: 768px) {
  .header__meta {
    font-size: 0.875rem;
  }
}

.header__nav {
  display: flex;
  align-items: center;
  gap: 0.75rem;
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
