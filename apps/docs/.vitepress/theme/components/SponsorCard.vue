<template>
  <a
    :href="href"
    target="_blank"
    ref="nooopener noreferrer"
    class="sponsor-card border-component-primary-translucent text-surface rounded-surface-sm transition-color flex h-20 w-full items-center justify-center border-2 duration-150"
  >
    <slot />
  </a>
</template>

<script lang="ts" setup>
interface SponsorCardProps {
  href: string
}

defineProps<SponsorCardProps>()
</script>
