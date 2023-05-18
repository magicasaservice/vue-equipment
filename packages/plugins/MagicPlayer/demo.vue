<template>
  <p>File [mp4]</p>
  <div class="w-full aspect-[16/9]">
    <magic-player
      provider="file"
      src="https://stream.mux.com/c2sidhKoTaKUTgqqACU8AsRRq02uUbEFLrgGQXDjlJks/high.mp4"
    >
      <magic-player-controls />
    </magic-player>
  </div>

  <p>Hls [m3u8]</p>
  <div class="w-full aspect-[16/9]">
    <magic-player
      provider="hls"
      src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"
    >
      <magic-player-controls />
    </magic-player>
  </div>
</template>
