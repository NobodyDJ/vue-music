// 对state中的数据进行修改在获取
// 计算属性获取当前歌曲
const currentSong = (state) => {
    return state.playList[state.currentIndex]
}

export { currentSong }
