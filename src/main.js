import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 引入全局的公共样式 这样前端的页面就可以使用这个样式了
import '@/assets/scss/index.scss'

createApp(App).use(store).use(router).mount('#app')
