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
    },
    addSongLyric(state, { song, lyric }) {
        // 更改歌曲保存歌词
        state.sequenceList.map((item) => {
            if (item.mid === song.mid) {
                item.lyric = lyric
            }
            return item
        })
    },
    setSearchHistory(state, searchHistory) {
        state.searchHistory = searchHistory
    },
    setPlayHistory(state, playHistory) {
        state.playHistory = playHistory
    }
}
export default mutations
