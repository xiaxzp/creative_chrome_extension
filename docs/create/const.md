# Const
## getEventContextKey
wrap event key, used in `context.emitEvent` and `context.on`
```typescript
function getEventContextKey(event: string): string
```

## getPathKey
get package pathname from package path
mainly work with [dealModules](./create.md)

## PackageNameToConfig
get package config from package name
mainly work with [dealModules](./create.md)
