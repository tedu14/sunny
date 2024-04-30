export function isArrayEmpty(arr: unknown) {
    return Array.isArray(arr) && arr.length === 0;
}

export function isFunction(fn: unknown) {
    return typeof fn === "function";
}

export function isObj(obj: unknown) {
    return obj !== null && typeof obj === "object";
}

export function isEmpty(item: unknown) {
    if (Array.isArray(item)) {
        return isArrayEmpty(item);
    }
    if (isObj(item)) {
        return isEmpty(Object.keys(item));
    }
    return !item;
}

export function flattenObject(obj: Record<string, unknown>, prefix = "") {
    return Object.keys(obj).reduce((acc, key) => {
        const accKey = `${prefix}${key}`;
        if (isObj(obj[key])) {
            return {
                ...acc,
                ...flattenObject(
                    obj[key] as Record<string, unknown>,
                    `${accKey}.`
                ),
            };
        }
        return { ...acc, [accKey]: obj[key] };
    }, {});
}
