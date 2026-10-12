<template>
  <div class="bg-surface-high rounded-component-sm mt-5 mb-6 first:mt-0">
    <div
      v-if="filename || label"
      class="flex items-center gap-3 py-1 pr-1 pl-4"
    >
      <span class="docs-code text-surface-muted min-w-0 truncate">
        {{ filename || label }}
      </span>

      <div class="ml-auto flex shrink-0 items-center gap-0.5">
        <docs-code-action
          v-if="wrappable"
          :label="wrapped ? 'Stop wrapping lines' : 'Wrap long lines'"
          :active="wrapped"
          @click="wrapped = !wrapped"
        >
          <path d="M2.75 4h10.5M2.75 8h7.75a2 2 0 1 1 0 4H8.5M2.75 12h2" />
          <path d="m9.75 10.5-1.5 1.5 1.5 1.5" />
        </docs-code-action>

        <docs-code-copy :value="code" />
      </div>
    </div>

    <!-- Two real columns. The copy button used to be absolutely positioned over
         the code with a padding reserve, and the reserve did not travel with a
         horizontally scrolled line, so on a phone the icon sat on top of the
         import statement. A column cannot be scrolled under. -->
    <div class="grid grid-cols-[minmax(0,1fr)_auto]">
      <pre
        v-bind="$attrs"
        class="docs-code min-w-0 overflow-x-auto py-3.5 pl-4"
        :class="[
          wrapped ? 'docs-code-wrap' : '',
          filename || label ? 'pr-4' : 'pr-2',
        ]"
      ><slot /></pre>

      <div v-if="!filename && !label" class="p-1">
        <docs-code-copy :value="code" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({ inheritAttrs: false })

const props = defineProps<{
  code?: string
  language?: string
  filename?: string
  highlights?: Array<number>
  meta?: string
}>()

// A bare fence gets no header bar; a language on its own is not worth a strip
// of chrome, so only `bash` earns one, for the wrap toggle.
const wrappable = computed(() =>
  ['bash', 'sh', 'shell'].includes(props.language ?? '')
)
const label = computed(() => (wrappable.value ? 'Terminal' : ''))

const wrapped = ref(false)
</script>
