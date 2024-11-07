# TTCM Extension Docs

# Demo & How to start

- You can find `src/applets/ext_demo` in our project!
- new module should be placed under `src/applets/`
- copy `ext_demo` for a new trial!


## Core initialize logic
read more about core apis in [docs/create](./create/index.md)

### config
```
import { createConfig } from '~/create';

export default createConfig<Context>({
  key: 'demo', // module key
  name: 'Demo', // module name
  hideInControlsCenter: true, // whether hide in Control Panel
  matches: ['https://tcm-boe.byted.org/*'], // active condition
  context: { // temporarily used
    data1: false,
    data2: 1,
    data3: {
      storage: true, // whether stored in chrome storage
      value: [], // runtime data, required!
    },
  },
});
```

### background
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

### content
```
<template>
  <div @click="onClick">
    {{ props.context.data2 }}
  </div>
</template>

<script setup lang="ts">
import { Context } from './config';

const props = defineProps<{
  context: Context, // AppletList automatically receive contextMap[item.key].value
}>();

const emit = defineEmits(['set-context', 'emit-event']);

const onClick = () => {
  emit('set-context', { // corresponding contextMap[item.key].set
    data2: props.context.data2 + 1,
  });

  emit('emit-event', 'show-on', '1234'); // corresponding contextMap[item.key].emit, should be defined with context.on when init Background
};

</script>

```

### Options
same as content
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

### inject
```
import { createInject, useWatch, useOn } from '~/create';
import { Context } from './config';

export default createInject<Context>((context) => {
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
