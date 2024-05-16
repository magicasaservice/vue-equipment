<template>
  <magic-menu-provider :id="id">
    <menu-bar />
  </magic-menu-provider>
</template>

<script lang="ts" setup>
import MenuBar from './demo/MenuBar.vue'
import FileView from './demo/FileView.vue'
import EditView from './demo/EditView.vue'
import ViewView from './demo/ViewView.vue'
import ProfilesView from './demo/ProfilesView.vue'

const id = 'magic-menu--demo'
</script>
