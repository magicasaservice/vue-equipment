<template>
  <Layout class="flex"></Layout>
</template>

<script lang="ts" setup>
import DefaultTheme from 'vitepress/theme'
import { useData } from 'vitepress'
import { onMounted, watchEffect } from 'vue'

const { Layout } = DefaultTheme
const { isDark } = useData()

onMounted(() => {
  document.documentElement.setAttribute(
      'data-theme', 'vue-equipment'
  )

  watchEffect(() => {
    document.documentElement.setAttribute(
      'data-color-mode',
      isDark.value ? 'dark' : 'light'
    )
  })
})
</script>
