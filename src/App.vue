<script setup lang="ts">
import { counterStore } from '@/stores/counter'
import { computed } from 'vue'

const { count } = counterStore
</script>

<template>
  App
  <button @click="count.increment">{{ count.doubleCount }}</button>
</template>

<style scoped></style>
