import { Env } from '@/types/env';
export const isDev = process.env.NODE_ENV !== 'production';
export function checkEnv() {
  try {
    const { location } = window;
    if (location.protocol === 'chrome-extension:') {
      if (location.pathname.startsWith('/popup')) {
        return Env.popup;
      } else if (location.pathname.startsWith('/option')) {
        return Env.options;
      } else if (location.pathname.startsWith('/devtools')) {
        // including subpage
        return Env.devtools;
      } else if (location.pathname.startsWith('/sidepanel')) {
        return Env.sidepanel;
      }
    }
    if (chrome.extension) {
      return Env.content;
    }
    return Env.injected;
  } catch {
    return Env.background;
  }
}
