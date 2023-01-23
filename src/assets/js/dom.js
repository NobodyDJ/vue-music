export function addClass(el, className) {
    // node.js的写法？
    if (!el.classList.contains(className)) {
        el.classList.add(className)
    }
}

export function removeClass(el, className) {
    el.classList.remove(className)
}
