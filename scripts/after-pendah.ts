import {execSync} from "child_process";
const fs = require('fs');
const path = require('path');

const pendahProjectPathName = 'creative_pendah'
const pendahBuildPath = `../${pendahProjectPathName}/apps/browser-extension/build/chrome-mv3-prod`
const tagetBuildPath = `dist`;
const pendahBuildPathName = 'pendah'
const buildPendahPath = path.join(__dirname, '../', tagetBuildPath, pendahBuildPathName);

async function startPostProcessPendah() {
    // 创建目录
    execSync(`
    mkdir ./${tagetBuildPath}/${pendahBuildPathName}
    `, { stdio: 'inherit' });

    // copy pendah文件
    execSync(`
    cp -a ${pendahBuildPath}/.  ${buildPendahPath}/
    `, { stdio: 'inherit' });

    // 重新命名
    reNameFile('background', 'js');
    reNameFile('main', 'js');
    reNameFile('main', 'css');


    console.log('✅build success')
}

function reNameFile(startPathName: string, fileType: string) {


    // 1. 读取目录内容
    const files = fs.readdirSync(buildPendahPath);

    // 2. 定义文件名匹配正则表达式 (background.数字.js)
    const pattern = new RegExp(`^${startPathName}\.[^.]+\.${fileType}$`);

    // 3. 过滤匹配文件
    const matchedFiles = files.filter(file => {
        console.log(file);
        return  pattern.test(file);
    });

    // 4. 验证唯一性
    if (matchedFiles.length !== 1) {
        throw new Error(' build error: can\'t find pendah, please retry')
        return;
    }

    // 5. 构造旧/新文件路径
    const oldFilePath = path.join(buildPendahPath, matchedFiles[0]);
    const newFilePath = path.join(buildPendahPath, `${startPathName}.${fileType}`);

    // 6. 执行重命名
    fs.renameSync(oldFilePath, newFilePath);
    console.log(`重命名成功: ${matchedFiles[0]} → ${startPathName}.${fileType}`);
}


startPostProcessPendah();