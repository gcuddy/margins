export const toggleParam = (params: URLSearchParams, key: string, value: string) => {
    if (params.get(key) === value) {
        params.delete(key)
    } else {
        params.set(key, value)
    }
    return params
}