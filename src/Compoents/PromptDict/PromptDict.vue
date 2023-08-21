<!-- Created on 2023/03/31 - 12:10 -->
<template>
    <div class="PromptDict">
        <div class="dir-buttons" v-if="dict">
            <button v-for="dir in dict" :class="{ active: dir == activeDir }" @click="doChangeActiveDir(dir)">
                {{ dir.name }}
            </button>
        </div>

        <div class="active-dir" v-if="activeDir">
            <details class="sub-dir" v-for="subDir in activeSubDirs" :key="subDir.name">
                <summary class="name" v-show="subDir.name != activeDir.name">
                    <span class="title">{{ subDir.name }}</span>
                    <span class="len">{{ subDir.words.length }}</span>
                </summary>
                <div class="list">
                    <div class="item" v-for="word in subDir.words">
                        <PromptItem :item="word" @click="doApplyWord(word)" class="dict-word" />
                    </div>
                </div>
            </details>
        </div>
    </div>
</template>
<style lang="scss">
.PromptDict {
    padding: 0 20px;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    .dir-buttons {
        display: flex;
        flex-wrap: wrap;
        margin: 0 4px;
        margin-bottom: 12px;
        padding: 0;
        border-radius: 4px;
        overflow: hidden;
        height: auto;
        flex: none;
        width: auto;
        background: #d5d7ef;
        button {
            background: #d5d7ef;
            color: #4545b2;
            border-radius: 0;
            flex: auto;
            min-width: 72px;
            white-space: nowrap;
            place-content: center;
            &.active {
                background: #4545b2;
                color: #d5d7ef;
                text-shadow: 0 1px 1px rgb(49 52 88);
            }
        }
    }
    .active-dir {
        height: auto;
        overflow-y: scroll;

        .sub-dir > .name {
            padding: 12px 0;
            font-size: 14px;
            font-weight: bold;
            color: #7e7e7e;
            text-shadow: 0 1px rgba(255, 255, 255, 0.4901960784);
            cursor: pointer;
            user-select: none;
            > .title {
                padding-left: 6px;
            }
            > .len {
                background: #e6e6e6;
                color: #7e7e7eb0;
                border-radius: 4px;
                padding: 1px 8px;
                margin-left: 4px;
                text-align: center;
                display: inline-flex;
                place-content: center;
                font-size: 12px;
                font-weight: normal;
                font-family: "JetBrains Mono";
            }

            &::marker {
                color: rgba(126, 126, 126, 0.5);
            }
        }
        .list {
            display: flex;
            flex-wrap: wrap;
        }
        &::-webkit-scrollbar {
            width: 12px;
            height: 12px;
            background-color: #aaa0;
        }
        &::-webkit-scrollbar-thumb {
            background: #838383;
            border-radius: 29px;
            border: 2px solid #e9e9e9;
        }
    }

}
</style>
<script>
import { getDictData } from "./getDictData"
import vPromptItem from "../../Compoents/PromptEditor/Components/PromptItem/PromptItem.vue"


export default {
    data() {
        return {
            dict: null,
            activeDir: null,
            loading: false,
            isHoverButton: false,
        }
    },
    watch: {
    },
    created() {
        this.loadData()
    },
    methods: {
        loadData() {
            getDictData().then((dict) => {
                this.dict = dict
                this.activeDir = dict[0]
            })
        },

        async reloadData() {
            this.loadData()
        },

        async doApplyWord(item) {
            let activeInputEl = document.body.querySelector(".PromptWork.active")
            if (!activeInputEl) activeInputEl = document.body.querySelector(".PromptWork")
            // console.log("activeInputEl", activeInputEl)

            if (activeInputEl) {
                let insertText = item.data.word.rawText ?? item.data.word.text
                let vueIns = activeInputEl.__vue__
                await vueIns.promptWork.reflowPrompts(insertText)
                vueIns.doExportPrompt()
            }
        },

        doChangeActiveDir(dir) {
            this.activeDir = dir
        },
    },
    components: { PromptItem: vPromptItem },

    computed: {
        activeSubDirs() {
            if (this.activeDir) {
                return [this.activeDir, ...this.activeDir.children]
            }
        }
    },
}
</script>
