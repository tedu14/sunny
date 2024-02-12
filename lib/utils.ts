export function isArrayFulled<T>(value: unknown): value is T[] {
    return Array.isArray(value) && value.length >= 1
}
