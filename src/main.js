// 项目入口文件
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// 引入全局的公共样式 这样前端的页面就可以使用这个样式了，
import '@/assets/scss/index.scss'
import VueLazyload from 'vue-lazyload'
import loadingDirective from './components/loading/directive'
import noResultDirective from './components/base/no-result/directive'
import { load, saveAll } from '@/assets/js/array-store'
import { FAVORITE_KEY, PLAY_KEY } from '@/assets/js/constant'
import { processSongs } from '@/service/song'

const favoriteSongs = load(FAVORITE_KEY)
if (favoriteSongs.length > 0) {
    processSongs(favoriteSongs).then((songs) => {
        store.commit('setFavoriteList', songs)
        saveAll(songs, FAVORITE_KEY)
    })
}
const playSongs = load(PLAY_KEY)
if (playSongs.length > 0) {
    processSongs(playSongs).then((songs) => {
        store.commit('setPlayHistory', songs)
        saveAll(songs, PLAY_KEY)
    })
}

const app = createApp(App)
// 图片懒加载的效果
const loadImage = require('@/assets/images/default.png')
// 这里的use是vue3使用插件的方式，这里是一个链式调用，每次使用use方法会返回一个app对象，最后挂载到DOM元素上
app
    .use(store)
    .use(router)
    .use(ElementPlus)
    .use(VueLazyload, {
        loading: loadImage
    })
    .directive('loading', loadingDirective)
    .directive('noResult', noResultDirective)
    .mount('#app')
