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
    <div class="alice-slots__rounds">
      <div
        v-for="(slot, index) in slots"
        :key="index"
        class="alice-slots__round"
        :class="{
          'alice-slots__round--current': slot.isCurrent,
          'alice-slots__round--complete': slot.filled
        }"
      >
        <span class="alice-slots__label">
          Round {{ index + 1 }}/{{ totalRounds }}
        </span>
        <div
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
          <span v-else class="alice-slots__placeholder">?</span>
        </div>
        <span v-if="slot.filled" class="alice-slots__check">✓</span>
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
}

.alice-slots__rounds {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.alice-slots__round {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  position: relative;
}

.alice-slots__label {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-muted);
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.alice-slots__round--current .alice-slots__label {
  color: var(--color-accent);
}

.alice-slots__round--complete .alice-slots__label {
  color: var(--color-success);
}

.alice-slots__slot {
  width: 64px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-background);
  border: 2px dashed var(--color-border);
  border-radius: var(--radius-tile);
  font-size: 1rem;
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
  font-weight: 700;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

.alice-slots__placeholder {
  font-weight: 500;
}

.alice-slots__check {
  font-size: 0.875rem;
  color: var(--color-success);
  font-weight: 600;
}

.alice-slots__phrase {
  margin: 1.25rem 0 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-accent);
  letter-spacing: 0.1em;
  text-align: center;
}
</style>
