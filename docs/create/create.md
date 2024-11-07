# Create
Bundles of functions for creating modules.

## core storage related: used in core logic, mostly we won't use in packages.

## dealModules

- Type: `Function`
- Params: `globEager`
[`globEager`](https://cn.vitejs.dev/guide/features.html#glob-import) get all the matched config file by useing require.context
- Return: `Record<config.key, modules[path].default as T>`

by using `getPathKey` and `PackageNameToConfig`, the function get the module's config.key，and generate a structure in `{ [config.key]: module }` format.

## initExtension

- Type: `Function`
- Params: `run` async function, (key: string) => Promise<`UnMounted`>
- Return: `{ UnMounted, context}`

create `ExtensionAvailableContext`, which store and controls all packages' enable states, and return the `UnMounted` function and context. Each package's config.key will call the `run` function.
`contextStorage` will store latest `ExtensionAvailableContext`.
