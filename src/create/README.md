# 核心框架
## 初始化
### 根文件(manifest 对应)
以 initExtension + configObj 为主, 遍历每个 applet 包的对应模块文件与 config。

initExtension 中也会初始化 applet 开关 Context
### Applet 包文件
以 export default createScript 初始化为主，传入一个 applet run 函数。

这个传入的 applet run 函数接受 Context 对象作为参数，在初始化、applet 开关打开时执行。在该生命周期中可以执行一些 Context.watch / Context.on 等的操作。

createScript(run) 再返回一个函数，用于框架的初始化，这点无需关心。

## 事件
### emitEvent
> 接受两个参数，手动触发
* event: 一个自定义事件名参数标识，会被包装
* payload: 事件数据

### Context.watch
> - 替代原 useWatch 函数。目前只要获取到 Context 的话，不受限于初始化生命周期。
> - 接受参数，在该 applet Context.context 发生变化时触发
* run 为基本执行单元，run 函数可以返回一个清理函数，在每次 run 函数执行之前触发（不包括第一次
* dependence 指代依赖字段的 key 值
* immediate 代表是否需要立即执行一次。
```
run({
  context: value, // Context.context
  setContext: this.setContext.bind(this),
  emitEvent: this.emitEvent.bind(this),
})
```
### Context.on
> - 替代原 useOn 函数。目前只要能获取到 Context 的话，不受限于初始化生命周期。
> - 接受参数，在该 applet 的 Context.context[event] 发生变化时触发
* event: 对应 emitEvent 的 event，用于 Context.emitEvent 识别
* run: 一个函数，接受参数 payload 和 Context.context, payload 对应 emitEvent 的 payload，就是事件数据。


## 生命周期
### initExtension
0. 扫描 configs，以 initExtension 开始
1. 创建 AppletAvailableConfig 开关 Context
2. 存储到 contextStorage
3. 开关 Context 监听开关配置，在配置变更后，执行每一个开启的 key 对应 applet run 函数，销毁关闭的 applet。
### createScript
0. 接受 applet run 函数和 applet config，如果该 app 的 config 没有初始 config.context 值，则直接执行 run 函数返回，不创建 Context。
1. 创建 Context，输入 config.context 初始值；
2. 存储 Context 到 contextStorage
3. 如果是 serviceworker (v2 background) 则进行 storage 的读取，与监听 Context.context 变化写入 storage。
4. 执行 applet run 函数。在这个函数里面会进行初始化中所说的生命周期。
5. 返回一个销毁函数。

## APIs
### Context 对象
可以自由调用了，但是建议仅使用 watch、on、setContext
### contextStorage
* 保存了 createScript 过程中 createContext 产生的 Context 实例，以key - Context 形式存储
* 只存储最新的一个，如果要销毁还是应当使用 createScript 产生的 unmount。只是在后续过程中，可以通过这个 storage 获取一个对应 key 的 Context 实例
* 如果要自己 createContext，建议自己管理