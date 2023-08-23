import * as VueRouter from "vue-router";
import {RouteRecordRaw} from "vue-router";

const rootRoutes: Array<RouteRecordRaw> = [
    {
        path: "/",
        name: "Home",
        component: () => import('@/views/Home.vue'),
    },
];

const router = VueRouter.createRouter({
    history: VueRouter.createWebHashHistory(),
    routes: rootRoutes,
})

export default router;