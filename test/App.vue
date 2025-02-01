<script setup lang="ts">
import { counterProxy } from './stores/counter'
</script>

<template>
  <button @click="counterProxy.increment">
    {{ counterProxy.num }}
    {{ counterProxy.doubleCount }}
  </button>
</template>

<style scoped></style>
