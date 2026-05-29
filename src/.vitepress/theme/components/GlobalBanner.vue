<template>
  <Transition name="banner-slide">
    <div v-if="visible" class="global-banner" :class="{ 'global-banner--link': banner.link }">
      <a v-if="banner.link" :href="banner.link" class="global-banner__content">
        <span class="global-banner__text">{{ banner.text }}</span>
      </a>
      <span v-else class="global-banner__content">
        <span class="global-banner__text">{{ banner.text }}</span>
      </span>
      <button v-if="banner.closable" class="global-banner__close" @click="close" aria-label="关闭横幅">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useData } from 'vitepress'

const { theme } = useData()
const banner = computed(() => theme.value.banner || { enable: false })
const visible = ref(false)

const close = () => {
  visible.value = false
  document.documentElement.style.setProperty('--banner-height', '0px')
}

onMounted(() => {
  if (banner.value.enable) {
    visible.value = true
  }
})

watch(() => banner.value.enable, (val) => {
  if (val) {
    visible.value = true
  } else {
    visible.value = false
    document.documentElement.style.setProperty('--banner-height', '0px')
  }
})
</script>

<style scoped>
.global-banner {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 999;
  height: var(--banner-height, 40px);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 0 16px;
  background: linear-gradient(135deg, var(--vp-c-brand-1), var(--vp-c-brand-3));
  color: #fff;
  font-size: 13px;
  font-weight: 500;
  line-height: 1;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

.global-banner--link {
  cursor: pointer;
}

.global-banner__content {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  min-width: 0;
  color: inherit;
  text-decoration: none;
}

.global-banner__text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.global-banner__close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: none;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.15s;
}

.global-banner__close:hover {
  background: rgba(255, 255, 255, 0.35);
}

.banner-slide-enter-active,
.banner-slide-leave-active {
  transition: transform 0.3s cubic-bezier(0.1, 0.9, 0.2, 1),
              opacity 0.3s cubic-bezier(0.1, 0.9, 0.2, 1);
}

.banner-slide-enter-from {
  transform: translateY(-100%);
  opacity: 0;
}

.banner-slide-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}
</style>
