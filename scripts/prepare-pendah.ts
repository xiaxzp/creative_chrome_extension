import {execSync} from "child_process";

const pendahProjectPathName = 'creative_pendah'

async function startPreparePendah() {
    // rush打包
    execSync(`cd ../${pendahProjectPathName} && rush update --purge && rush build`, {
        stdio: 'inherit',
    });

    // execSync(`cd ../${pendahProjectPathName}/apps/browser-extension && pnpm build`, { stdio: 'inherit' });
}


startPreparePendah();