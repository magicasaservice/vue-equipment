<template>
  <Layout></Layout>
</template>

<script lang="ts" setup>
import DefaultTheme from 'vitepress/theme'
import { useData } from 'vitepress'
import { onMounted, watchEffect } from 'vue'
const { Layout } = DefaultTheme
const { isDark } = useData()

onMounted(() => {
  watchEffect(() => {
    document.documentElement.setAttribute(
      'data-color-mode',
      isDark.value ? 'dark' : 'light'
    )
  })
})
</script>
