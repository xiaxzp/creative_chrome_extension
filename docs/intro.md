# TTCM Extension Docs

# Demo

- You can find `src/extensions/demo` in our project!
- new module should be placed under `src/applets/`
- read core apis in [docs/create](./create/index.md)

## config
```
import { createConfig } from '~/create';

export default createConfig<Context>({
  key: 'demo', // 应该与 module key 相同
  name: 'Demo', // module name
  hideInControlsCenter: true, // 是否需要在控制面板隐藏
  matches: ['https://tcm-boe.byted.org/*'], // 模块激活条件
  context: { // 临时状态机
    data1: false,
    data2: 1,
    data3: {
      storage: true, // 是否与 chrome storage 交互
      value: [], // 实际存储的 data, required!
    },
  },
});
```

## background
```
import { Context } from './config';
import { createBackground } from '~/create';

export default createBackground<Context>(() => {
  console.log('mounted demo');

  return () => {
    console.log('unMounted demo');
  };
});

```

## content
```
<template>
  <div @click="onClick">
    {{ props.context.data2 }}
  </div>
</template>

<script setup lang="ts">
import { Context } from './config';

const props = defineProps<{
  context: Context, // AppletList 自动给到对应 contextMap[item.key].value
}>();

const emit = defineEmits(['set-context', 'emit-event']);

const onClick = () => {
  emit('set-context', { // 对应 contextMap[item.key].set
    data2: props.context.data2 + 1,
  });

  emit('emit-event', 'show-on', '1234'); // 对应 contextMap[item.key].emit ，事件应该在 initBackground 时通过 useOn 定义
};

</script>

```

## Options
与 content 基本相同
```
<template>
  <div @click="onClick">
    {{ props.context.data2 }}
  </div>
</template>

<script setup lang="ts">
import { Context } from './config';

const props = defineProps<{
  context: Context,
}>();

const emit = defineEmits(['set-context']);

const onClick = () => {
  emit('set-context', {
    data2: props.context.data2 + 1,
  });
};

</script>

```

## inject
```
import { createInject, useWatch, useOn } from '~/create';
import { Context } from './config';

export default createInject<Context>((context) => { // 相对独立，重新注册
  console.log('inject mounted demo');
  contex.watch(({ context }) => {
    console.log('data1 data2 change', context);
    return () => {};
  }, ['data1', 'data2']);

  context.on('show-on', (payload: string) => {
    console.log(payload);
  });

  return () => {
    console.log('inject unMounted demo');
  };
});

```
