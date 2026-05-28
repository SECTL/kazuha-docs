<template>
  <section class="guide-header">
    <h1 class="guide-header-title">{{ title }}</h1>
    <p v-if="subtitle" class="guide-header-subtitle">{{ subtitle }}</p>
  </section>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    default: ''
  }
})
</script>

<style scoped>
.guide-header {
  padding: 32px 0 24px;
  margin-bottom: 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.guide-header-title {
  margin: 0;
  font-size: 2.6rem;
  line-height: 1.05;
  font-weight: 800;
  letter-spacing: -0.04em;
  color: var(--vp-c-brand-3);
}

.guide-header-subtitle {
  margin: 0.75rem 0 0;
  max-width: 70ch;
  font-size: 1.05rem;
  color: var(--vp-text-muted);
  line-height: 1.8;
}

@media (max-width: 768px) {
  .guide-header {
    padding: 24px 0 18px;
  }
  .guide-header-title {
    font-size: 2rem;
  }
}
</style>
