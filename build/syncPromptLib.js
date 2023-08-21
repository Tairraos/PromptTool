import fs from "fs"
import path from "path"
import config from "../vite.config.js"

const projectFile = path.join(config.build.publicDir, "prompt.xlsx")
const targetFile = path.join(config.build.outDir, "prompt.xlsx")

if (fs.existsSync(targetFile)) {
    const projectFileTime = fs.statSync(projectFile).mtimeMs
    const targetFileTime = fs.statSync(targetFile).mtimeMs
    
    if (projectFileTime > targetFileTime) {
        fs.copyFileSync(projectFile, targetFile);
        console.log(`工程文件夹下的 Prompt.xlsx 较新，build 命令会部署此文件。`)
    } else if (projectFileTime < targetFileTime) {
        fs.copyFileSync(targetFile, projectFile);
        console.log(`部署文件夹下的 Prompt.xlsx 较新，已经同步。`)
    } else {
        console.log(`工程文件夹下和部署文件夹下的 Prompt.xlsx 文件一致，不需要同步。`)
    }
} else {
    console.log(`部署文件夹下为空，不需要同步。`)
}
