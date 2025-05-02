import axios from 'axios';
import { ElMessage } from 'element-plus'
import {useUserStore} from "../store/index.js";
import router from "../router/index.js";

const service = axios.create({
    baseURL: import.meta.env.VITE_APP_BASE_API,
    timeout: 3000,
})

// 请求拦截器
service.interceptors.request.use(
    (config) => {
        const userStore = useUserStore();
        config.headers['Authorization'] = userStore.token
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)


// 响应拦截器
service.interceptors.response.use(
    (response) => {
        const res = response.data

        if (res.code !== 0) {
            ElMessage.error(res.msg || '请求失败')
            return Promise.reject(new Error(res.msg || 'Error'))
        }

        // 处理 jwt token
        const userStore = useUserStore()
        const token = response.headers['Authorization'] || response.headers['authorization']
        if (token) {
            userStore.setToken(token)
        }

        return res.data ?? res
    },
    (error) => {
        if (error.response?.status === 401) {
            const userStore = useUserStore()
            userStore.clearUserStore()
            router.push('/login')
            return Promise.reject(new Error('登录已过期'))
        }
        ElMessage.error(error.response?.data?.message || '网络异常')
        return Promise.reject(error)
    }
)

export default service