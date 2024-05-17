<template>
  <magic-menu-provider :id="id">
    <menu-bar />
  </magic-menu-provider>
</template>

<script lang="ts" setup>
import MenuBar from './demo/MenuBar.vue'
const id = 'magic-menu--demo'
</script>
