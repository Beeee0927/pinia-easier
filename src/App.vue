<script setup lang="ts">
import { mref } from '@/../packages/lib/storeProxy'
import { ref } from 'vue'

// type A = {
//   a: 1
//   b: 2
// }
// type B<T> = {
//   [key in keyof T as key extends 'a' ? never : key]: key
// }

// const b: B<{
//   a: string
//   b: string
// }> = {
//   a: '2',
//   b: 123
// }

const x = mref({
  // value: false,
  switch() {
    console.log('ok')
    this.value = !this.value
  }
})
</script>

<template>
  App
  <button @click="console.log(x.value)">{{ x }}</button>
</template>

<style scoped></style>
