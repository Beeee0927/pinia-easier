import type {
  StoreDefinition,
  _ExtractStateFromSetupStore,
  _ExtractGettersFromSetupStore,
  _ExtractActionsFromSetupStore,
  Pinia,
  StoreGeneric,
  DefineSetupStoreOptions
} from 'pinia'
import { ref, type Ref } from 'vue'
import { defineStore } from 'pinia'

// 第一步用 useStoreProxy 代理 ( defineStore 返回的 ) useStore
const useStoreProxy = <Id extends string, SS>(
  useStore: StoreDefinition<
    Id,
    _ExtractStateFromSetupStore<SS>,
    _ExtractGettersFromSetupStore<SS>,
    _ExtractActionsFromSetupStore<SS>
  >
  // ReturnType<typeof useStore> 即真实的 store 实例类型
  // 这里用 '&' 交叉 useStore 的函数类型，使其可以当作 useStore 来调用函数，
  // 可以传入参数 'pinia' 和 'hot'
  // 还用 '&' 交叉  一个 'value' 成员，用来返回内部维护的真实 store 对象，
  // ( 理念和 vue 的 ref 对象类似 )
): ReturnType<typeof useStore> & {
  (pinia?: Pinia | null | undefined, hot?: StoreGeneric): ReturnType<
    typeof useStore
  >
  value: ReturnType<typeof useStore>
} => {
  // 重复了一下上面的返回值类型
  type storeProxyType = ReturnType<typeof useStore> & {
    (pinia?: Pinia | null | undefined, hot?: StoreGeneric): ReturnType<
      typeof useStore
    >
    value: ReturnType<typeof useStore>
  }

  // 维护的真正的 store 对象
  // 注意这里维护的 store 对象始终是没有使用参数 'pinia' 和 'hot' 的普通对象
  let store: storeProxyType
  // const map = new Map()

  return new Proxy((() => {}) as storeProxyType, {
    // 直接使用代理调用成员
    get: function (target, property, receiver) {
      // 保证 store 对象只被初始化一次
      if (!store) {
        store = useStore() as any
        store.value = store
      }
      return (store as any)[property]
      // const propertyValue = (store as any)[property]
      // if (typeof propertyValue === 'function' || property === 'value')
      //   return propertyValue
      // // 对于 defineStoreProxy 使用时定义的 ref 对象 (state)，
      // // 解构保持响应，仍返回一个 ref 对象
      // if (map.get(property) === undefined)
      //   map.set(property, toRef(store, property as any))
      // return map.get(property).value
    },
    // 代理 useStore 掉用函数传入参数 'pinia' 和 'hot'
    // 如果需要使用这两个参数可以完全将新的代理当作原先导出的 useStore 使用
    apply: function (target, thisArg, args) {
      return useStore(...args)
    }
  })
}

// 二次封装，用 defineStoreProxy 代替 defineStore
export const defineStoreProxy = <Id extends string, SS>(
  id: Id,
  storeSetup: () => SS,
  options?: DefineSetupStoreOptions<
    Id,
    _ExtractStateFromSetupStore<SS>,
    _ExtractGettersFromSetupStore<SS>,
    _ExtractActionsFromSetupStore<SS>
  >
) => {
  return useStoreProxy(defineStore(id, storeSetup, options))
}

type Actions = { [key: string]: Function }
type MutableRef<T, A extends Actions> = { value: T } & {
  [key in keyof T & A as key extends 'value' ? never : key]: (T & A)[key]
}

export function mref<T, A extends Actions>(options: MutableRef<T, A>) {
  const { value, ...actions } = options
  const res = ref(value)
  Object.entries(actions).forEach(([k, v]) => {
    Reflect.defineProperty(res, k, { value: v })
  })
  return res as unknown as MutableRef<T, A>
}
