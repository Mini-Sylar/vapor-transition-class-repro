<template>
  <Transition>
    <div ref="el" v-bind="attrs" class="box internal-box">
      <div>B) same component, root wrapped in &lt;Transition&gt; — external class WINS, internal-box is gone</div>
      <code>class="{{ resultClass }}"</code>
    </div>
  </Transition>
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
