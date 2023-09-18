<template>
  <nuxt-page />
</template>

<script lang="ts" setup>
const countdown = useCountdown({
  endDate: '2024-01-01',
  endTime: '00:00:00',
  timezone: 'Europe/Berlin',
})
const easings = useEasings()
const scrollTo = useScrollTo()
const viewportDimensions = useViewportDimensions()

console.log('countdown:', countdown)
console.log('easings:', easings)
console.log('scrollTo:', scrollTo)
console.log('viewportDimensions:', viewportDimensions)
</script>
