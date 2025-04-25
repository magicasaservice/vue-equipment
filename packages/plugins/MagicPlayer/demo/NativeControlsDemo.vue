<template>
  <div class="aspect-[16/9] w-full">
    <magic-player-provider
      id="magic-player-native-controls-demo"
      :options="{
        src: 'https://stream.mux.com/3wVFr42nN3VqIVv01ugl00oSJTzKlhsZ01ep2yKz5vqeZ8.m3u8',
        srcType: 'hls',
      }"
    >
      <magic-player-video controls />
    </magic-player-provider>
  </div>
</template>
