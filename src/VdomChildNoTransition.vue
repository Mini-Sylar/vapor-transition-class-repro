<template>
  <div ref="el" v-bind="attrs" class="box internal-box">
    <div>D) VDOM, no &lt;Transition&gt; — external class merges correctly</div>
    <code>class="{{ resultClass }}"</code>
  </div>
</template>

<script setup lang="ts">
import { useAttrs, useTemplateRef, shallowRef, onMounted } from 'vue'
defineOptions({ inheritAttrs: false })
const attrs = useAttrs()
const el = useTemplateRef<HTMLElement>('el')
const resultClass = shallowRef('')
onMounted(() => {
  resultClass.value = el.value?.className ?? ''
})
</script>
