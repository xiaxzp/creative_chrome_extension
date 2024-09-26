import fs from 'fs-extra';
import type { Manifest } from 'webextension-polyfill';
import type PkgType from '../package.json';
import { isDev, r } from '../scripts/utils';
import { MATCH_URLS } from '~/const';

interface ManifestV3 extends Manifest.WebExtensionManifest {
  host_permissions: string[]
  options_page: string
  externally_connectable?: Record<string, any>
  // declarative_net_request?: Record<string, any>;
}

export async function getManifest() {
  const pkg = (await fs.readJSON(r('package.json'))) as typeof PkgType;

  // update this file to update this manifest.json
  // can also be conditional based on your need
  const manifest: ManifestV3 = {
    manifest_version: 3,
    name: (pkg.displayName || pkg.name).concat(isDev ? ' - 开发版' : ''),
    version: pkg.version,
    description: pkg.description,
    icons: {
      16: './imgs/logo.png',
      48: './imgs/logo.png',
      128: './imgs/logo.png',
    },
    background: {
      service_worker: './serviceworker/serviceworker.js',
    },
    action: {
      default_icon: './imgs/logo.png',
      default_popup: './popup/index.html',
      default_title: 'Extension Tool',
    },
    content_scripts: [
      {
        matches: [
          ...MATCH_URLS,
        ],
        js: ['./content/content.js'],
        run_at: 'document_start',
      },
    ],
    permissions: [
      'contextMenus',
      'tabs',
      // 'notifications',
      'webRequest',
      'storage',
      'cookies',
      // 'activeTab',
      // 'scripting',
      'declarativeNetRequest',
      // 'declarativeNetRequestFeedback',
      'debugger',
    ],
    host_permissions: ['*://*/*'],
    web_accessible_resources: [
      {
        resources: ['inject/*', 'content/*', 'assets/*', 'imgs/*', 'lib/*'],
        matches: [
          ...MATCH_URLS,
        ],
      },
    ],

    homepage_url: 'http://js/tcm',
    options_page: './options/index.html',
    options_ui: {
      page: './options/index.html',
      open_in_tab: true,
    },

    devtools_page: './devtools/index.html',

    omnibox: { keyword: 'go' },
    content_security_policy: {
      extension_pages:
        'script-src http://localhost:* \'self\'; object-src http://localhost:* \'self\';',
    },
    externally_connectable: {
      matches: [
        'http://localhost:*/*',
        'https://www.github.com/*',
      ],
    },
    declarative_net_request: {
      rule_resources: [{
        id: 'ruleset_1',
        enabled: true,
        path: 'rules/rules.json',
      }],
    },
  };

  return manifest;
}
