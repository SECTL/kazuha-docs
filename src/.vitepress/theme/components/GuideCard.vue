<template>
  <a :href="link" class="guide-card" :target="isExternal ? '_blank' : '_self'" rel="noreferrer">
    <div class="guide-card-content">
      <div class="guide-card-title">{{ title }}</div>
      <div v-if="subtitle" class="guide-card-subtitle">{{ subtitle }}</div>
    </div>
  </a>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    default: ''
  },
  link: {
    type: String,
    required: true
  }
})

const isExternal = computed(() => /^(https?:)?\/\//.test(props.link))
</script>

<style scoped>
.guide-card {
  display: block;
  padding: 24px 26px;
  border-radius: 20px;
  background: rgba(17, 23, 34, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
  text-decoration: none;
  color: inherit;
  min-height: 120px;
}

.guide-card:hover {
  transform: translateY(-2px);
  border-color: rgba(111, 143, 245, 0.35);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.18);
}

.guide-card-title {
  font-size: 1.55rem;
  font-weight: 700;
  color: var(--vp-c-brand-3);
  margin-bottom: 0.5rem;
}

.guide-card-subtitle {
  font-size: 1rem;
  color: var(--vp-text-muted);
  line-height: 1.75;
  max-width: 52ch;
}

@media (max-width: 768px) {
  .guide-card {
    padding: 20px;
    min-height: auto;
  }
  .guide-card-title {
    font-size: 1.35rem;
  }
}
</style>
