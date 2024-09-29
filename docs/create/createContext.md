# createContext
Core logic of `Module Context`,
return different type of `Module Context` under different environment.

- Type: `Function`
- Return: `Module Context`
- Parameters: `WrappedContext`, `matches`

---
* `WrappedContext` is a wrap of `Data Context` in the format `{ key: config.key, context: config.context }`, which should be defined in package's `Config`. `Data Context` is known as `config.context`.
* `matches` is a list of urls. It limit the package's available situation, especially when used in some tabs.
* within the `Module Context`, `Message` tunnels and `Watch Queue` are built for cross-environment data transfer and changes listening.
---
### `Context.setContext`:
```typescript
async (
  `newContext`: T // Data Context
) => void
```
### `Context.emitEvent`:
```typescript
(
  `event`: string, // event key,
  `payload`: U, // event data
) => void
```
### structure `ContextRunParams`:
```typescript
ContextRunParams<`Data Context`> {
  context: `Data Context`
  setContext: `Context.setContext`
  emitEvent: `Context.emitEvent`
}
```
### `Context.on`:
```typescript
(
  `event`: string, //event key,
  `run`: (
      `payload`: T //related event data,
      `context`: ContextRunParams<`Data Context`>,
    ) => (`UnMounted`)
) => `Unbind` // function
```
### `Context.watch`

```typescript
(
  `run`: (params: ContextRunParams<Data Context>) => UnMounted | undefined,
  `dependence`: string[], //key list of Data Context, only keys within the list will be watched, like react useEffect,
  `immediate`: boolean, //run immediately,
) => `Unbind` // function
```
