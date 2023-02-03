import { get } from './base'

// 获取歌手的url
export function processSongs(songs) {
    if (!songs.length) {
        return Promise.resolve(songs)
    }
    return get('/api/getSongsUrl', {
        mid: songs.map((song) => {
            return song.mid
        })
    }).then((result) => {
        const map = result.map
        return songs.map((song) => {
            song.url = map[song.mid]
            return song
        }).filter((song) => {
            return song.url && song.url.indexOf('vkey') > -1
        })
    })
}

const lyricMap = {}
export function getLyric(song) {
    // 首先判断传进来的歌曲，是否已经保存了歌词
    if (song.lyric) {
        Promise.resolve(song.lyric)
    }
    // 如果有相同mid的歌曲，则是同一首歌，返回该歌词
    const mid = song.mid
    const lyric = lyricMap[mid]
    if (lyric) {
        Promise.resolve(lyric)
    }
    return get('/api/getLyric', {
        mid
    }).then((result) => {
        const lyric = result ? result.lyric : '[00:00:00]该歌曲暂时无法获取歌词'
        lyricMap[mid] = lyric
        return lyric
    })
}
