import { createApp } from 'vue'
import './style/reset.css'
import App from './App.vue'
import 'element-plus/dist/index.css'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn' // 中文包
import router from './router'

const app = createApp(App)
app.use(ElementPlus, {
    locale: zhCn,
})
app.use(router)
app.mount('#app')
