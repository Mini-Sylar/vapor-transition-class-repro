<template>
  <Transition>
    <div v-bind="attrs" class="box internal-box">
      B) same component, root wrapped in &lt;Transition&gt; — external class WINS, internal-box is gone
    </div>
  </Transition>
</template>

<script setup lang="ts" vapor>
import { useAttrs } from 'vue'
defineOptions({ inheritAttrs: false })
const attrs = useAttrs()
</script>
