<template>
  <div class="flex min-h-[calc(100svh-var(--docs-header))] flex-col">
    <div
      v-if="hero"
      class="flex w-full flex-1 flex-col items-center justify-center gap-10 pt-8 pb-12 xl:flex-row xl:gap-0 xl:pt-12"
    >
      <div class="w-full max-w-xl px-6">
        <img
          src="/images/carabiner.png"
          :alt="appTitle"
          width="2160"
          height="2160"
          class="h-auto w-full"
        />
      </div>

      <div class="flex flex-col items-center gap-8 px-4 text-center">
        <div class="flex flex-col items-center gap-6 px-4">
          <h1
            class="type-surface-display-md sm:type-surface-display-sm -strong text-surface text-balance"
          >
            {{ hero.name }}
          </h1>
          <div class="flex flex-col items-center gap-4">
            <p class="type-surface-title-lg -strong text-surface text-balance">
              {{ hero.tagline }}
            </p>
            <p
              class="type-surface-callout-lg text-surface-muted max-w-lg text-pretty"
            >
              {{ hero.text }}
            </p>
          </div>
        </div>

        <div
          class="grid w-full grid-cols-1 items-start justify-center gap-4 px-6 sm:flex"
        >
          <m-button
            v-for="action in hero.actions"
            :key="action.text"
            size="lg"
            :mode="action.mode ?? 'subtle'"
            as-child
            class="sm:w-[10.5rem]"
          >
            <nuxt-link :to="action.link">{{ action.text }}</nuxt-link>
          </m-button>
        </div>

        <docs-sponsors class="px-6" />
      </div>
    </div>

    <docs-footer />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ sidebar: false })

const { appTitle } = useAppConfig()

const { data: home } = await useAsyncData('home', () =>
  queryCollection('home').first()
)

const hero = computed(() => home.value?.hero)

useSeoMeta({
  description: () => home.value?.description,
})
</script>
