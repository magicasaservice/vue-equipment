<template>
  <div class="w-full aspect-[16/9]">
    <magic-player-provider
      id="autoplay-demo-player"
      :options="{
        autoplay: true,
        loop: true,
        src: 'https://stream.mux.com/c2sidhKoTaKUTgqqACU8AsRRq02uUbEFLrgGQXDjlJks/high.mp4',
      }"
    >
      <magic-player-video />
    </magic-player-provider>
  </div>
</template>
