<!-- prettier-ignore -->
# pinia-easier

1. Are you confused about pinia that why its store modules always export function 'useXXXstore' instead of 'XXXstore'. Then we provide a function 'defineStoreProxy' which aim to replace 'defineStore' from 'pinia'.It can help you to create a proxy wrapping the store with automatically initialization instead of function 'useXXXstore'.
   <br />
2. And function 'aref' (means 'ref' with actions) can help you group a ref variable with its actions and getters. Sure, it's not as important as 'defineStoreProxy'. It's just a standard, which may be better then normal standard.

## Setup

```sh
npm install pinia-easier
```

## Use

Package pinia-easier exports 2 functions: "defineStoreProxy" and "aref".

###### There is a demo without 'aref' below.

```ts
// counter.ts
import { computed, ref } from 'vue'
import { defineStoreProxy } from '../../lib/storeProxy'

export const counterStore = defineStoreProxy('counter', () => {
  const num = ref(0)
  const doubleCount = computed(() => num.value * 2)
  function increment() {
    num.value++
  }
  return { num, doubleCount, increment }
})
```

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

###### This is a demo with 'aref' below.

```ts
// counter.ts
import { computed } from 'vue'
import { defineStoreProxy } from '../../lib/storeProxy'
import { aref } from 'lib/aref'

export const counterProxy = defineStoreProxy('counter', () => {
  return {
    num: aref(0, (ctx) => ({
      doubleCount: computed(() => ctx.value * 2),
      increment() {
        ctx.value++
      },
      increment2: () => ctx.value++
    }))
  }
})
```

```html
<script setup lang="ts">
  import { counterProxy } from '@/stores/counter'

  // It's ok to destruct 'counterProxy'
  const { num } = counterProxy
  /* 
  (property) num: {
    doubleCount: number;
    increment: () => void;
    value: number;
  }

  This is the type of num. As you could see,
  'num' is very similar to a ref variable in vue.

  There is 2 differences between them:
  1. property: besides  'value', the variable created
     by 'aref' has more props customized by you
  2. destructuring in <template>: the variable created
     by 'aref' voids destructuring in <template> to use
     other props (such as {{ num.value }} instead of {{ num }})
*/
</script>

<template>
  <button @click="num.increment">
    {{ num.value }}
    {{ num.doubleCount }}
  </button>
</template>
```
