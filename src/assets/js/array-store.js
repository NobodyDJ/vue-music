// 此模块的主要功能是为了进行本地存储，保存用户存储的收藏列表，播放列表等

// 插入数组
function insertArray(arr, item, compare, maxLen) {
    const index = arr.findIndex(compare)
    if (index > -1) {
        return
    }
    arr.unshift(item)
    if (maxLen && arr.length > maxLen) {
        arr.pop()
    }
}
// 删除数组中的元素
function deleteFromArray(arr, compare) {
    const index = arr.findIndex(compare)
    if (index > -1) {
        arr.splice(index, 1)
    }
}

// 保存数组
export function save(item, key, compare, maxLen) {
    if (!localStorage.getItem(key)) {
        localStorage.setItem(key, JSON.stringify([]))
    }
    const items = JSON.parse(localStorage.getItem(key))
    insertArray(items, item, compare, maxLen)
    localStorage.setItem(key, JSON.stringify(items))
    return items
}

// 删除数组
export function remove(key, compare) {
    const items = JSON.parse(localStorage.getItem(key))
    deleteFromArray(items, compare)
    localStorage.setItem(key, JSON.stringify(items))
    return items
}

// 加载初始化数据
export function load(key) {
    const list = JSON.parse(localStorage.getItem(key))
    return list
}
