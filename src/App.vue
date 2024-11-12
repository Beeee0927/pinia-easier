<script setup lang="ts">
import { counterStore } from '@/stores/counter'

const { num } = counterStore
</script>

<template>
  <button @click="num.increment">
    {{ num.value }}
    {{ num.doubleCount }}
  </button>
</template>

<style scoped></style>
