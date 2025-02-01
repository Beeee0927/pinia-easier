<!-- prettier-ignore -->
# pinia-easier

Are you confused about pinia that why its store modules always export hook 'useXXXstore' instead of 'XXXstore'. Then we provide a function 'defineStoreProxy' which aim to replace 'defineStore' from 'pinia'.It can help you to create a proxy wrapping the store with automatically initialization instead of hook 'useXXXstore'.

## Setup

```sh
npm install pinia-easier
```

## Use

Package pinia-easier exports a function "defineStoreProxy".

##### counter.ts

```ts
import { computed, ref } from 'vue'
import { defineStoreProxy } from '../../lib/storeProxy'

// completely same as 'defineStore'
export const counterStore = defineStoreProxy('counter', () => {
  const num = ref(0)
  const doubleCount = computed(() => num.value * 2)
  const increment = () => num.value++

  return { num, doubleCount, increment }
})
```

###### App.vue

```html
<script setup lang="ts">
  import { counterProxy } from '@/stores/counter'
</script>

<template>
  <!-- Don't destruct num, or it would lose reactivity -->
  <button @click="counterProxy.increment">
    {{ counterProxy.num }}
    {{ counterProxy.doubleCount }}
  </button>
</template>
```
