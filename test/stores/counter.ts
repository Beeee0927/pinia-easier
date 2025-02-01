import { computed, ref } from 'vue'
// import { defineStoreProxy } from '../../src/storeProxy'
import { defineStoreProxy } from 'pinia-easier'

export const counterProxy = defineStoreProxy('counter', () => {
  const num = ref(0)
  const doubleCount = computed(() => num.value * 2)
  function increment() {
    num.value++
  }
  return { num, doubleCount, increment }
})
