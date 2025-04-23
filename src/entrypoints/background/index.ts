import packageComponents from '@/package-index/background';
import type { unmountFunction } from '@/types/config';
import Controller, { PackageStats } from '@/controller';

function runPackageComponents(controller: PackageStats, unmounts: Record<string, unmountFunction> = {}) {
  Object.entries(packageComponents).forEach(([name, component]) => {
    console.log('run package', name);
    if (controller[name]?.on && !unmounts[name]) {
      unmounts[name] = component() ?? (() => {});
    } else if (!controller[name]?.on && unmounts[name]) {
      unmounts[name]();
      delete unmounts[name];
    }
  });
  return unmounts;
}
export default defineBackground(() => {
  console.log('Hello background!', { id: browser.runtime.id });

  const unmounts = runPackageComponents({}, {});
  Controller.subscribe((stats) => {
    runPackageComponents(stats.data.value ?? {}, unmounts);
  });
});
