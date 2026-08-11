<template>
  <ChildNoTransition class="external-class" />
  <ChildWithTransition class="external-class" />
</template>

<script setup lang="ts" vapor>
import ChildNoTransition from './ChildNoTransition.vue'
import ChildWithTransition from './ChildWithTransition.vue'
</script>
