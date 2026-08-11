<template>
  <Transition>
    <div v-bind="attrs" class="box internal-box">
      C) VDOM, root wrapped in &lt;Transition&gt; — external class merges correctly
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { useAttrs } from 'vue'
defineOptions({ inheritAttrs: false })
const attrs = useAttrs()
</script>
