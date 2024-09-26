// generate stub index.html files for dev entry
import { execSync } from 'node:child_process';
import chokidar from 'chokidar';
import { isDev, r } from './utils';

/**
 * Stub index.html to use Vite in development
 */
// async function stubIndexHtml() {
//   const views = ['options', 'popup'];

//   for (const view of views) {
//     await fs.ensureDir(r(`${distDir}/${view}`));
//     let data = await fs.readFile(r(`src/${view}/index.html`), 'utf-8');
//     console.log('run stub', r(`${distDir}/${view}/index.html`), view, data);
//     data = data
//       .replace('"./main.ts"', `"http://localhost:${port}/${view}/main.ts"`)
//       .replace(
//         '<div id="app"></div>',
//         '<div id="app">Vite server did not start</div>',
//       );
//     await fs.writeFile(r(`${distDir}/${view}/index.html`), data, 'utf-8');
//     log('PRE', `stub ${view}`);
//   }
// }

function writeManifest() {
  execSync('npx tsx ./scripts/manifest.ts', { stdio: 'inherit' });
}

writeManifest();

if (isDev) {
  // stubIndexHtml();
  // chokidar.watch(r('src/**/*.html')).on('change', () => {
  //   stubIndexHtml();
  // });
  chokidar.watch([r('src/manifest.ts'), r('package.json')]).on('change', () => {
    writeManifest();
  });
}
