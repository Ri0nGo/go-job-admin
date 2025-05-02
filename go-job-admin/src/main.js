import { createApp } from 'vue'
import 'normalize.css'
import ElementPlus from 'element-plus'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'
import {setupRouterGuard} from "./router/guard.js";

const app = createApp(App)
const pinia = createPinia()

pinia.use(piniaPluginPersistedstate)
setupRouterGuard()

app.use(pinia)
app.use(ElementPlus)
app.use(router)
app.mount('#app')
