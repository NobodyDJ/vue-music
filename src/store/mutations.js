// 用于改变state中的数据
const mutations = {
    setPlayingState(state, playing) {
        state.playing = playing
    },
    setSequenceList(state, sequenceList) {
        state.sequenceList = sequenceList
    },
    setPlayList(state, playList) {
        state.playList = playList
    },
    setPlayMode(state, playMode) {
        state.playMode = playMode
    },
    setCurrentIndex(state, currentIndex) {
        state.currentIndex = currentIndex
    },
    setFullScreen(state, fullScreen) {
        state.fullScreen = fullScreen
    },
    setFavoriteList(state, favoriteList) {
        state.favoriteList = favoriteList
    }
}
export default mutations
