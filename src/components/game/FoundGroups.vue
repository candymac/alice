<script setup>
import { storeToRefs } from 'pinia'
import { useGameStore } from '@/stores/game'
import { getGroupColor } from '@/config/settings'

const gameStore = useGameStore()
const { foundGroups, groupsToFind } = storeToRefs(gameStore)
</script>

<template>
  <div class="found-groups" aria-label="Found groups">
    <h3 class="found-groups__title">
      Found: {{ foundGroups.length }} / {{ groupsToFind }}
    </h3>

    <ul v-if="foundGroups.length > 0" class="found-groups__list">
      <li
        v-for="(group, index) in foundGroups"
        :key="index"
        class="found-groups__item"
        :style="{
          '--group-color': getGroupColor(group.color).hex,
          '--group-bg': getGroupColor(group.color).bg
        }"
      >
        <span class="found-groups__words">
          {{ group.words.join(' + ') }}
        </span>
        <span class="found-groups__result">
          = {{ group.result }}
        </span>
      </li>
    </ul>

    <p v-else class="found-groups__empty">
      No groups found yet
    </p>
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
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.found-groups__item {
  padding: 0.75rem;
  background-color: var(--group-bg);
  border-left: 3px solid var(--group-color);
  border-radius: 0.25rem;
  font-size: 0.875rem;
}

.found-groups__words {
  font-weight: 500;
  color: var(--color-primary);
}

.found-groups__result {
  color: var(--group-color);
  font-weight: 600;
}

.found-groups__empty {
  margin: 0;
  color: var(--color-muted);
  font-size: 0.875rem;
  font-style: italic;
}
</style>
