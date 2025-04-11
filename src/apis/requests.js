import axios from 'axios';
import { ElMessage } from 'element-plus'

const service = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 3000,

})

service.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') ?? ""
    config.headers['Authorization'] = token
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
    console.log('Response Data:', res)
    console.log("res header", response.headers)
    if (res.code != 0) {
      ElMessage.error(res.msg || '请求失败')
      return Promise.reject(new Error(res.msg || 'Error'))
    }
    // 处理 jwt token
    const authHeader = response.headers['Authorization'] || response.headers['authorization']
    console.log('Authorization Header:', response.headers, authHeader)
    if (authHeader) {
      localStorage.setItem('token', authHeader)
    }

    return res.data ?? res
  },
  (error) => {
    ElMessage.error(error.response?.data?.message || '网络异常')
    return Promise.reject(error)
  }
)

export default service
