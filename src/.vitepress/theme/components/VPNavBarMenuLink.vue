<script lang="ts" setup>
import type { DefaultTheme } from 'vitepress/theme'
import { useData } from 'vitepress'
import VPLink from './VPLink.vue'

const MATCH_HASH_RE = /#.*$/
const HASH_OR_QUERY_RE = /[?#].*$/
const INDEX_OR_EXT_RE = /(?:(^|\/)index)?\.(?:md|html)$/

function normalize(path: string) {
  return decodeURI(path)
    .replace(HASH_OR_QUERY_RE, '')
    .replace(INDEX_OR_EXT_RE, '$1')
}

function isActive(currentPath: string, matchPath: string | undefined, asRegex = false) {
  if (matchPath === undefined) {
    return false
  }
  currentPath = normalize(`/${currentPath}`)
  if (asRegex) {
    return new RegExp(matchPath).test(currentPath)
  }
  if (normalize(matchPath) !== currentPath) {
    return false
  }
  const hashMatch = matchPath.match(MATCH_HASH_RE)
  if (hashMatch) {
    return (typeof document !== 'undefined' ? location.hash : '') === hashMatch[0]
  }
  return true
}

defineProps<{
  item: DefaultTheme.NavItemWithLink
}>()

const { page } = useData()
</script>

<template>
  <VPLink
    :class="{
      VPNavBarMenuLink: true,
      active: isActive(
        page.relativePath,
        item.activeMatch || item.link,
        !!item.activeMatch
      )
    }"
    :href="item.link"
    :target="item.target"
    :rel="item.rel"
    :icon="item.icon"
    :no-icon="item.noIcon"
    tabindex="0"
  >
    <span v-html="item.text"></span>
  </VPLink>
</template>

<style scoped>
.VPNavBarMenuLink {
  display: flex;
  align-items: center;
  padding: 0 12px;
  line-height: var(--vp-nav-height);
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-1);
  transition: color 0.25s;
}

.VPNavBarMenuLink.active {
  color: var(--vp-c-brand-1);
}

.VPNavBarMenuLink:hover {
  color: var(--vp-c-brand-1);
}
</style>
