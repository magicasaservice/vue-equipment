<template>
  <div class="magic-command-input">
    <slot>
      <input type="text" v-model="input" />
    </slot>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
const input = ref('')
</script>
