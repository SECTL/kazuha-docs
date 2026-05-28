<script setup lang="ts">
import { computed } from 'vue'

const EXTERNAL_URL_RE = /^(?:[a-z]+:|\/\/)/i

const iconMap: Record<string, string> = {
  home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10.5L12 3l9 7.5V21a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V10.5Z"/><path d="M9 21V13h6v8"/></svg>',
  book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5C4 18.7 4.7 18 5.5 18H15a2 2 0 0 0 2-2V4.5"/><path d="M20 4.5V19.5C20 20.3 19.3 21 18.5 21H9"/></svg>',
  'help-circle': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 1 1 5.82 1c0 1.5-1.5 2-1.5 2"/><path d="M12 17h.01"/></svg>',
  code: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 18l6-6-6-6"/><path d="M8 6L2 12l6 6"/></svg>',
  'message-circle': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-12.6 8.38 8.38 0 0 1 3.8.9L21 3v8.5Z"/><path d="M8 14h4"/><path d="M8 10h8"/></svg>',
  rocket: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21v-2a4 4 0 0 1 4-4h2"/><path d="M15 3a4 4 0 0 1 4 4c0 2.4-.5 4.5-1 6.5-1.4 1.4-3.5 3-5 3S9.4 15.4 8 14C6.4 12.4 5 10.4 5 7.5S7.4 3 9 3h6Z"/><path d="M9 9h.01"/></svg>',
  'book-open': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3.5C2 2.7 2.7 2 3.5 2H11c.6 0 1.2.2 1.7.6L12 5l-1.2-2.4A2.52 2.52 0 0 0 9 2H3.5C2.7 2 2 2.7 2 3.5v17c0 .8.7 1.5 1.5 1.5H11c.6 0 1.2-.2 1.7-.6L12 19l-1.2 2.4A2.52 2.52 0 0 1 9 22H3.5C2.7 22 2 21.3 2 20.5v-17Z"/><path d="M12 3.5C12 2.7 12.7 2 13.5 2H20.5C21.3 2 22 2.7 22 3.5v17c0 .8-.7 1.5-1.5 1.5H13c-.6 0-1.2-.2-1.7-.6L12 19l1.2 2.4c.2.3.6.6 1.1.6h6.4c.8 0 1.5-.7 1.5-1.5v-17c0-.8-.7-1.5-1.5-1.5H13.5c-.6 0-1.2.2-1.7.6L12 5l.7-1.5Z"/></svg>',
  download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12"/><path d="M8 11l4 4 4-4"/><path d="M4 21h16"/></svg>',
  compass: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M16 8 10 14l-2 6 6-2 6-6-4-4Z"/></svg>',
  'check-circle': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9 12l2 2 4-4"/></svg>',
  info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>',
  layout: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3h18v18H3V3Z"/><path d="M12 3v18"/><path d="M3 12h18"/></svg>',
  settings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06A1.65 1.65 0 0 0 15 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 8.6 15a1.65 1.65 0 0 0-1.82-.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 15 8.6a1.65 1.65 0 0 0 1.82.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9Z"/></svg>',
  tool: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 7.3 16.7 5.3a2 2 0 0 1 2.8 0l.2.2a2 2 0 0 1 0 2.8l-2 2L13 16l-5 1 1-5 6.7-6.7Z"/><path d="M4 20l4-4"/></svg>',
  palette: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20a8 8 0 0 1 0-16 4 4 0 0 1 0 8h-2a2 2 0 0 0-2 2 2 2 0 0 0 2 2h2Z"/><circle cx="15.5" cy="8.5" r="1.5"/><circle cx="8.5" cy="8.5" r="1.5"/><circle cx="12" cy="15.5" r="1.5"/></svg>',
  droplet: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3.5C7 10 5 13.5 5 16a7 7 0 0 0 14 0c0-2.5-2-6-7-12.5Z"/></svg>',
  layers: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2 2 7l10 5 10-5L12 2Z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>',
  monitor: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="14" rx="2"/><path d="M8 21h8"/><path d="M12 18v3"/></svg>',
  maximize: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h6V2H2v8h2V4Z"/><path d="M20 20h-6v2h8v-8h-2v6Z"/></svg>',
  database: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5"/><path d="M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"/></svg>',
  server: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="7" rx="2"/><rect x="2" y="13" width="20" height="7" rx="2"/><path d="M6 8h.01"/><path d="M6 17h.01"/></svg>',
  archive: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8H3v13h18V8Z"/><path d="M3 8l9-5 9 5"/><path d="M9 12h6"/></svg>',
  save: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z"/><path d="M17 21V13H7v8"/><path d="M7 3v6h6"/></svg>',
  bell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>',
  star: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3 6 6 .5-4.5 4.4L17 20l-5-2.7L7 20l.5-7.1L3 8.5 9 8l3-6Z"/></svg>',
  'edit-2': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3 7 13l-4 1 1-4 10-10 3 3Z"/><path d="M14 7l3 3"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>',
  sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2"/><path d="M12 21v2"/><path d="M4.22 4.22l1.42 1.42"/><path d="M18.36 18.36l1.42 1.42"/><path d="M1 12h2"/><path d="M21 12h2"/><path d="M4.22 19.78l1.42-1.42"/><path d="M18.36 5.64l1.42-1.42"/></svg>'
}

const props = defineProps<{
  tag?: string
  href?: string
  noIcon?: boolean
  icon?: string | { svg: string }
  target?: string
  rel?: string
}>()

const tag = computed(() => props.tag ?? (props.href ? 'a' : 'span'))
const isExternal = computed(
  () =>
    (props.href && EXTERNAL_URL_RE.test(props.href)) ||
    props.target === '_blank'
)

const iconSvg = computed(() => {
  if (!props.icon) return undefined
  if (typeof props.icon === 'object') return props.icon.svg
  return iconMap[props.icon]
})
</script>

<template>
  <component
    :is="tag"
    class="VPLink"
    :class="{
      link: href,
      'vp-external-link-icon': isExternal,
      'no-icon': props.noIcon || !props.icon
    }"
    :href="href"
    :target="target ?? (isExternal ? '_blank' : undefined)"
    :rel="rel ?? (isExternal ? 'noreferrer' : undefined)"
  >
    <span v-if="props.icon && !props.noIcon" class="link-icon">
      <span v-if="iconSvg" class="icon-svg" v-html="iconSvg" />
      <span v-else class="icon-fallback" />
    </span>
    <slot />
  </component>
</template>

<style scoped>
.link-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.45em;
  width: 1.1em;
  min-width: 1.1em;
  height: 1.1em;
  color: currentColor;
}

.link-icon .icon-svg {
  display: inline-flex;
  width: 1.1em;
  height: 1.1em;
}

.link-icon .icon-svg svg {
  width: 100%;
  height: 100%;
}

.link-icon .icon-fallback {
  width: 0.7em;
  height: 0.7em;
  border-radius: 50%;
  background-color: currentColor;
  opacity: 0.4;
}
</style>
