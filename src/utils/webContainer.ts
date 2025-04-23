import { isDev } from '@/utils/env';
import { ContentScriptContext } from '#imports';
export const ShadowRootName = 'creative-x-devtool';
export const InjectContainerID = 'creative-x-inject';
export const ControlCenterContainerID = 'creative-x-control-center';
export const EnvCenterContainerID = 'creative-x-env-center';

export function getShadowContainerSync(shadowID: string = ShadowRootName, ctx?: ContentScriptContext) {
  let container = document.getElementById(shadowID);
  let shadowRoot: ShadowRoot | null | undefined = container?.querySelector(shadowID)?.shadowRoot;

  if (!shadowRoot) {
    throw new Error('ShadowRoot not found');
  }
  const shadowBody = shadowRoot?.querySelector('body') || shadowRoot;

  return {
    container,
    shadowRoot,
    shadowBody,
  };
}
export async function getShadowContainer(shadowID: string = ShadowRootName, ctx?: ContentScriptContext) {
  let container = document.getElementById(shadowID);
  let shadowRoot: ShadowRoot | null | undefined = container?.querySelector(shadowID)?.shadowRoot;
  console.log('search container', container, shadowRoot);
  if (!container) {
    container = document.createElement('div');
    container.id = shadowID;

    document.body.appendChild(container);
  }
  if (!shadowRoot) {
    if (ctx) {
      const ui = await createShadowRootUi(ctx, {
        name: shadowID,
        position: 'inline',
        anchor: container,
        onMount: (cnt) => {
          // Container is a body, and React warns when creating a root on the body, so create a wrapper div
          const app = document.createElement('div');
          cnt.append(app);
          return app;
        },
        // onRemove: (root) => {
        //   // Unmount the root when the UI is removed
        //   root?.unmount();
        // },
      });

      // 4. Mount the UI
      ui.mount();
      console.log('load ui', ui, container, shadowID);
      shadowRoot = ui.shadow;
    } else {
      console.log('load shadow', shadowID);
      const app = document.createElement(shadowID);
      shadowRoot = app.attachShadow?.({ mode: isDev ? 'open' : 'closed' }) || app;
      container.appendChild(app);
    }
  }
  return shadowRoot;
}

export async function getContainer(containerID: string, ctx?: ContentScriptContext) {
  const shadowRoot = await getShadowContainer(ShadowRootName, ctx);
  if (!shadowRoot) {
    throw new Error('ShadowRoot not found');
  }
  const shadowBody = shadowRoot?.querySelector('body') || shadowRoot;
  let container = shadowBody.querySelector(containerID);
  if (!container) {
    container = document.createElement(containerID);
    container.id = containerID;
    shadowBody.appendChild(container);
  }
  return container;
}
// export function getExtensionBuiltInStyle(path: string) {
//   if (!path) {
//     throw new Error('Please specify the file path!');
//   }

//   const styleEl = document.createElement('link');
//   styleEl.setAttribute('rel', 'stylesheet');
//   styleEl.setAttribute('href', browser.runtime.getURL(path));

//   return styleEl;
// }
// function insertContentStyles(dom) {
//   // Element 用了 root 选择器来注入 CSS 变量，在插件的 shadowDOM 无效，所有以我们自己重写了下
//   dom.appendChild(getExtensionBuiltInStyle('lib/reset.css'));
//   dom.appendChild(getExtensionBuiltInStyle('lib/element-fix.css'));
//   dom.appendChild(getExtensionBuiltInStyle('content/content.css'));
// }

export function isScriptElement(variable): variable is HTMLScriptElement {
  return variable && variable.constructor && variable.constructor.name === 'HTMLScriptElement';
}
