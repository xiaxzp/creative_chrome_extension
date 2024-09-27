# createScript

::: tip
`createScript` 工厂涵盖各种 `CreateType`，包装为 **createBackground**, **createInject**, **createContent**
:::

- Type: `Function`
- Params: `type: CreateType`
- Return: `(run) => (config) => unmount`

闭包工厂包一下 `type`，返回一个 `Function1`，`createBackground` 等就是这个 `Function1`；该函数进一步走到统一调度
- `Function1` 接受 `run` 函数作为参数，返回包装函数 `decorateFunction`;
- `run` 函数可以返回 `runUnmount` 函数，在这里可以调用 [`useWatch`](./hooks#useWatch) 等函数
- `decorateFunction` 函数接受 `configObj` 作为参数，返回 `unmount` 的函数;

在 `decorateFunction` 中 `run` 被调用
- `run`的`Unmount` 在 `decorateFunction` 返回的 `unmount` 函数中被调用。
- `run` 在调用之前先处理 [`context`](./createContext) 
- 使用 [`convertConfigContext`](../utils/create#convertConfigContext) 
- `context` 的 `storage` 初始化
- [watchQueue](./hooks#watchQueue) 处理
- 运行 `hooks` 中的 `watchQueue` 、设置 `watchUnMounted`、更新 `context` 的 `autoRun` 与 其他相关事件;

返回 `unmount` 函数清理所有 `runUmount`、`watchQueue`、`watchUnMounted`、`context`