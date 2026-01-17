<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="about">
    <div class="about__container">
      <h1 class="about__title">About Alice</h1>

      <section class="about__section">
        <h2>How to Play</h2>
        <ol class="about__list">
          <li>Each round presents a 3×3 grid of tiles</li>
          <li>Select tiles in sequence to form valid groups</li>
          <li>The type of grouping (sounds-like, phrases, etc.) changes each round</li>
          <li>Find all groups, leaving one tile behind - the "Alice"</li>
          <li>Collect all Alices to reveal the final phrase!</li>
        </ol>
      </section>

      <section class="about__section">
        <h2>Tips</h2>
        <ul class="about__list">
          <li>Pay attention to the round type - it tells you what kind of connections to look for</li>
          <li>Selection order matters! The tiles must be in the correct sequence</li>
          <li>You have 3 mistakes per round - use them wisely</li>
          <li>Click a selected tile to deselect it and tiles after it</li>
        </ul>
      </section>

      <section class="about__section">
        <h2>Daily Puzzle</h2>
        <p>
          A new puzzle is available each day. Come back daily to keep your streak going!
        </p>
      </section>

      <RouterLink to="/" class="about__back">
        ← Back to Game
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
.about {
  flex: 1;
  padding: 2rem 1rem;
}

.about__container {
  max-width: 560px;
  margin: 0 auto;
}

.about__title {
  margin: 0 0 2rem;
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-primary);
  text-align: center;
}

.about__section {
  margin-bottom: 2rem;
}

.about__section h2 {
  margin: 0 0 0.75rem;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-primary);
}

.about__section p {
  margin: 0;
  line-height: 1.6;
  color: var(--color-secondary);
}

.about__list {
  margin: 0;
  padding-left: 1.25rem;
  line-height: 1.8;
  color: var(--color-secondary);
}

.about__list li {
  margin-bottom: 0.25rem;
}

.about__back {
  display: inline-block;
  margin-top: 1rem;
  color: var(--color-accent);
  text-decoration: none;
  font-weight: 500;
}

.about__back:hover {
  text-decoration: underline;
}
</style>
