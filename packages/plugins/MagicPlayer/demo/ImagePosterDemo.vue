<template>
  <div class="w-full aspect-[16/9]">
    <magic-player-provider
      id="image-poster-demo-player"
      :options="{
        src: 'https://stream.mux.com/c2sidhKoTaKUTgqqACU8AsRRq02uUbEFLrgGQXDjlJks/high.mp4',
      }"
    >
      <magic-player-video />
      <magic-player-poster>
        <img
          src="https://image.mux.com/c2sidhKoTaKUTgqqACU8AsRRq02uUbEFLrgGQXDjlJks/thumbnail.jpg"
          alt="Poster"
        />
      </magic-player-poster>
      <magic-player-overlay />
    </magic-player-provider>
  </div>
</template>
