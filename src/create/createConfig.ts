import type { AppletConfig } from './interface'
import { AppletEnabledScope } from './interface';

export function createConfig<T>(config: AppletConfig<T>): AppletConfig<T> {
  return { ...config, scope: config.scope ?? AppletEnabledScope.browser };
}
