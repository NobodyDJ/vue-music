// 此模块的主要功能是为了进行本地存储，保存用户存储的收藏列表，播放列表等

// 插入数组
function insertArray(arr, item, compare) {
    const index = arr.findIndex(compare)
    if (index > -1) {
        return
    }
    arr.unshift(item)
}

export function save(item, key, compare) {
    if (!localStorage.getItem(key)) {
        localStorage.setItem(key, [])
    }
    const items = localStorage.getItem(key)
    insertArray(items, item, compare)
    return items
}
