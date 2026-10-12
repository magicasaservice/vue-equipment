<template>
  <footer
    class="docs-caption text-surface-muted flex flex-col items-center gap-1 px-6 pt-4 pb-6 text-center md:px-8"
  >
    <p class="flex items-center gap-2">
      <base-icon name="maas-robot" aria-hidden="true" class="size-3" />
      <span>
        Engineered and Designed by
        <a
          href="https://maas.engineering"
          target="_blank"
          rel="noopener noreferrer"
          class="docs-link"
        >
          Magic as a Service™
        </a>
      </span>
    </p>

    <p class="flex flex-col items-center gap-x-2 sm:flex-row">
      <span>
        Released under the
        <a
          :href="`${repositoryUrl}/blob/main/LICENSE`"
          target="_blank"
          rel="noopener noreferrer"
          class="docs-link"
        >
          MIT License
        </a>
      </span>
      <span class="flex gap-2">
        <span aria-hidden="true" class="hidden sm:inline">•</span>
        <a
          v-for="link in legalLinks"
          :key="link.href"
          :href="link.href"
          target="_blank"
          rel="noopener noreferrer"
          class="docs-link"
        >
          {{ link.label }}
        </a>
        <span>© {{ year }}</span>
      </span>
    </p>
  </footer>
</template>

<script setup lang="ts">
const { repositoryUrl } = useAppConfig()

const legalLinks = [
  { label: 'Legal Notice', href: 'https://maas.engineering/legal-notice' },
  { label: 'Privacy Policy', href: 'https://maas.engineering/privacy-policy' },
]

const year = new Date().getFullYear()
</script>
