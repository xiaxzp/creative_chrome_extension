# createScript

>`createScript.ts` file include all kinds of `CreateType`, packaged into
**createBackground** / **createInject** / **createContent** / **createData**, we can call it **wrapped create**

- Type: `(run: (context?: BaseContext<T>) => Promise<UnMounted>) => async (config) => UnMounted`

- All `wrapped create` receive `run` as a parameter, and return a `decorateFunction`, which accept `ConfigObject` for further processing;
- `run` function should be an async function and return an `UnMounted` function, it also receive `Module Context` and can be used to call `context.on` or `context.watch` or other things..

- the `decorateFunction` is an async function and will return a function which includes the `UnMounted` function given by `run`, after the promise fullfilled. this returned function will do `UnMounted` and other inner cleanup `watchQueue`、`context`.
