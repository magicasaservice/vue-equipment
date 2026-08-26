<template>
  <div class="m-message"></div>
</template>

<script lang="ts" setup>
// `IMessageProps`, verbatim. v1 rendered an empty `<div>` against an empty
// ruleset and had zero usages anywhere. It is kept only so the wrapper set is a
// complete stand-in for the v1 registration. Safe to delete.
interface MMessageProps {
  mode?: 'ghost' | 'plain' | 'subtle'
  size?: 'xs' | 'sm' | 'md' | 'lg'
  active?: boolean
  disabled?: boolean
}

defineProps<MMessageProps>()
</script>
