<template>
  <div>
    Nuxt module playground!

    <p>File [mp4]</p>
    <div class="w-full aspect-[16/9]">
      <magic-player
        provider="file"
        src="https://stream.mux.com/c2sidhKoTaKUTgqqACU8AsRRq02uUbEFLrgGQXDjlJks/high.mp4"
      >
        <magic-player-controls />
      </magic-player>
    </div>
  </div>
</template>
