export function swap(arr: any[], i: any, j: any) {
    const temp = arr[i]
    arr[i] = arr[j]
    arr[j] = temp
}