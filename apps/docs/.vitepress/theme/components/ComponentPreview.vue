<template>
  <div class="component-preview">
    <div class="vp-code-group">
      <div class="tabs">
        <input
          v-model="activeTab"
          value="preview"
          type="radio"
          :id="previewTab"
          class="active"
        />
        <label :for="previewTab">Preview</label>
        <input v-model="activeTab" value="code" type="radio" :id="codeTab" />
        <label :for="codeTab">Code</label>
      </div>
      <div class="blocks">
        <div
          :class="[
            'language-Vue vp-adaptive-theme',
            { active: activeTab === 'preview' },
          ]"
        >
          <div class="flex justify-center items-center py-12 px-12">
            <slot />
          </div>
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

<script lang="ts" setup>
import { ref, useId } from 'vue'

interface Props {
  code: string
}

const { code } = defineProps<Props>()
const mappedCode = ref(decodeURIComponent(code ?? ''))

const codeTab = useId()
const previewTab = useId()

const activeTab = ref<'preview' | 'code'>('preview')
</script>
