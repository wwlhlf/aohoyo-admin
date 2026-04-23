import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import App from './App.vue'
import router from './router'
import { setupDirectives } from '@/directives/permission'
import i18n from './locales'

import 'element-plus/theme-chalk/base.css'
import './styles/index.css'

const app = createApp(App)

// Pinia
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)

// Router
app.use(router)

// i18n 国际化
app.use(i18n)

// 注册全局指令
setupDirectives(app)

app.mount('#app')
