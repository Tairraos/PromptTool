import { PromptWork } from "./Sub/PromptWork"

export class PromptEditorClass {
    data = {
        enablePngExportFixed: false,
        enablePngExportCopy: false,
    }

    works: PromptWork[]

    addWorkspace() {
        this.works.push(new PromptWork())
    }
    removeWorkspace(promptWork: PromptWork) {
        this.works = this.works.filter((item) => item !== promptWork)
    }

    constructor(options?: { initPrompts?: string[] }) {
        if (options?.initPrompts) {
            this.works = options.initPrompts.map((initText) => new PromptWork({ initText }))
        } else {
            this.works = [
                new PromptWork({
                    name: "可爱姑娘",
                    initText: `masterpiece, best quality, paw pose, cute girl`,
                    parser: "stable-diffusion-webui",
                }),
                new PromptWork({
                    // initText: `symmetrical,(PureErosFace_V1:0.8), [:(highly detail face: 1.2):0.1],[to:when],[from::when], [[df]], (((twintails))), <lora:koreanDollLikeness_v10:0.5>`,
                    parser: "stable-diffusion-webui",
                }),
            ]
        }
    }
}
