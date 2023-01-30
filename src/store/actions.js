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
