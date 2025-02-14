<template>
  <Layout>
    <template #home-hero-info>
      <div class="flex flex-col gap-8 items-center">
       <div class="flex items-center justify-center w-full h-full max-w-96">
          <img src="/images/carabiner.png" alt="Vue Equipment" class="w-auto h-full" />
        </div>
      <div class="flex flex-col gap-8 px-4">
        <h1 v-html="frontmatter.hero.name" class="type-surface-display-md -strong text-surface" />
        <h2 class="flex flex-col">
          <span v-html="frontmatter.hero.tagline" class="type-surface-title-lg -strong " />
          <span v-html="frontmatter.hero.text" class="type-surface-title-lg -strong text-surface-subtle" />
        </h2>
      </div>
      </div>
    </template>
  </Layout>
</template>

<script lang="ts" setup>
import DefaultTheme from 'vitepress/theme'
import { useData } from 'vitepress'
import { onMounted, watchEffect } from 'vue'

const { Layout } = DefaultTheme
const { isDark, frontmatter } = useData()

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
