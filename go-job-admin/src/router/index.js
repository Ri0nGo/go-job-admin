import {createWebHashHistory, createRouter} from 'vue-router'
import Login from "../pages/login/login.vue";
import Index from "../pages/index.vue";
import Home from "../pages/home/home.vue";
import Nodes from "../pages/nodes/nodes.vue";
import Jobs from "../pages/jobs/jobs.vue";
import Systems from "../pages/systems/systems.vue";
import Callback from "../pages/oauth2/callback.vue";
import UserBind from "../pages/oauth2/userBind.vue";


const routes = [
    {
        path: '/',
        component: Index,
        children: [
            {path: '', component: Home},
            {path: '/jobs', component: Jobs},
            {path: '/nodes', component: Nodes},
            {path: '/systems', component: Systems},
        ]
    },
    {path: '/login', component: Login},
    {path: '/oauth2/callback', component: Callback},
    {path: '/oauth2/bind', component: UserBind},

]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

export default router