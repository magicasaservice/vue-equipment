<template>
  <div
    class="w-full h-screen flex flex-col items-start justify-start gap-12 p-8"
  >
    <pre>{{ countdown }}</pre>

    <pre>{{ linear }}</pre>
    <pre>{{ easeInQuad }}</pre>
    <pre>{{ easeOutQuad }}</pre>
    <pre>{{ easeInOutQuad }}</pre>
    <pre>{{ easeInCubic }}</pre>
    <pre>{{ easeOutCubic }}</pre>
    <pre>{{ easeInOutCubic }}</pre>
    <pre>{{ easeInQuart }}</pre>
    <pre>{{ easeOutQuart }}</pre>
    <pre>{{ easeInOutQuart }}</pre>
    <pre>{{ easeInQuint }}</pre>
    <pre>{{ easeOutQuint }}</pre>
    <pre>{{ easeInOutQuint }}</pre>

    <pre>{{ getScrollPosition }}</pre>
    <pre>{{ scrollTo }}</pre>
    <pre>{{ getDistance }}</pre>
    <pre>{{ getScrollDuration }}</pre>
  </div>
</template>

<script lang="ts" setup>
const countdown = useCountdown({
  endDate: '2024-01-01',
  endTime: '00:00:00',
  timezone: 'Europe/Berlin',
})
const {
  linear,
  easeInQuad,
  easeOutQuad,
  easeInOutQuad,
  easeInCubic,
  easeOutCubic,
  easeInOutCubic,
  easeInQuart,
  easeOutQuart,
  easeInOutQuart,
  easeInQuint,
  easeOutQuint,
  easeInOutQuint,
} = useEasings()
const { getScrollPosition, scrollTo, getDistance, getScrollDuration } =
  useScrollTo()
const viewportDimensions = useViewportDimensions()

console.log('viewportDimensions:', viewportDimensions)
</script>
