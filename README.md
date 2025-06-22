# wiki
[*deepwiki*](https://deepwiki.com/xiaxzp/creative_chrome_extension/3-services)
# 框架 WXT + React

This template should help get you started developing with React in WXT.

pnpm install
pnpm dev

---

pnpm run generate

---

pnpm build

---

可以安装 [*chrome canary*](https://www.google.com/intl/en/chrome/canary/)，但是好卡
开发模式输出位于 output 目录下的 xxx-dev 目录

# 包管理

## 子应用

* 全部放在 [*packages*](./src/packages/README.md) 目录下，参考 [*demo*](./src/packages/demo/config.ts) 包
* config 文件为总配置
* [*列表*](./src/package-index/README.md) 在每次 运行/install/手动跑命令 时生成
* content & background 默认 export 函数，函数可以提供一个销毁方法，content 挂载 jsx 的方法使用 body 获取方法 [*getContainer*](./src/utils/webContainer.ts)，可以参考 [*demo*](./src/packages/controlCenter/content.ts)
* 其他默认直接导出 jsx 组件
* 注意我们为了样式隔离，dom 整体位于 shadow DOM 下，所以一切涉及 dom 的操作需要使用 [*getShadowContainerSync*](./src/utils/webContainer.ts) 方法获取节点

## 子应用索引
* [*列表*](./src/package-index/README.md) 在每次 运行/install/手动跑命令 时生成
* 参考 package.json 里 generate 命令
* 索引决定了插件会加载哪些东西，新增索引相关文件的时候，需要重新运行 generate 命令或者重新 run dev

## content 挂载 dom 节点
* 参考 [*ControlCenterContent*](./src/packages/controlCenter/content.ts)
* webContainer.ts 文件提供 shadowDom 节点的获取方式

``` javascript
// content.js
import { getContainer, ControlCenterContainerID } from '@/utils/webContainer.ts';

import ReactDOM, { Root } from 'react-dom/client';
import App from './app.tsx';

export function initAPP(ctx: ContentScriptContext) {

  let rootDom: Root;

  getContainer(ControlCenterContainerID, ctx).then((cnt) => {
    rootDom = ReactDOM.createRoot(cnt);
    rootDom.render(App);
  });
  return () => {
    rootDom?.unmount();
  };
}

export default initAPP;

```

## Config

* 定义了子应用的一些基本属性，参考 [*ConfigType*](./src/types/config.ts)

* matches: 全部在 [*const/url*](./src/const/url.ts) 下定义，只有符合条件的网页会加载 content / inject 脚本。

## UI 组件库
* [*tailwindcss*](https://tailwindcss.com/docs/background-color) 位于 [*src/entrypoints/common.css*](./src/entrypoints/common.css)
* 动画使用 [*framer-motion*](https://www.npmjs.com/package/framer-motion)
* 组件库为 [*shadcn - radix*](https://ui.shadcn.com/docs)
> 注意这个组件库依赖 tailwindcss，每个组件都要手动安装在 [*components/ui*](./src/components/ui/README.md) 目录下
[*lib*](./src/lib/README.md) 为该组件库依赖，不需要修改。
涉及到弹窗的组件一定一定一定要指定 [*shadow DOM body: getShadowContainerSync*](./src/utils/webContainer.ts) ！！！
* ICONs [*radix icon*](https://www.radix-ui.com/icons) [*lucide-react*](https://lucide.dev/icons/)


----
# 消息模块

## 消息类

* 可以使用 [*messager*](./src/messager/README.md) 类，可以参考 [*demo/data*](./src/packages/demo/data/demoData.ts) 或 [*controller*](./src/controller/README.md) 的用法
* jsx 内可以使用 [*useMessageData*]('./src/hooks/useMessagerData.tsx') 一键挂载数据。
* background 作为消息中心，一定要在至少一个子应用 background 脚本里引用！！！
* contet 也可以作为消息中心，只局限于 content - inject 之间，此时 content 脚本消息中心的初始化函数使用 messager/index-inject.ts

``` javascript
// data/demoData/index.ts
import { initMessager } from '@/messager';

export interface DemoData {
  something: string;
}
export const DemoDataID = 'DemoDataID';

export function initDemoData() {
  // 初始化配置
  const initStats: DemoData = {
    something: 'something',
  };
  return initMessager({
    id: DemoDataID, // 唯一标识
    stats: initStats, // 这个消息体主要存储的状态
    namespace: DemoDataID, // 唯一标识，用于 webext-core 实例
    shouldStore: true, // 是否本地存储
    // matcheURLs: MATCH_URLS, // 只有符合条件的 url 才能同步消息、收到推送，不传代表都能收到
  });
}
const demoData = initDemoData();
export default demoData;

```

调用

``` javascript
// data/demoData/index.inject.ts
// inject 脚本需要用另一个 messager 实例
import { initMessager } from '@/messager/index-inject';

// 其他代码相同
```

``` javascript
// demopackage/background.ts
// background 作为消息中心，需要引用
import demoData from '@/data/demoData';
// 修改数据
demoData.manualChangeStats({
  ...demoData.stats, // 先解构旧数据
  something: 'new something', // 新数据
})
// 订阅数据变动
demoData.subscribe((props: {
    data,
    changesMap,
    sender,
  }) => {
    // 回调函数
  },
  false // 是否立即触发一次
)
```

``` javascript
// demopackage/content/App.tsx
import demoData from '@/data/demoData'
import { useMessagerData } from '@/hooks/useMessagerData';
const APP = () => {
  // 自动处理好订阅问题
  const stats = useMessagerData(demoData);
  return (
    <div onClick={() => {
      demoData.manualChangeStats({
        ...demoData.stats, // 先解构旧数据
        something: 'new something', // 新数据
      });
    }}>
      {stats.something}
    </div>
  );
}

```

## 应用开关

位于 [*controller*](./src/controller/README.md) 目录，同样是一个消息中心实例，主要是 control center 在使用，其他应用同样可以读取


## inject 脚本

注意消息库因为区分环境，所以 inject 环境的 messager / controller 文件有区分 [*index-inject*](./src/messager/index-inject.ts)

## 跨域请求
[*service/backgroundRequestor*](./src/services/backgroundRequestor.ts) 在 background 创建接收端，暂不支持 inject 环境，可以实现 content 向 background 发起跨域请求。


## 其他事件
直接使用 @webext-core/messaging 库进行消息收发，本框架不做限制，但建议收敛消息 key
``` javascript
// 非 inject
import { defineExtensionMessaging, ExtensionMessenger } from '@webext-core/messaging';
const messageFunc = defineExtensionMessaging();

```
``` javascript
// inject
import { defineWindowMessaging, WindowMessenger } from '@webext-core/messaging/page';
this.messageFunc = defineWindowMessaging({
  namespace: windowNamespace,
});

```