import type {
  StoreDefinition,
  _ExtractStateFromSetupStore,
  _ExtractGettersFromSetupStore,
  _ExtractActionsFromSetupStore,
  Pinia,
  StoreGeneric,
  DefineSetupStoreOptions
} from 'pinia'
import { computed, ref, type Ref } from 'vue'
import { defineStore } from 'pinia'

// 第一步用 useStoreProxy 代理 ( defineStore 返回的 ) useStore
function useStoreProxy<Id extends string, SS>(
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
) {
  type storeProxyType = ReturnType<typeof useStore> & {
    (pinia?: Pinia | null | undefined, hot?: StoreGeneric): ReturnType<
      typeof useStore
    >
    value: ReturnType<typeof useStore>
  }
  // 维护的真正的 store 对象
  // 注意这里维护的 store 对象始终是没有使用参数 'pinia' 和 'hot' 的普通对象
  let store: storeProxyType

  return new Proxy((() => {}) as storeProxyType, {
    // 直接使用代理调用成员
    get: function (target, property, receiver) {
      // 保证 store 对象只被初始化一次
      if (!store) {
        store = useStore() as storeProxyType
        store.value = store
      }
      console.log('p1: ', store, property)
      console.log('p2: ', (store as any)[property])
      console.log('p3: ', Reflect.get(store, property))

      return (store as any)[property]
    },
    // 代理 useStore 掉用函数传入参数 'pinia' 和 'hot'
    // 如果需要使用这两个参数可以完全将新的代理当作原先导出的 useStore 使用
    apply: function (target, thisArg, args) {
      return useStore(...args)
    }
  })
}

// 二次封装，用 defineStoreProxy 代替 defineStore
export function defineStoreProxy<Id extends string, SS>(
  id: Id,
  storeSetup: () => SS,
  options?: DefineSetupStoreOptions<
    Id,
    _ExtractStateFromSetupStore<SS>,
    _ExtractGettersFromSetupStore<SS>,
    _ExtractActionsFromSetupStore<SS>
  >
) {
  return useStoreProxy(defineStore(id, storeSetup, options))
}

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
