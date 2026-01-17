<script setup>
// Footer component - minimal for now
</script>

<template>
  <footer class="footer">
    <div class="footer__container">
      <p class="footer__text">
        A word puzzle game
      </p>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  margin-top: auto;
  padding: 1rem;
  text-align: center;
  border-top: 1px solid var(--color-border);
}

.footer__container {
  max-width: 600px;
  margin: 0 auto;
}

.footer__text {
  margin: 0;
  font-size: 0.75rem;
  color: var(--color-muted);
}
</style>
