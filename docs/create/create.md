# Utils - Create

## getPathKey

- Type: `Function`
- Params: `path: string`
给定一个在 **extensions** 目录下包的 **path**
- Return: `string`

获取 `packages` 目录 `key`，注意和 `config` 里的 `key` 的区别。解析出**包key**，如果解析不出则返回空字符串

## dealModules

- Type: `Function`
- Params: `globEager`
[`globEager`](https://cn.vitejs.dev/guide/features.html#glob-import) 获取到的所有匹配文件 `{ path: module }`
- Return: `Record<string, modules[path].default as T>`

把 `globEager` 的 `modules` 返回，通过 [`getPathKey`](#getPathKey) 获得包名，再用 [`PackageNameToConfig`]() 获得 config.key，生成一个 `{ [config.key]: module }` 的数据结构

## convertConfigContextItem

- Type: `Function`
- Params: `ContextTypeItem`
- demo: `{ account: { storage: true, value: 1 } }`,
- return: `value = 1`

返回 `item.value` 或者 `item` 本身，用于兼容不同 `context` 配置

## convertConfigContext

- Type: `Function`
- Params: `ContextType`
- demo:
```
{
  accountList: {
    storage: true,
    value: [],
  },
  boeLoginInfo: {
    account: '',
    password: '',
  },
}
```
- Return: `{[context item key]: convertConfigContextItem}`

格式化 `config.context` 获取存储值

## initExtension

- Type: `Function`
- Params: `run 函数`
- Return: `{unbind, context}`

创建 [`ExtensionAvailableContext`](../config#ExtensionAvailableContext)，添加 `autoRun` 响应函数，返回 `Unmount` 函数

## getEventContextKey

- Type: `Function`
- Return: `String`

返回 `camelCase` + `Event` 的临时 `key` 字符串

## getContextStorageKey

- Type: `Function`
- Type: `(extensionKey: string, key: string) => string`
- Return: `String`

返回 `EXTENSION_CONTEXT_STORAGE_PREFIX` + `extensionKey` + `key` 的存储 `key`

## getNeedStorageKeys

- Type: `(context: ContextType<T>) => string[]`
- Return: `string[]`

从 config.context 里取出 storage = true 的 storage key

## getContextFormStorage

- Type: `(extensionKey: string, context: ContextType<T>, callback: (context: T) => void) => void`

`getNeedStorageKeys.map(getContextStorageKey)` 获得 `key list` 传递给 `chrome.storage.local.get`，回调函数中先用取出的值与原 `context`合并生成新的 `rescontext`，再传给 `callback` 函数交由调用方自行处理。

## setStorageFromContext

- Type: `(extensionKey: string, configContext: ContextType<T>, newContext: T) => void`

使用 `getNeedStorageKeys` 取出的 `key list` 与 `newcContext`，生成 `{[getContextStorageKey]: newContext[key]}` 的结构体，传递给 `chrome.storage.local.set` 完成存储
