<template>
  <div class="aspect-[16/9] w-full">
    <magic-player-provider
      id="magic-player-autoplay-demo"
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
