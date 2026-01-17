<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useGameStore } from '@/stores/game'
import { getGroupColor } from '@/config/settings'

const gameStore = useGameStore()
const { foundGroups, groupsToFind, selectedTiles, grid } = storeToRefs(gameStore)

// Get the words for currently selected tiles
const currentSelection = computed(() => {
  return selectedTiles.value.map(i => grid.value[i])
})

// Number of empty placeholder slots (excluding the active selection slot)
const emptySlots = computed(() => {
  const remaining = groupsToFind.value - foundGroups.value.length
  // If there's a selection, one slot is used for it
  const activeSlots = currentSelection.value.length > 0 ? 1 : 0
  return Math.max(0, remaining - activeSlots)
})

// Whether to show the active selection slot
const showActiveSlot = computed(() => {
  return currentSelection.value.length > 0 && foundGroups.value.length < groupsToFind.value
})
</script>

<template>
  <div class="found-groups" aria-label="Found groups">
    <h3 class="found-groups__title">
      Find {{ groupsToFind }} Groups:
    </h3>

    <div class="found-groups__list">
      <!-- Found groups (just show result, tiles stay on board) -->
      <div
        v-for="(group, index) in foundGroups"
        :key="'found-' + index"
        class="found-groups__item found-groups__item--found"
        :style="{
          '--group-color': getGroupColor(group.color).hex,
          '--group-bg': getGroupColor(group.color).bg
        }"
      >
        <span class="found-groups__result">{{ group.result }}</span>
      </div>

      <!-- Active selection slot (shows what you're building) -->
      <div
        v-if="showActiveSlot"
        class="found-groups__item found-groups__item--active"
      >
        <span class="found-groups__selection">{{ currentSelection.join(' + ') }}</span>
      </div>

      <!-- Empty placeholder boxes -->
      <div
        v-for="n in emptySlots"
        :key="'empty-' + n"
        class="found-groups__item found-groups__item--empty"
      >
        <span class="found-groups__placeholder-text">?</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.found-groups {
  padding: 1rem;
  background-color: var(--color-surface);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
}

.found-groups__title {
  margin: 0 0 0.75rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.found-groups__list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.found-groups__item {
  padding: 0.75rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  min-height: 3.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.found-groups__item--found {
  background-color: var(--group-bg);
  border-left: 3px solid var(--group-color);
}

.found-groups__item--empty {
  background-color: var(--color-background);
  border: 2px dashed var(--color-border);
  align-items: center;
}

.found-groups__item--active {
  background-color: var(--color-surface);
  border: 2px solid var(--color-accent);
  border-left-width: 3px;
}

.found-groups__result {
  color: var(--group-color);
  font-weight: 600;
}

.found-groups__selection {
  color: var(--color-accent);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

.found-groups__placeholder-text {
  color: var(--color-muted);
  font-size: 1.25rem;
  font-weight: 500;
}
</style>
