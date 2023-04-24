<template>
  <div ref="el">Target</div>
  <button @click="scroll">Click to scroll</button>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useScrollTo } from '@vue-equipment/composables'

const { scrollToTarget } = useScrollTo()
const el = ref()

const scroll = () => {
  scrollToTarget({ target: el, speed: 1000, offset: 50 })
}
</script>
