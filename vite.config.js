import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue2"
import path from "path"
import url from "url"
import { resolve } from "path"
import progress from "vite-plugin-progress"
import * as process from "process"
import * as dotenv from "dotenv"
dotenv.config()

const __dirname = path.dirname(url.fileURLToPath (import.meta.url))
let config = {
    root: "./web",
    base: "./",
    server: {
        port: 12833,
        host: "0.0.0.0",
    },
    worker: {
        format: "es",
    },
    plugins: [vue(), progress()],
    css: {},
    build: {
        // minify: "terser",
        assetsInlineLimit: 1024 * 10 /* 10kb */,
        emptyOutDir: true,
        outDir: resolve(__dirname, "./dist"), //minifix: 部署目录相对于config文件的路径
        assetsDir: `assets`,
        publicDir: resolve(__dirname, "web/public"),
        rollupOptions: {
            input: {
                main: resolve(__dirname, "web/index.html"),
            },
        },
        reportCompressedSize: false,
    },
    resolve: {},
    define: {},
}
// ------------- [vite build] ------------
if (process.env.NODE_ENV == "production") {
    // @ts-ignore
    // config.build.minify = "terser"
}
export default defineConfig(config)
