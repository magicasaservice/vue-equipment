<template>
  <div class="w-full aspect-[16/9]">
    <magic-player-provider
      id="autoplay-demo-player"
      :options="{
        autoplay: true,
        loop: true,
        src: 'https://stream.mux.com/kj7uNjRztuyNotBkAI55oUeVKSSN1C4ONrIYuYcRKxo/highest.mp4',
      }"
    >
      <magic-player-video />
    </magic-player-provider>
  </div>
</template>
