<template>
  <div v-bind="attrs" class="box internal-box">
    A) no &lt;Transition&gt; — external class merges correctly
  </div>
</template>

<script setup lang="ts" vapor>
import { useAttrs } from 'vue'
defineOptions({ inheritAttrs: false })
const attrs = useAttrs()
</script>
