<template>
  <div class="w-full aspect-[9/16]">
    <magic-player-provider
      id="image-poster-demo-player"
      :style="{ '--magic-player-provider-aspect-ratio': '9/16' }"
      :options="{
        src: 'https://stream.mux.com/PniSBG6rbyou2x5jExB9EwYQAgBXGyqxXA023GC6JeXQ/highest.mp4',
      }"
    >
      <magic-player-video />
      <magic-player-poster>
        <img
          src="https://image.mux.com/PniSBG6rbyou2x5jExB9EwYQAgBXGyqxXA023GC6JeXQ/thumbnail.jpg?time=8"
          alt="Poster"
        />
      </magic-player-poster>
      <magic-player-overlay />
    </magic-player-provider>
  </div>
</template>
