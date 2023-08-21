<template>
    <div class="PromptEditor">
        <div class="workspace">
            <PromptWork
                v-for="work in promptEditor.works"
                :prompt-work="work"
                :key="work.id"
                @delete="doDeletePromptWork"
            />
        </div>

        <div class="operate-tool" ref="operate-tool">
            <button @click="doAddWorkspace"><Icon icon="radix-icons:card-stack-plus" /> 添加工作区</button>
            <button @click="doCopyWorkspaceUrl"><Icon icon="radix-icons:link-2" /> 复制链接</button>
            <button @click="doExportDisabled"><Icon icon="solar:clipboard-broken" /> 复制标灰的提示词</button>
            <div class="pngout-option checkbox">
                <input id="ope-expf" type="checkbox" v-model="promptEditor.data.enablePngExportFixed" />
                <label for="ope-expf"> 导出 PNG 时固定尺寸</label>
            </div>
            <div class="pngout-option checkbox">
                <input id="ope-expf2" type="checkbox" v-model="promptEditor.data.enablePngExportCopy" />
                <label for="ope-expf2"> 导出 PNG 到剪贴板</label>
            </div>
        </div>
    </div>
</template>
<style lang="scss">
.PromptEditor {
    position: relative;
    max-width: 1280px;
    margin-left: 10px;
    .debug {
        margin-top: 200px;
    }
    .subType-null {
        box-shadow: 0 1px 2px #f00;
    }
    .operate-tool {
        margin: 20px;
        display: flex;
        gap: 6px;
        .checkbox {
            margin-left: 32px;
        }
    }
}
</style>
<script>
import { PromptEditorClass } from "./PromptEditorClass"
import PromptWork from "./Components/PromptWork/PromptWork.vue"
import { dndInit } from "./Lib/DnD"
import { useClipboard } from "@vueuse/core"
import { useDatabaseServer } from "../PromptEditor/Lib/DatabaseServer/DatabaseServer"

let { copy } = useClipboard()
let existKeys = []
export default {
    props: ["initPrompts"],
    data() {
        dndInit()
        let promptEditor = new PromptEditorClass({ initPrompts: this.initPrompts })
        return {
            promptEditor,
            adDelay: false,
        }
    },
    components: { PromptWork },
    provide() {
        setTimeout(() => (this.adDelay = true), 500)
        return { PromptEditor: this }
    },
    methods: {
        doAddWorkspace() {
            this.promptEditor.addWorkspace()
            setTimeout(() => {
                this.$refs["operate-tool"].scrollIntoView({
                    behavior: "smooth",
                })
            }, 100)
        },
        doCopyWorkspaceUrl() {
            let prompts = this.promptEditor.works.map((w) => w.exportPrompts())
            let q = encodeURIComponent(JSON.stringify(prompts))
            let url = `${location.origin + location.pathname}?prompts=${q}`
            copy(url)
        },
        async doExportDisabled() {
            let exportArray = []
            if (!existKeys.length) {
                existKeys = Object.keys(useDatabaseServer().localPromptDefineMap)
            }
            Array.from(document.querySelectorAll(".PromptItem.disabled")).forEach((item) => {
                let key = item.querySelector(".displayName").innerText
                if (!existKeys.includes(key)) {
                    let zhTxt = item.querySelector(".langName").innerText
                    existKeys.push(key)
                    exportArray.push(`${key}\t${zhTxt}`)
                }
            })
            copy(exportArray.join("\n"))
        },
        doDeletePromptWork(promptWork) {
            this.promptEditor.removeWorkspace(promptWork)
        },
    },
}
</script>
