import type { Manifest } from 'webextension-polyfill';
import type PkgType from '../package.json';
import fs from 'fs-extra';
import { MATCH_URLS } from '../src/const';
import { isDev, r } from '../scripts/utils';

interface ManifestV3 extends Manifest.WebExtensionManifest {
  host_permissions: string[];
  options_page: string;
  externally_connectable?: Record<string, any>;
  // declarative_net_request?: Record<string, any>;
}
interface Props {
  port?: number;
}
export async function getManifest(props: Props) {
  const pkg = (await fs.readJSON(r('package.json'))) as typeof PkgType;

  // update this file to update this manifest.json
  // can also be conditional based on your need
  const manifest: Partial<ManifestV3> = {
    manifest_version: 3,
    name: 'New Creative X'.concat(isDev ? ' - 开发版' : ''),
    version: pkg.version,
    description: pkg.description,
    icons: {
      16: './imgs/logo.png',
      48: './imgs/logo.png',
      128: './imgs/logo.png',
    },
    commands: {},
    // background: {
    //   service_worker: './background.js',
    // },
    // action: {
    //   default_icon: './imgs/logo.png',
    //   default_popup: './popup.html',
    //   default_title: 'New Creative X Tool',
    // },
    // content_scripts: [
    //   {
    //     matches: [
    //       ...MATCH_URLS,
    //       // tiktok web，登录时执行的脚本
    //       'https://www.tiktok.com/*',
    //       'https://api.tiktok.com/*',
    //     ],
    //     js: ['./content-scripts/content.js'],
    //     css: ['./content-scripts/content.css'],
    //     run_at: 'document_start',
    //   },
    //   // 对于dev场景，脚本没有自动复制pendah相关文件，所以在开发态不支持pendah调试
    //   // 具体可以查看package.json build-prepare-pendah,build:after-pendah命令
    //   // ...(!isDev ? [{ matches: ['<all_urls>'], css: ['./pendah/main.css'] }] : []),
    // ],
    permissions: [
      'contextMenus',
      'tabs',
      // 'notifications',
      'webRequest',
      'webNavigation', // morph 需要，或许可以改造一下去掉
      'storage',
      'cookies',
      'activeTab',
      'scripting',
      'declarativeNetRequest',
      // 'declarativeNetRequestFeedback',
      'debugger',
    ],
    host_permissions: ['*://*/*'],
    web_accessible_resources: [
      {
        resources: ['chunks/*', 'content-scripts/*', 'assets/*', 'imgs/*', 'icon/*', 'lib/*', 'injected.js'],
        matches: [...MATCH_URLS, 'https://www.tiktok.com/*', 'https://api.tiktok.com/*'],
      },
    ],

    homepage_url: 'http://js/tcm',
    // options_page: './options.html',
    // options_ui: {
    //   page: './options.html',
    //   open_in_tab: true,
    // },

    // devtools_page: './devtools/index.html',

    omnibox: { keyword: 'go' },
    content_security_policy: {
      extension_pages: `script-src http://localhost:${props.port ?? 3000} 'self'; object-src http://localhost:${props.port ?? 3000} 'self';`,
      sandbox: `script-src 'self' 'unsafe-eval' http://localhost:${props.port ?? 3000}; sandbox allow-scripts allow-forms allow-popups allow-modals; child-src 'self';`,
    },
    externally_connectable: {
      matches: [
        'http://localhost:*/*',
        '*://dev.tiktok.com/*',
        'https://www.tiktok.com/*',
        'https://api.tiktok.com/*',
      ],
    },
    declarative_net_request: {
      rule_resources: [
        {
          id: 'env_header',
          enabled: true,
          path: 'rules/envHeader.json',
        },
        {
          id: 'account',
          enabled: true,
          path: 'rules/account.json',
        },
      ],
    },
    default_locale: 'en',
  };

  return manifest;
}
