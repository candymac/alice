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
    :aria-label="`${remainingErrors} messes remaining`"
  >
    <span class="error-indicator__label">Messes:</span>

    <div class="error-indicator__plates">
      <span
        v-for="(indicator, index) in indicators"
        :key="index"
        class="error-indicator__plate"
        :class="{ 'error-indicator__plate--used': indicator.used }"
        :aria-hidden="true"
      >{{ indicator.used ? '💔' : '🍽️' }}</span>
    </div>
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

.error-indicator__plates {
  display: flex;
  gap: 0.25rem;
}

.error-indicator__plate {
  font-size: 1.25rem;
  line-height: 1;
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.error-indicator__plate--used {
  opacity: 0.6;
  transform: scale(0.85);
}
</style>
