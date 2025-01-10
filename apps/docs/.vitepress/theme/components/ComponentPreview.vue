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
          :class="[
            'language-Vue vp-adaptive-theme',
            { active: activeTab === 'preview' },
          ]"
        >
          <slot />
        </div>
        <div class="w-full">
          <div
            :class="[
              'language-Vue vp-adaptive-theme',
              { active: activeTab === 'code' },
            ]"
            v-if="mappedCode"
          >
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
