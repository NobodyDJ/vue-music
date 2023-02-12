import { get } from './base'

// 获取数据推荐歌单
export function getRecommend() {
    return get('/api/getRecommend')
}

// 获取歌单详情数据
export function getAlbum(album) {
    return get('/api/getAlbum', {
        id: album.id
    })
}
