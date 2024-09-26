let appShadowDOM: ShadowRoot;
export const ELEMENT_UI_PORTAL_ID = 'ele-portal';

export function prepareAppShadowDOM() {
  const container = document.createElement('creative-fe-devtool');

  container.style.position = 'fixed';
  container.style.bottom = '0px';
  container.style.right = '0px';
  container.style.width = '0px';
  container.style.height = '0px';
  container.style.zIndex = '9999';

  appShadowDOM
    = container.attachShadow?.({ mode: __DEV__ ? 'open' : 'closed' })
    || container;

  document.body.appendChild(container);
}
export function getPopperPortal() {
  return getAppShadowDOM()?.querySelector(
    `#${ELEMENT_UI_PORTAL_ID}`,
  ) as HTMLElement;
}

export function getAppShadowDOM() {
  if (!appShadowDOM) {
    throw new Error('App container not prepared yet!');
  }
  return appShadowDOM;
}
