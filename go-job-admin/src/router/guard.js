import router from './index.js'
import {useUserStore} from "../store/index.js";

let hasGetInfo = false;

const skipCheckPath = [
    "/oauth2/callback",
    "/oauth2/bind"
]

export const setupRouterGuard = () => {
    // 鉴权前置路由
    createPermissionGuard(router);
};

function createPermissionGuard(router) {
    router.beforeEach(async (to, from, next) => {

        const userStore = useUserStore();
        const token = userStore.token

        // 如果目标路径在白名单中，则直接放行
        if (skipCheckPath.includes(to.path)) {
            return next();
        }

        // 未登录且不在登录页
        if (!token && to.path !== '/login') {
            console.log("用户未登录，自动跳转到登录页...")
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
            try{
                await userStore.getUserInfo();
                hasGetInfo = true;
            }catch(err){
                console.log("get user info err:", err);
            }

        }

        next();
    })
}