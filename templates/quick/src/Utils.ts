
export function isOptionalOrEmptyArray<T>(array: Array<T> | undefined): array is undefined {
    return !array || array.length === 0;
}