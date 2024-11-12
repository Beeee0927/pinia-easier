import { computed } from 'vue'
import { defineStoreProxy } from '../../lib/storeProxy'
import { aref } from 'lib/aref'

// export const counterProxy = defineStoreProxy('counter', () => {
//   const num = ref(0)
//   const doubleCount = computed(() => num.value * 2)
//   function increment() {
//     num.value++
//   }
//   return { num, doubleCount, increment }
// })

export const counterStore = defineStoreProxy('counter', () => {
  return {
    num: aref(0, (ctx) => ({
      doubleCount: computed(() => ctx.value * 2),
      increment() {
        ctx.value++
      }
    }))
  }
})
