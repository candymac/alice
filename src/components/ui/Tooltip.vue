<script setup>
import { onMounted, onUnmounted } from 'vue'

const props = defineProps({
  /** Title for the tooltip */
  title: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['close'])

function handleClose() {
  emit('close')
}

function handleKeydown(e) {
  if (e.key === 'Escape') {
    handleClose()
  }
}

function handleClickOutside(e) {
  // Close if clicking the backdrop
  if (e.target.classList.contains('tooltip__backdrop')) {
    handleClose()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div
    class="tooltip__backdrop"
    @click="handleClickOutside"
  >
    <div
      class="tooltip"
      role="dialog"
      aria-modal="true"
      :aria-label="title"
    >
      <div class="tooltip__header">
        <h3 v-if="title" class="tooltip__title">{{ title }}</h3>
        <button
          class="tooltip__close"
          aria-label="Close"
          @click="handleClose"
        >
          &times;
        </button>
      </div>

      <div class="tooltip__content">
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped>
.tooltip__backdrop {
  position: fixed;
  inset: 0;
  z-index: 200;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 80px;
  background-color: rgba(0, 0, 0, 0.3);
}

.tooltip {
  max-width: 320px;
  background-color: var(--color-surface);
  border-radius: var(--radius-card);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  animation: tooltip-enter 0.2s ease;
}

@keyframes tooltip-enter {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.tooltip__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--color-border);
}

.tooltip__title {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-primary);
}

.tooltip__close {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  font-size: 1.25rem;
  color: var(--color-muted);
  cursor: pointer;
  border-radius: 50%;
  transition: all 0.15s ease;
}

.tooltip__close:hover {
  background-color: var(--color-background);
  color: var(--color-primary);
}

.tooltip__content {
  padding: 1rem;
  font-size: 0.875rem;
  line-height: 1.6;
  color: var(--color-secondary);
}

.tooltip__content :deep(p) {
  margin: 0 0 0.75rem;
}

.tooltip__content :deep(p:last-child) {
  margin-bottom: 0;
}
</style>
