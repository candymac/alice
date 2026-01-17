<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useGameStore } from '@/stores/game'

const gameStore = useGameStore()
const { alices, currentRound, totalRounds } = storeToRefs(gameStore)

// Create slots array for visual display
const slots = computed(() => {
  const result = []
  for (let i = 0; i < totalRounds.value; i++) {
    result.push({
      filled: i < alices.value.length,
      content: alices.value[i] || null,
      isCurrent: i === currentRound.value - 1
    })
  }
  return result
})
</script>

<template>
  <div class="alice-slots" aria-label="Collected Alices">
    <h3 class="alice-slots__title">Alices Collected</h3>

    <div class="alice-slots__container">
      <div
        v-for="(slot, index) in slots"
        :key="index"
        class="alice-slots__slot"
        :class="{
          'alice-slots__slot--filled': slot.filled,
          'alice-slots__slot--current': slot.isCurrent
        }"
        :aria-label="slot.filled ? `Alice ${index + 1}: ${slot.content}` : `Alice ${index + 1}: empty`"
      >
        <span v-if="slot.filled" class="alice-slots__content">
          {{ slot.content }}
        </span>
        <span v-else class="alice-slots__placeholder">
          {{ index + 1 }}
        </span>
      </div>
    </div>

    <p v-if="alices.length === totalRounds" class="alice-slots__phrase">
      {{ alices.join(' ') }}
    </p>
  </div>
</template>

<style scoped>
.alice-slots {
  padding: 1rem;
  background-color: var(--color-surface);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
  text-align: center;
}

.alice-slots__title {
  margin: 0 0 0.75rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.alice-slots__container {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.alice-slots__slot {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-background);
  border: 2px dashed var(--color-border);
  border-radius: var(--radius-tile);
  font-size: 0.75rem;
  color: var(--color-muted);
  transition: all 0.2s ease;
}

.alice-slots__slot--filled {
  background-color: var(--color-accent);
  border-style: solid;
  border-color: var(--color-accent);
  color: white;
}

.alice-slots__slot--current:not(.alice-slots__slot--filled) {
  border-color: var(--color-accent);
  background-color: rgba(67, 97, 238, 0.1);
}

.alice-slots__content {
  font-weight: 600;
  font-size: 0.625rem;
  text-transform: uppercase;
}

.alice-slots__placeholder {
  font-weight: 500;
}

.alice-slots__phrase {
  margin: 1rem 0 0;
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-accent);
  letter-spacing: 0.1em;
}
</style>
