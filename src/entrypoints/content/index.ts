// import './reset.css';
import './common.css';
import { ContentScriptContext } from '#imports';
import packageComponents from '@/package-index/content';
import Controller, { PackageStats } from '@/controller';
import type { unmountFunction } from '@/types/config';
import { matchUrlInPage } from '@/utils/matcher';
import Config from '@/package-index/config';
import { MATCH_URLS } from '@/const/url';
import { getContainer, InjectContainerID } from '@/utils/webContainer.ts';

function runPackageComponents(
  ctx: ContentScriptContext,
  controller: PackageStats,
  unmounts: Record<string, unmountFunction> = {},
) {
  Object.entries(packageComponents).forEach(([name, component]) => {
    console.log('run package', name, controller);
    const config = Config[name];
    const match = matchUrlInPage(config?.matches);
    if (controller[name]?.on && match && !unmounts[name]) {
      unmounts[name] = component(ctx) ?? (() => {});
    } else if (!controller[name]?.on && unmounts[name]) {
      unmounts[name]();
      delete unmounts[name];
    }
  });
  return unmounts;
}
export default defineContentScript({
  matches: MATCH_URLS,
  cssInjectionMode: 'ui',
  async main(ctx) {
    console.log('Hello content.');
    const unmounts = runPackageComponents(ctx, {}, {});

    await getContainer(InjectContainerID, ctx);

    Controller.subscribe((stats) => {
      runPackageComponents(ctx, stats.data.value ?? {}, unmounts);
    });

    await injectScript('/injected.js', {
      keepInDom: true,
    });
  },
});
