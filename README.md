# wiki
[*deepwiki*](https://deepwiki.com/xiaxzp/creative_chrome_extension/3-services)
# WXT + React

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

# modules

* 全部在 [*packages*](./src/packages/README.md) 目录下，参考 [*demo*](./src/packages/demo/config.ts) 包，config 文件为总配置，[*列表*](./src/package-index/README.md) 在每次 运行/install/手动跑命令 时生成
* content & background 默认 export 函数，函数可以提供一个销毁方法，content 挂载 jsx 的方法使用 body 获取方法 [*getContainer*](./src/utils/webContainer.ts)，可以参考 [*demo*](./src/packages/controlCenter/content.ts)
* 其他默认直接导出 jsx 组件
* 注意我们为了样式隔离，dom 整体位于 shadow DOM 下，所以一切涉及 dom 的操作需要使用 [*getShadowContainerSync*](./src/utils/webContainer.ts) 方法获取节点

# Matches URL

全部在 [*const/url*](./src/const/url.ts) 下定义

# 开关

位于 [*controller*](./src/controller/README.md) 目录

# 消息

* 可以使用 [*messager*](./src/messager/README.md) 类，可以参考 [*demo/data*](./src/packages/demo/data/demoData.ts) 或 [*controller*](./src/controller/README.md) 的用法
* jsx 内可以使用 [*useMessageData*]('./src/hooks/useMessagerData.tsx') 一键挂载数据。

# inject 脚本

注意消息库因为区分环境，所以 inject 环境的 messager / controller 文件有区分 [*index-inject*](./src/messager/index-inject.ts)

# 跨域请求
[*service/backgroundRequestor*](./src/services/backgroundRequestor.ts) 在 background 创建接收端，暂不支持 inject 环境，可以实现 content 向 background 发起跨域请求。

# UI 组件库
* [*tailwindcss*](https://tailwindcss.com/docs/background-color) 位于 [*src/entrypoints/common.css*](./src/entrypoints/common.css)
* 动画使用 [*framer-motion*](https://www.npmjs.com/package/framer-motion)
* 组件库为 [*shadcn - radix*](https://ui.shadcn.com/docs)
> 注意这个组件库依赖 tailwindcss，每个组件都要手动安装在 [*components/ui*](./src/components/ui/README.md) 目录下
[*lib*](./src/lib/README.md) 为该组件库依赖，不需要修改。
涉及到弹窗的组件一定一定一定要指定 [*shadow DOM body: getShadowContainerSync*](./src/utils/webContainer.ts) ！！！
* ICONs [*radix icon*](https://www.radix-ui.com/icons) [*lucide-react*](https://lucide.dev/icons/)