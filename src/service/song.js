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
        console.log(result)
        const map = result.map
        return songs.map((song) => {
            song.url = map[song.mid]
            return song
        }).filter((song) => {
            return song.url && song.url.indexOf('vkey') > -1
        })
    })
}
