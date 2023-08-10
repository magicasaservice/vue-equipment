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
    <magic-marquee class="py-4">
      <div class="flex gap-4">
        <span>Magic Marquee</span>
        <span>News Update</span>
        <span>Loud Headline</span>
      </div>
    </magic-marquee>
  </magic-scroll-provider>
</template>

<script lang="ts" setup>
const easings = useEasings()
const scrollTo = useScrollTo()
const modalApi = useModalApi('magic-modal-demo')

console.log('modalApi:', modalApi)
console.log('easings:', easings)
console.log('scrollTo:', scrollTo)
</script>
