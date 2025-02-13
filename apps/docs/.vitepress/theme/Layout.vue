<template>
  <Layout>
    <template #home-hero-image>
      <div class="flex items-center justify-center w-full h-full">
        <img src="../../public/images/carabiner.png" alt="Vue Equipment" class="w-48 h-48 sm:w-64 sm:h-64 lg:w-full lg:h-full max-h-96 max-w-96" />
      </div>
    </template>
  </Layout>
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
