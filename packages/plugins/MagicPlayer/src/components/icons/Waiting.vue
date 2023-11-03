<template>
  <svg viewBox="0 0 48 48">
    <circle
      cx="24"
      cy="24"
      r="20"
      fill="none"
      stroke-width="4"
      stroke-linecap="round"
    />
  </svg>
</template>

<style scoped>
svg > circle {
  fill: none;
  transform-origin: center;
  stroke-dasharray: 1, 200;
  stroke-dashoffset: 0;
  animation: spinner 2.5s ease-in-out infinite;
  stroke: currentColor;
}

@keyframes spinner {
  0% {
    stroke-dasharray: 1, 200;
    transform: rotate(0deg);
  }
  50% {
    stroke-dasharray: 100, 200;
    transform: rotate(360deg);
  }
  100% {
    stroke-dasharray: 1, 200;
    transform: rotate(720deg);
  }
}
</style>
