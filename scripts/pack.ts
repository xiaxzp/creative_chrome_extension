import { execSync } from 'node:child_process';
import { zipFileName } from './utils';

function packZip() {
  execSync(`zip -vr "${zipFileName}" ./dist -x "*.DS_Store"`, { stdio: 'inherit' });
}

packZip();
