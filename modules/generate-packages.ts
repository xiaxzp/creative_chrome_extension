import { defineWxtModule } from 'wxt/modules';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const DirName = path.dirname(fileURLToPath(import.meta.url));

const targets = ['background', 'content', 'injected', 'options', 'popup', 'devtools', 'sidepanel', 'config'];

function generateDir(outputPath = 'output') {
  try {
    fs.mkdirSync(outputPath);
  } catch {}
}

function addFileToObject(
  obj: Record<string, Record<string, fs.Dirent>> = {},
  files: fs.Dirent[] = [],
  packageName = '',
  parentPath = '',
) {
  targets.forEach((target) => {
    const curFile = files.find((item) => item.name.match(new RegExp(`^${target}.(ts|js|jsx|tsx)$`)));
    const curDirSearch = files.find((item) => item.name.match(new RegExp(`^${target}$`)));
    if (curFile) {
      obj[target][packageName] = curFile;
    } else if (curDirSearch && curDirSearch.isDirectory()) {
      const curDirFiles = fs.readdirSync(path.join(DirName, `../src/packages/${packageName}/${target}`), {
        withFileTypes: true,
        encoding: 'utf-8',
        recursive: false,
      });
      const curDirTargetFile = curDirFiles.find((item) => item.name.match(new RegExp(`^index.(ts|js|jsx|tsx)$`)));
      if (curDirTargetFile) {
        obj[target][packageName] = curDirTargetFile;
      }
    } else if (target === 'config') {
      fs.writeFileSync(
        path.join(parentPath, 'config.ts'),
        "import type { Config } from '@/types/config';\nexport default { defaultOn: true } as Config;",
        'utf-8',
      );
      const file = new fs.Dirent();
      file.name = 'config.ts';
      file.parentPath = parentPath;
      file.path = parentPath;
      obj[target][packageName] = file;
    }
  });
  return obj;
}

function createFiles(result: Record<string, Record<string, fs.Dirent>> = {}, outDir = '') {
  Object.entries(result).forEach(([filename, pkgs]) => {
    let extension = 'as Record<string, jsxFunction>';
    let importType = 'jsxFunction';
    if (['config'].includes(filename)) {
      extension = 'as Record<string, Config>';
      importType = 'Config';
    } else if (['content', 'background'].includes(filename)) {
      extension = 'as Record<string, scriptFunction>';
      importType = 'scriptFunction';
    }
    const content = `
import type { ${importType} } from '@/types/config';
${Object.entries(pkgs)
  .map(([pkgName, file]) => {
    const isIndexFile = file.name.match(new RegExp(`^index.(ts|js|jsx|tsx)$`));
    return `import ${pkgName} from '@/packages/${pkgName}${isIndexFile ? `/${file.parentPath.split('/').pop()}` : ''}/${file.name}';`;
  })
  .join('\n')}
export default {
  ${Object.keys(pkgs)
    .map((pkgName) => {
      return `${pkgName}`;
    })
    .join(',\n')}
} ${extension};
    `;
    fs.writeFileSync(path.join(outDir, `${filename}.ts`), content);
  });
}

export function generatePackages() {
  const outputDir = path.join(DirName, '../src/package-index');
  generateDir(outputDir);
  const packageDirs = fs.readdirSync(path.join(DirName, '../src/packages/'), {
    withFileTypes: true,
    encoding: 'utf-8',
    recursive: false,
  });
  const results = targets.reduce((all, cur) => {
    all[cur] = {};
    return all;
  }, {});
  packageDirs.forEach((pkg) => {
    if (pkg.isDirectory()) {
      const curFiles = fs.readdirSync(path.join(DirName, `../src/packages/${pkg.name}`), {
        withFileTypes: true,
        encoding: 'utf-8',
        recursive: false,
      });
      addFileToObject(results, curFiles, pkg.name, path.join(DirName, `../src/packages/${pkg.name}`));
    }
  });
  createFiles(results, outputDir);
}

export default defineWxtModule({
  setup(wxt) {
    // Relative to the output directory
    wxt.hook('build:before', (wxt) => {
      generatePackages();
    });
  },
});
