# FAQ
## 如何新增一个 Applet

- config.ts // 主要配置文件，必须有
- Content.vue // 渲染在页面上的组件，会被包在一个 GlassCard 内
- content.ts // 跑在页面上的脚本
- inject.ts // 注入到页面内的脚本
- background.ts // 跑在后台的脚本
