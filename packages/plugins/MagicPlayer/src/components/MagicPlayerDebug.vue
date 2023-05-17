<template>
  <div class="player-debug">
    <table>
      <tbody>
        <tr>
          <td>currentTime</td>
          <td>{{ currentTime }}</td>
        </tr>
        <tr>
          <td>duration</td>
          <td>{{ duration }}</td>
        </tr>
        <tr>
          <td>waiting</td>
          <td>{{ waiting }}</td>
        </tr>
        <tr>
          <td>seeking</td>
          <td>{{ seeking }}</td>
        </tr>
        <tr>
          <td>ended</td>
          <td>{{ ended }}</td>
        </tr>
        <tr>
          <td>stalled</td>
          <td>{{ stalled }}</td>
        </tr>
        <tr>
          <td>buffered</td>
          <td>{{ buffered }}</td>
        </tr>
        <tr>
          <td>playing</td>
          <td>{{ playing }}</td>
        </tr>
        <tr>
          <td>rate</td>
          <td>{{ rate }}</td>
        </tr>
        <tr>
          <td>volume</td>
          <td>{{ volume }}</td>
        </tr>
        <tr>
          <td>muted</td>
          <td>{{ muted }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { inject } from 'vue'
import { mediaApiInjectionKey } from './../types'
const {
  currentTime,
  duration,
  waiting,
  seeking,
  ended,
  stalled,
  buffered,
  playing,
  rate,
  volume,
  muted,
} = inject(mediaApiInjectionKey)!
</script>

<style scoped>
.player-debug {
  position: absolute;
  width: 100%;
  max-width: 320px;
  top: 1rem;
  right: 1rem;
  padding: 1rem;
  border-radius: 0.375rem;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(32px);
  color: white;
  font-family: monospace;
  font-size: 0.8rem;
}
</style>
