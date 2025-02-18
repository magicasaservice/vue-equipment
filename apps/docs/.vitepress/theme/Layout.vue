<template>
  <Layout>
    <template #home-hero-info>
      <div class="flex flex-col items-center gap-8">
        <div class="flex h-full w-full max-w-96 items-center justify-center">
          <img
            src="/images/carabiner.png"
            alt="Vue Equipment"
            class="h-full w-auto"
          />
        </div>
        <div class="flex flex-col gap-8 px-4">
          <h1
            class="type-surface-display-md -strong text-surface"
            v-html="frontmatter.hero.name"
          />
          <h2 class="flex flex-col">
            <span
              class="type-surface-title-lg -strong"
              v-html="frontmatter.hero.tagline"
            />
            <span
              class="type-surface-title-lg -strong text-surface-subtle"
              v-html="frontmatter.hero.text"
            />
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
  document.documentElement.setAttribute('data-theme', 'vue-equipment')

  watchEffect(() => {
    document.documentElement.setAttribute(
      'data-color-mode',
      isDark.value ? 'dark' : 'light'
    )
  })
})
</script>
