# createContext

## Message

- Type:
```
type: MessageType;
data: Partial;
from: string;
source: MessageSource;
target: MessageSource[];
```

## MessageType

- requestGet
- responseGet
- requestSet
- broadcastChange

## MessageSource

- background
- option
- popup
- content
- inject

## createContext

- Params: `config.context`
- Return: `BaseContext factory`

根据策略分发返回不同工厂

## BaseContext

- Type: `Class`
- Constructor: `config.context`
### Props: `key`

`key = configcontext.key`

### Props: `context`

`context = configcontext.default`

### Props: `autoRunQueue`

`item.func: (context: T) => void` 代表回调函数，`item.dependence[]` 代表依赖，存储 `configcontext.key`

### private: `_getChangesMap`
- Type: `(oldContext: T, newContext: T) => Record<>`

返回改变的存储值，用 `{key: value}` 形式返回

### protected: `_getNewContext`
- Type: `(newContext: NewContextFunc<T> | Partial<T>, context: T) => Partial<T>`

基础功能包装，用 `context` 运行 `newContext`, 或者直接返回 `newContext`，不影响 `this`

### protected: `_setContext`

- Type: `(newContext: NewContextFunc<T> | Partial<T>) => boolean`

用 `_getNewContext` 新建并覆盖在 `this.context` 上, 接着对 `_getChangesMap` 结果运行 `autoRunQueue`

### public: `autoRun`

- Type: `(func: AutoRunFunc<T>, dependence?: (keyof T)[]) => () => void`

增加 `autoRunQueue` 回调函数和依赖 key，返回解绑函数

### public: `setContext`

- Type: `(newContext) => void`

调用 `this._setContext`

### public: `removeContext`

无具体实现的接口类

## 其他 Context

| Type        |      Construction      |  _initContext(called in construction) | setContext | removeContext | MessageSource
| ------------- | :-----------: | :-----------: | :-----------: | :-----------: | :----: |
| PopupContext      | navigator.serviceWorker.addEventListener | Service worker ready & send message | 同_init | 移除 listeners | MessageSource.popup |
| OptionContext      |   navigator.serviceWorker.addEventListener    |   Service worker ready & send message | 同_init | 移除 listeners | MessageSource.option |
| ContentContext |   chrome.runtime.onMessage.addListener + window.addEventListener    |    chrome.runtime.sendMessage & window.postMessage | 同_init | 移除 listeners | MessageSource.content |
| InjectContext |   window.addEventListener    |    window.postMessage | 同_init | 移除 listeners | MessageSource.inject |
| BackgroundContext |   chrome.runtime.onMessage.addListener + this(service worker).addEventListener    |   super | Super & tabs.query & clients.matchAll() post message | 移除 listeners | MessageSource.background |


