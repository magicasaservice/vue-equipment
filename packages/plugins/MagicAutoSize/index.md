# Magic Auto Size

A container that automatically grows and shrinks to its child’s size with an animation.

## Usage

```vue
<template>
  <magic-auto-size>…</magic-auto-size>
</template>
```

## Caveats

In order for this the auto sizing to work, the component’s children need to be either given a fixed width or be set to `display: inline-block`.
