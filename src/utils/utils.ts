export function swap(arr: any[], i: number, j: number) {
    const temp = arr[i]
    arr[i] = arr[j]
    arr[j] = temp
}

export function $(selector: string) {
    return document.querySelector(selector) as Element
}