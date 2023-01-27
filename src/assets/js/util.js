export function shuffle(list) {
    const arr = JSON.parse(JSON.stringify(list))
    for (let i = 0; i < list.length; i++) {
        const j = getRandomInt(i)
        swap(arr, i, j)
    }
    return arr
}

function getRandomInt(max) {
    // Math.random()是随机获取0-1（不包括1 ）的随机数，传入一个参数保证随机出现一个0-1 —— （0 - 1）* max的一个数
    return Math.floor(Math.random() * max)
}

function swap(arr, i, j) {
    let temp = null
    temp = arr[i]
    arr[i] = arr[j]
    arr[j] = temp
}
