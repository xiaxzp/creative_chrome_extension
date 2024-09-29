# Create

A directory storing the core logic of this extension framework, including initialization, configuration, data transfer and message distribution between modules and different environments.

everything is driven by **Module Context**, and cross-environment data is called **Data Context**.

create/index.ts exports all core functions.

## [Config](./config.md)
* ExtensionAvailableContext
* packages' config buildup

## [Const](./const.md)
* getEventContextKey
* PackageNameToConfig
* getPathKey

## [ContextStorage](./context.md)

## [create / utils](./create.md)
* dealModules
* initExtension

## [createConfig](./createConfig.md)
* Data Context
* key

## [createContext](./createContext.md)
* Module Context

## [createScript](./createScript.md)
* packages' create functions
