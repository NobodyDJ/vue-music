// 哈希模式
import { createRouter, createWebHashHistory } from 'vue-router'
// 引入组件采用首字母大写的形式
import Recommend from '@/views/recommend'
import Singer from '@/views/singer'
import TopList from '@/views/top-list'
import Search from '@/views/search'
import SingerDetail from '@/views/singer-detail'
import Album from '@/views/album'
import TopDetail from '@/views/top-detail'

// 配置路由组件 注意引入组件首字母大写 随后遵守驼峰命名规则
const routes = [
  // 利用重定向，进入网页首页时，默认跳转至推荐页面
  {
    path: '/',
    redirect: '/recommend'
  },
  {
    path: '/recommend',
    component: Recommend,
    children: [
      {
        path: ':id',
        component: Album
      }
    ]
  },
  {
    path: '/singer',
    component: Singer,
    children: [
      {
        path: ':id',
        component: SingerDetail
      }
    ]
  },
  {
    path: '/top-list',
    component: TopList,
    children: [
      {
        path: ':id',
        component: TopDetail
      }
    ]
  },
  {
    path: '/search',
    component: Search,
    children: [
      {
        path: ':id',
        component: SingerDetail
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
