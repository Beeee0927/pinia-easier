import { ref, computed } from 'vue'
import { aref, defineStoreProxy } from 'packages/lib/storeProxy'

export const counterStore = defineStoreProxy('counter', () => {
  return {
    count: aref(0, (ctx) => ({
      doubleCount: computed(() => ctx.value * 2),
      increment() {
        ctx.value++
      }
    }))
  }
})
