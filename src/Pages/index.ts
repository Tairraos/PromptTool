import VueRouter from "vue-router"
import vIndex from "../Pages/Index/Index.vue"
import type { VueConstructor } from "vue"

export function getRoutes() {
    return [
        {
            //即使你不是把工具放在根上的，也不要删除本行，npm run dev要用
            path: "/",
            name: "Index",
            component: vIndex,
        },
        {
            //minifix: 你的工具URL路由, 用/结尾
            //我的工具URL是 https://localweb.com/Experiment/Tools/prompt/ 
            //如果是放在根上，直接一个/就可以
            path: "/Experiment/Tools/prompt/", 
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
