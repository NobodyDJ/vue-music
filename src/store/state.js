import { PLAY_MODE, FAVORITE_KEY, SEARCH_KEY, PLAY_KEY } from '@/assets/js/constant'
import { load } from '@/assets/js/array-store'

// 原始数据
const state = {
    // 歌曲列表，展示为某歌手下的所有顺序歌曲
    sequenceList: [],
    // 播放列表，可以根据需求打乱播放列表，用于播放方式
    playList: [],
    // 播放模式
    playMode: PLAY_MODE.sequence,
    // 播放状态
    playing: false,
    // 当前播放歌曲
    currentIndex: 0,
    // 全屏还是小屏
    fullScreen: false,
    // 获取本地收藏列表
    favoriteList: load(FAVORITE_KEY),
    // 获取本地搜索历史
    searchHistory: load(SEARCH_KEY),
    // 获取本地播放历史
    playHistory: load(PLAY_KEY)
}

export default state
