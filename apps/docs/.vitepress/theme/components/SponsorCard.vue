<template>
  <a :href="href" target="_blank" ref="nooopener noreferrer">
    <m-button size="lg" mode="outline" icon block>
      <slot />
    </m-button>
  </a>
</template>

<script lang="ts" setup>
interface SponsorCardProps {
  href: string
}

defineProps<SponsorCardProps>()
</script>
