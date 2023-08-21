import axios from "axios"
import { chinesePercentage } from "./chinesePercentage"
import { AnyARecord } from "dns"
;(<any>window)._translatePrompts = translatePrompts

let cache: any = {}
export async function translatePrompts(testList: string[], target = "zh") {
    try {
        let resultList: string[][] = []
        let reqList: [string, number][] = []

        testList.forEach((text, i) => {
            if (cache[text]) {
                let t = cache[text]
                resultList.push([text, t])
            } else {
                resultList.push([text])
                reqList.push([text, i])
            }
        })

        if (reqList.length == 0) return resultList.map((x) => x[1])
        let baseurl = "https://prompt.localweb.com/" //minifix: 你访问该工具的URL
        let host = baseurl.replace(/\/*$/, "") + "/mtproxy.php"
        let data = new URLSearchParams()
        target !== "zh" && data.append("to", "en")
        data.append("text", reqList.map((req) => `${req[0]}`).join("\n"))
        let re = await axios.post(host, data, { headers: { "Content-Type": "application/x-www-form-urlencoded" } })

        if (re && re.data) {
            let list = re.data.split("|")
            list.forEach((text: string, i: number) => {
                if (reqList[i]) {
                    let raw = reqList[i][0]
                    let index = reqList[i][1]
                    resultList[index].push(text)
                    cache[raw] = text
                    if (!cache[text]) cache[text] = raw
                }
            })
            return resultList.map((x) => x[1])
        }
    } catch (e) {
        console.error(e)
    }
}

export async function translateZh2En(texts: string[]) {
    let finTexts = texts.slice()
    let zhWords: [string, number][] = []
    texts.forEach((text, i) => {
        if (chinesePercentage(text)) {
            zhWords.push([text, i])
        }
    })
    let prompts = zhWords.map((x) => {
        return x[0]
    })
    let re = await translatePrompts(prompts, "en")
    // console.log("[translateZh2En]", prompts, "=>", re)
    if (re) {
        re.forEach((en, i) => {
            let orgIndex = zhWords[i][1]
            finTexts[orgIndex] = en
        })
    }
    return finTexts
}
