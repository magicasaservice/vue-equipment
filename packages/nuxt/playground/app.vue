<template>
  <magic-scroll-provider>
    <div class="w-full aspect-[16/9]">
      <magic-player
        provider="file"
        src="https://stream.mux.com/c2sidhKoTaKUTgqqACU8AsRRq02uUbEFLrgGQXDjlJks/high.mp4"
      >
        <magic-player-controls />
      </magic-player>
    </div>
  </magic-scroll-provider>
</template>

<script lang="ts" setup>
const easings = useEasings()
const scrollTo = useScrollTo()

console.log('easings:', easings)
console.log('scrollTo:', scrollTo)
</script>
