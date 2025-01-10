<template>
  <div class="component-preview">
    <div class="vp-code-group">
      <div class="tabs">
        <input
          v-model="activeTab"
          value="preview"
          type="radio"
          id="preview"
          class="active"
        />
        <label for="preview">Preview</label>
        <input v-model="activeTab" value="code" type="radio" id="code" />
        <label for="code">Code</label>
      </div>
      <div class="blocks">
        <div
          v-show="activeTab === 'preview'"
          class="language-Vue vp-adaptive-theme"
        >
          <slot />
        </div>
        <div v-show="activeTab === 'code'" class="w-full">
          <div class="language-Vue vp-adaptive-theme !block" v-if="mappedCode">
            <button title="Copy Code" class="copy" />
            <div v-html="mappedCode" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  code: string
}

const { code } = defineProps<Props>()
const mappedCode = ref(decodeURIComponent(code ?? ''))

const activeTab = ref<'preview' | 'code'>('preview')
</script>
