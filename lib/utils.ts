export function isArrayEmpty(value: unknown): value is [] {
    return Array.isArray(value) && value.length === 0
}
