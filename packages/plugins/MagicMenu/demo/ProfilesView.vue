<template>
  <magic-menu-view id="profiles-view">
    <magic-menu-item id="lol">
      <span>Christoph Jeworutzki ></span>
      <profile-view />
    </magic-menu-item>
    <magic-menu-item>
      <span>Robin Scholz ></span>
      <profile-view />
    </magic-menu-item>
    <magic-menu-item>Edit…</magic-menu-item>
    <magic-menu-item id="test">Add Profile…</magic-menu-item>
  </magic-menu-view>
</template>

<script lang="ts" setup>
import ProfileView from './ProfileView.vue'
</script>
