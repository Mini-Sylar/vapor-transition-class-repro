<template>
  <div ref="el" v-bind="attrs" class="box internal-box">
    <div>A) no &lt;Transition&gt; — external class merges correctly</div>
    <code>class="{{ resultClass }}"</code>
  </div>
</template>

<script setup lang="ts" vapor>
import { useAttrs, useTemplateRef, shallowRef, onMounted } from 'vue'
defineOptions({ inheritAttrs: false })
const attrs = useAttrs()
const el = useTemplateRef<HTMLElement>('el')
const resultClass = shallowRef('')
onMounted(() => {
  resultClass.value = el.value?.className ?? ''
})
</script>
