<template>
  <div class="component-preview max-w-full">
    <div class="vp-code-group">
      <div class="tabs">
        <input
          :id="previewTab"
          v-model="activeTab"
          value="preview"
          type="radio"
          class="active"
        />
        <label :for="previewTab">Preview</label>
        <input :id="codeTab" v-model="activeTab" value="code" type="radio" />
        <label :for="codeTab">Code</label>
      </div>
      <div class="blocks">
        <div
          :class="[
            'language-Vue vp-adaptive-theme',
            { active: activeTab === 'preview' },
          ]"
        >
          <div
            class="flex items-center justify-center px-4 py-8 sm:p-8 md:p-12"
          >
            <slot />
          </div>
        </div>
        <div class="w-full">
          <div
            v-if="mappedCode"
            :class="[
              'language-Vue vp-adaptive-theme',
              { active: activeTab === 'code' },
            ]"
          >
            <!-- <button title="Copy Code" class="copy" /> -->
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
