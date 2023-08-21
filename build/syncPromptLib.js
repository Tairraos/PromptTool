import fs from "fs"
import path from "path"
import config from "../vite.config.js"

const projectFile = path.join(config.build.publicDir, "prompt.xlsx")
const targetFile = path.join(config.build.outDir, "prompt.xlsx")
const projectFileTime = fs.statSync(projectFile).mtimeMs
const targetFileTime = fs.statSync(targetFile).mtimeMs

if (projectFileTime > targetFileTime) {
    fs.copyFileSync(projectFile, targetFile);
    console.log(`Project file is newer.`)
} else if (projectFileTime < targetFileTime) {
    fs.copyFileSync(targetFile, projectFile);
    console.log(`Target file is newer.`)
} else {
    console.log(`Project file and target file are same modification time.`)
}
