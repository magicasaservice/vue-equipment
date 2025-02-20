<template>
  <div
    class="vp-home-override flex w-full flex-col items-center gap-8 pb-12 pt-4 xl:pt-12"
  >
    <div
      class="flex flex-col items-center gap-10 xl:h-full xl:flex-row xl:gap-0"
    >
      <div class="relative w-full max-w-screen-sm px-6">
        <div class="w-full">
          <img src="/images/carabiner.png" alt="Vue Equipment" />
        </div>
      </div>
      <div class="flex flex-col items-center gap-10 px-4 text-center">
        <div class="flex flex-col items-center gap-6 px-4 text-center">
          <h1
            class="type-surface-display-md -strong text-surface"
            v-html="frontmatter.hero.name"
          />
          <h2 class="flex flex-col items-center">
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
        <div
          class="grid w-full grid-cols-2 items-start justify-center gap-3 px-6 sm:flex"
        >
          <m-button
            size="lg"
            mode="solid"
            variant="warning"
            as-child
            class="col-span-full sm:w-48"
          >
            <VPLink href="/overview/getting-started">Get Started</VPLink>
          </m-button>
          <m-button
            size="lg"
            mode="translucent"
            as-child
            class="col-span-1 sm:w-48"
          >
            <a
              href="https://github.com/magicasaservice/vue-equipment"
              target="_blank"
              ref="nooopener noreferrer"
            >
              View on Github
            </a>
          </m-button>
          <m-button
            size="lg"
            mode="translucent"
            as-child
            class="col-span-1 sm:w-48"
          >
            <a
              href="https://maas-engineering"
              target="_blank"
              ref="nooopener noreferrer"
            >
              Visit MaaS™
            </a>
          </m-button>
        </div>
        <div class="flex w-full flex-col items-center gap-3 px-6">
          <span class="type-surface-callout-lg -strong text-surface">
            Sponsored by
          </span>
          <div
            class="grid w-full max-w-screen-sm grid-cols-12 justify-center gap-3 sm:flex"
          >
            <nuxt-sponsor-card class="col-span-6 col-start-4 sm:w-48" />
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
