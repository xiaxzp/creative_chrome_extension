import fs from 'node:fs';
import { resolve } from 'node:path';
import process from 'node:process';
import { bgCyan, black } from 'kolorist';

export const port = Number.parseInt(process.env.PORT || '') || 3303;
export const r = (...args: string[]) => resolve(__dirname, '..', ...args);
export const isDev = process.env.NODE_ENV !== 'production';

export const distDir = 'dist';

export function log(name: string, message: string) {
  console.log(black(bgCyan(` ${name} `)), message);
}

export const version = JSON.parse(fs.readFileSync('./package.json', { encoding: 'utf-8' })).version;
export const zipFileName = `CreativeX_Web_extension.v${version}.zip`;
