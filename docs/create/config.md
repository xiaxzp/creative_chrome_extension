# Config

everything about packages' configs.

## config

- Type: `const Array[config]`

[`globEager`](https://cn.vitejs.dev/guide/features.html#glob-import) get all `config` files，and generate a `[module config]` list;

## configObj

- Type: `const object`
- Return: `Record<string, Config>`

generate the `{ [config.key]: config module }` structure.

## ExtensionAvailableContext

- Type: `const`

```typescript
{
  key: 'extension_available',
  default: {
    [configObj.key]: {
      enabled: Boolean(configObj[key].enabled),
    }
  },
}
```
