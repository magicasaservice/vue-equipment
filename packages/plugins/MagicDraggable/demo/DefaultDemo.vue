<template>
  <magic-draggable
    id="magic-draggable-demo"
    class="bg-surface-elevation-base w-full h-[20rem] rounded-md"
  >
    <div
      class="bg-surface-elevation-high aspect-square w-32 rounded-md flex items-center justify-center"
    >
      <m-badge>Drag me</m-badge>
    </div>
  </magic-draggable>
</template>

<style>
[data-id='magic-draggable-demo'] {
  --magic-draggable-position: relative;
  --magic-draggable-z-index: 50;
}
</style>
