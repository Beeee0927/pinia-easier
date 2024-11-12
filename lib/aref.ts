import { ref, type Ref } from 'vue'

// ref with actions
export function aref<T, A extends object>(data: T, setup: (ctx: Ref<T>) => A) {
  const dataRef = ref(data) as Ref<T>
  const actions = setup(dataRef)
  const res = {} as A & { value: T }
  Reflect.defineProperty(res, 'value', {
    get() {
      return dataRef.value
    },
    set(v: T) {
      dataRef.value = v
      return true
    }
  })
  return Object.assign(res, actions)
}
