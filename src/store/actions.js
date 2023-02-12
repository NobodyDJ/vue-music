import { PLAY_MODE } from '@/assets/js/constant'
import { shuffle } from '@/assets/js/util'

export function selectPlay({ commit, state }, { list, index }) {
    commit('setPlayMode', PLAY_MODE.sequence)
    commit('setSequenceList', list)
    commit('setPlayingState', true)
    commit('setFullScreen', true)
    commit('setPlayList', list)
    commit('setCurrentIndex', index)
}

// 随机播放
export function randomPlay({ commit, state }, list) {
    commit('setPlayMode', PLAY_MODE.random)
    commit('setSequenceList', list)
    commit('setPlayingState', true)
    commit('setFullScreen', true)
    commit('setPlayList', shuffle(list))
    commit('setCurrentIndex', 0)
}
// 选择播放模式
export function changeMode({ commit, state, getters }, mode) {
    const list = state.sequenceList
    const currentSongId = getters.currentSong.id
    if (mode === PLAY_MODE.random) {
        commit('setPlayList', shuffle(list))
    } else {
        commit('setPlayList', list)
    }
    const index = state.playList.findIndex((song) => song.id === currentSongId)
    commit('setPlayMode', mode)
    commit('setCurrentIndex', index)
}
// 移除歌曲
export function removeSong({ commit, state }, song) {
    // 对顺序列表与播放列表中的歌曲删除
    const sequenceList = state.sequenceList.slice()
    const playList = state.playList.slice()
    let currentIndex = state.currentIndex

    const sequenceIndex = findIndex(sequenceList, song)
    const playIndex = findIndex(playList, song)

    // 从逻辑上阻止不合理的删除情况出现
    if (sequenceIndex < 0 || playIndex < 0) {
        return
    }

    // 注意这里因为vueX的规则，要修改state中的数据必须通过mutations
    // 通过浅拷贝复制一份数组
    sequenceList.splice(sequenceIndex, 1)
    playList.splice(playIndex, 1)

    // 注意删除了歌曲的前一首歌，currentIndex不会发生歌曲，导致播放歌曲错误
    if (currentIndex > sequenceIndex || currentIndex > playIndex || currentIndex === sequenceList.length) {
        currentIndex--
    }
    commit('setSequenceList', sequenceList)
    commit('setPlayList', playList)
    commit('setCurrentIndex', currentIndex)
    if (!playList.length) {
        commit('setPlayingState', false)
    }
}

function findIndex(arr, song) {
    const index = arr.findIndex((item) => {
        return item.id === song.id
    })
    return index
}

export function clearSongList({ commit }) {
    commit('setPlayList', [])
    commit('setSequenceList', [])
    commit('setCurrentIndex', 0)
    commit('setPlayingState', false)
}
