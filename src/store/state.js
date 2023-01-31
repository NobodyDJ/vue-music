import { PLAY_MODE, FAVORITE_KEY } from '@/assets/js/constant'
import { load } from '@/assets/js/array-store'

// 原始数据
const state = {
    // 歌曲列表
    sequenceList: [],
    // 播放列表
    playList: [],
    // 播放模式
    playMode: PLAY_MODE.sequence,
    // 播放状态
    playing: false,
    // 当前播放歌曲
    currentIndex: 0,
    // 全屏还是小屏
    fullScreen: false,
    // 收藏列表
    favoriteList: load(FAVORITE_KEY)
}

export default state