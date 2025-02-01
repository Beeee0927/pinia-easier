import { computed, ref } from 'vue'
import { defineStoreProxy } from '../../src/storeProxy'

export const counterProxy = defineStoreProxy('counter', () => {
  const num = ref(0)
  const doubleCount = computed(() => num.value * 2)
  function increment() {
    num.value++
  }
  return { num, doubleCount, increment }
})
