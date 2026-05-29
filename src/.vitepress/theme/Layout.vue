<template>
  <Layout>
    <template #layout-top>
      <GlobalBanner />
    </template>
  </Layout>
</template>

<script setup>
import DefaultTheme from 'vitepress/theme'
import GlobalBanner from './components/GlobalBanner.vue'

const { Layout } = DefaultTheme
</script>
