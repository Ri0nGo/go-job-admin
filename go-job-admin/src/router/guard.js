import router from './index.js'
import {useUserStore} from "../store/index.js";

const hasGetInfo = false;

export const setupRouterGuard = () => {
    // 鉴权前置路由
    createPermissionGuard(router);
};

function createPermissionGuard(router) {
    router.beforeEach(async (to, from, next) => {

        const userStore = useUserStore();
        const token = userStore.token

        // 未登录且不在登录页
        if (!token && to.path !== '/login') {
            console.log("用户未登录，自动跳转到登录页")
            next({ path: "/login" });
            return;
        }

        // 防止重复登录
        if (token && to.path === '/login') {
            console.log("用户已登录")
            next({ path: from.path ? from.path : '/' });
            return;
        }

        if (token && !hasGetInfo) {
            await userStore.getUserInfo();
        }

        next();
    })
}