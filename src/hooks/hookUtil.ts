export function setRem(fn: Function) {
    console.log('homeRem')
    let width = windowWidthReturnType()
    fn(width)
    if (width == 'pc') {
        document.documentElement.style.fontSize = `${window.innerWidth / 100}px`;
    } else if (width === 'pad') {
        document.documentElement.style.fontSize = `${window.innerWidth / 45}px`;
    } else if (width === 'Pad') {
        document.documentElement.style.fontSize = `${window.innerWidth / 100}px`;
    } else {
        document.documentElement.style.fontSize = `${window.innerWidth / 30}px`;
    }

}

export function windowWidthReturnType() {
    return window.innerWidth < 600 ? 'phone' : window.innerWidth < 940 ? 'pad' : window.innerWidth < 941 ? 'Pad' : 'pc'
}   