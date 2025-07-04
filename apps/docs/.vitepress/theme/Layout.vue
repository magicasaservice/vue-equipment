<template>
  <Layout>
    <template #aside-bottom>
      <div class="flex w-full flex-col items-center gap-3 px-4">
        <span class="type-surface-callout-sm -strong text-surface">
          Sponsored by
        </span>
        <div class="flex w-full flex-col gap-3">
          <nuxt-sponsor-card
            class="col-span-8 col-start-3 sm:col-span-6 sm:col-start-4"
          />
        </div>
      </div>
    </template>
  </Layout>
</template>

<script lang="ts" setup>
import DefaultTheme from 'vitepress/theme'
import { useData } from 'vitepress'
import { onMounted, watchEffect } from 'vue'
import NuxtSponsorCard from './components/sponsors/NuxtSponsorCard.vue'

const { Layout } = DefaultTheme
const { isDark } = useData()

onMounted(() => {
  document.body.setAttribute('data-theme', 'vue-equipment')
  document.body.setAttribute('class', 'bg-surface-base')
  document.documentElement.setAttribute('data-theme', 'vue-equipment')

  watchEffect(() => {
    document.body.setAttribute(
      'data-color-mode',
      isDark.value ? 'dark' : 'light'
    )
    document.documentElement.setAttribute(
      'data-color-mode',
      isDark.value ? 'dark' : 'light'
    )
  })
})
</script>
