<template>
  <magic-draggable
    id="default-demo"
    class="bg-surface-elevation-base w-full h-[20rem] rounded-md"
  >
    <div class="bg-surface-elevation-high aspect-square w-20 rounded-md"></div>
  </magic-draggable>
</template>

<style>
#default-demo {
  --magic-draggable-position: relative;
}
</style>
