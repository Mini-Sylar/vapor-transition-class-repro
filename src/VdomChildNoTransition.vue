<template>
  <div v-bind="attrs" class="box internal-box">
    D) VDOM, no &lt;Transition&gt; — external class merges correctly
  </div>
</template>

<script setup lang="ts">
import { useAttrs } from 'vue'
defineOptions({ inheritAttrs: false })
const attrs = useAttrs()
</script>
