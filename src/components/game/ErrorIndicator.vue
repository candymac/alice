<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useGameStore } from '@/stores/game'

const gameStore = useGameStore()
const { errorsThisRound, maxErrorsPerRound, remainingErrors } = storeToRefs(gameStore)

// Create array of error indicators
const indicators = computed(() => {
  const result = []
  for (let i = 0; i < maxErrorsPerRound.value; i++) {
    result.push({
      used: i < errorsThisRound.value
    })
  }
  return result
})
</script>

<template>
  <div
    class="error-indicator"
    role="status"
    :aria-label="`${remainingErrors} mistakes remaining`"
  >
    <span class="error-indicator__label">Mistakes:</span>

    <div class="error-indicator__dots">
      <span
        v-for="(indicator, index) in indicators"
        :key="index"
        class="error-indicator__dot"
        :class="{ 'error-indicator__dot--used': indicator.used }"
        :aria-hidden="true"
      />
    </div>

    <span class="error-indicator__count">
      {{ remainingErrors }} left
    </span>
  </div>
</template>

<style scoped>
.error-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: var(--color-surface);
  border-radius: 2rem;
  box-shadow: var(--shadow-tile);
}

.error-indicator__label {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.error-indicator__dots {
  display: flex;
  gap: 0.25rem;
}

.error-indicator__dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: var(--color-success);
  transition: background-color 0.2s ease, transform 0.2s ease;
}

.error-indicator__dot--used {
  background-color: var(--color-error);
  transform: scale(0.8);
}

.error-indicator__count {
  font-size: 0.75rem;
  color: var(--color-muted);
  margin-left: 0.25rem;
}
</style>
