import { createWebHashHistory, createRouter } from 'vue-router'
import Login from "../pages/login/login.vue";


const routes = [
    { path: '/', component: Login },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

export default router