# createHooks

::: tip
一般在 [`createScript`](./createScript) 的参数 `run` 函数中调用
:::

## watchQueue

- Type: `Array`

存放 `watch Objects`

## useWatch

- Type: `Function`
- Type: `(run: WatchRun<T>, dependence?: (keyof T)[], immediate?: boolean) => void`

递增 `watchQueue` && `watchQueueIdx`, `run` 为回调, `dep` 为依赖, `immediate` 为创建 `context` 时是否立即执行

## useOn

- Type: `Function`
- Type: `(event: string, run: (payload: U, context: ContextRunParams<T>) => HooksUnMounted | void`

`event` 通过 [`getEventContextKey`](../utils/create#getEventContextKey) 包装，`onRun` 包装当 `context[event]` 变化时，触发 `run` 函数，并把 `context[event]` 清空。再 类似 `useWatch` 添加 `watchQueue`