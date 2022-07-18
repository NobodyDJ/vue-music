import { get } from './base'

// 获取数据推荐歌单
export function getRecommend() {
    return get('/api/getRecommend')
}
