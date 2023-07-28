import * as VueRouter from "vue-router";

const routes = [
    {
        path: "/",
        name: "Home",
        component: () => import('@/views/Home.vue'),
    },
];

const router = VueRouter.createRouter({
    history: VueRouter.createWebHistory(),
    routes,
})

export default router;