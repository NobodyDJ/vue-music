import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// 引入全局的公共样式 这样前端的页面就可以使用这个样式了，
import '@/assets/scss/index.scss'

const app = createApp(App)
// 这里的use是vue3使用插件的方式，这里是一个链式调用，每次使用use方法会返回一个app对象，最后挂载到DOM元素上
app.use(store).use(router).use(ElementPlus).mount('#app')
