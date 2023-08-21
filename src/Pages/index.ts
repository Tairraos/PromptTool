import VueRouter from "vue-router"
import vIndex from "../Pages/Index/Index.vue"
import type { VueConstructor } from "vue"

export function getRoutes() {
    return [
        {
            //即使你的工具不是放在 web 根上，也不要删除本行，npm run dev要用
            path: "/",
            name: "Index",
            component: vIndex,
        },
        {
            //minifix: 如果你的工具不想放在 web 根上
            //比如你的web位置是用这样的URL访问 https://www.localweb.com/prompt/ 
            //那就改成下面这样
            path: "/prompt/", 
            name: "Index",
            component: vIndex,
        },
    ]
}

export function getPagesRouter(Vue: VueConstructor) {
    let routes = getRoutes()
    Vue.use(VueRouter)
    let router = new VueRouter({ mode: "history", routes })
    return router
}
