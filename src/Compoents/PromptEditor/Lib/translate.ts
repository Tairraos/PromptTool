import axios from "axios"
;(<any>window)._translate = translate

let cache: any = {}

export async function translate(testList: string[]) {
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
    let baseurl = "/" //minifix: 你访问该工具的URL, 写全域名可以支持 npm run dev 调试时翻译内容，比如 https://prompt.localweb.com/，需要cros插件支持
    let host = baseurl.replace(/\/*$/, "") + "/mtproxy.php" //能访问到代理的路径
    let data = new URLSearchParams()
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
}
translate.cache = cache
