# Config

- File: `src/config.ts`

## config

- Type: `const Array[config]`

[`globEager`](https://cn.vitejs.dev/guide/features.html#glob-import) 获取到的所有包的 `config` 文件，生成一个 `[module config]` 的 `list`;

## configObj

- Type: `const object`
- Return: `Record<string, Config>`

通过 `config` 生成一个 `{ [config.key]: config module }` 的型式; 注意这里的 `key` 不是 `package name`，原则上 `package name === config.key`

## ExtensionAvailableContext

- Type: `const`

```
{
  key: 'extension_available',
  default: {
    [configObj.key]: {
      enabled: Boolean(configObj[key].enabled),
      hideInControlsCenter: Boolean(configObj[key].hideInControlsCenter),
    }
  },
}
```
作为 `extension package` 开关的临时 context

## filterConfigsByMatches

- Type: `Function`
- Return: `Boolean`

作为 `Array.prototype.filter` 传入函数，匹配 `config.matches` 与 `location.href`
主要用于筛选当前可用插件包的 config

## filterConfigsByURL

- Type: `Function`
- Return: `Boolean`

作为 `Array.prototype.filter` 传入函数，匹配 `ENV_STAR_URLS` 与 `this?.origin`，返回 `conf.star` 或 `true`
主要用于筛选当前可用插件包的 config
