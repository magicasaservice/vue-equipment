<template>
  <div
    class="vp-home-override flex w-full flex-col items-center gap-8 pb-12 pt-4 xl:pt-12"
  >
    <div
      class="flex flex-col items-center gap-10 xl:h-full xl:flex-row xl:gap-0"
    >
      <div class="relative w-full max-w-xl px-6">
        <div class="w-full">
          <img src="/images/carabiner.png" alt="Vue Equipment" />
        </div>
      </div>
      <div class="flex flex-col items-center gap-8 px-4 text-center">
        <div class="flex flex-col items-center gap-6 px-4 text-center">
          <h1
            class="type-surface-display-md! -strong text-surface"
            v-html="frontmatter.hero.name"
          />
          <div class="flex flex-col items-center gap-4">
            <h2
              class="type-surface-title-lg! -strong"
              v-html="frontmatter.hero.tagline"
            />
            <p
              class="type-surface-callout-lg text-surface-muted max-w-lg"
              v-html="frontmatter.hero.text"
            />
          </div>
        </div>
        <div
          class="grid w-full grid-cols-2 items-start justify-center gap-4 px-6 sm:flex"
        >
          <m-button
            v-for="action in frontmatter.hero.actions"
            :key="action.text"
            size="lg"
            :mode="action.theme"
            as-child
            class="no-icon col-span-full sm:w-[10.5rem]"
          >
            <VPLink :href="action.link">{{ action.text }}</VPLink>
          </m-button>
        </div>
        <div class="flex w-full flex-col items-center gap-3 px-6">
          <span class="type-surface-callout-lg -strong text-surface">
            Sponsored by
          </span>
          <div
            class="grid w-full max-w-screen-sm grid-cols-12 justify-center gap-3 sm:flex"
          >
            <nuxt-sponsor-card class="col-span-6 col-start-4 sm:w-[10.5rem]" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useData } from 'vitepress'
import VPLink from 'vitepress/dist/client/theme-default/components/VPLink.vue'
import NuxtSponsorCard from '../sponsors/NuxtSponsorCard.vue'

const { frontmatter } = useData()
</script>
