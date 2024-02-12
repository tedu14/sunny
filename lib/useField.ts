import {
    useCallback,
    useEffect,
    useImperativeHandle,
    useMemo,
    useRef,
    useState
} from 'react'
import dot from 'dot-object'

import { FieldHookProps, FieldRef } from './types'
import { isArrayFulled } from './utils'
import { useFormProvider } from './FormProvider'
import { useScope } from './Scope'

export function useField<T>({
    name,
    getValue: externalGetValue,
    initialValue,
    mask,
    rules,
    setValue: externalSetValue,
    ref
}: FieldHookProps<T>) {
    const [error, setError] = useState<string | undefined>()

    const { initialData, registerField, unregisterField } = useFormProvider()
    const { path } = useScope()

    const inputRef = useRef<HTMLInputElement>(null)

    const handleValue = useCallback(() => {
        if (externalGetValue) return externalGetValue(inputRef)
        return inputRef.current?.value as T
    }, [externalGetValue])

    const isValid: FieldRef<T>['isValid'] = useCallback(() => {
        if (isArrayFulled(rules)) {
            return rules!.every(rule => !rule(handleValue()))
        }
        return true
    }, [])

    const getValue: FieldRef<T>['getValue'] = useCallback(() => {
        if (mask) return mask(handleValue()) as T
        return handleValue() as T
    }, [mask])

    const setValue: FieldRef<T>['setValue'] = useCallback(
        value => {
            if (externalSetValue) return externalSetValue(value as T, inputRef)
            inputRef.current!.value = (mask
                ? mask(value as T)
                : value) as unknown as string
        },
        [externalSetValue]
    )

    const getError: FieldRef<T>['getError'] = useCallback(() => error, [error])

    const handleError: FieldRef<T>['setError'] = useCallback(
        error => setError(error),
        []
    )

    const validate: FieldRef<T>['validate'] = useCallback(() => {
        if (!isArrayFulled(rules)) return
        const error = rules!.find(rule => rule(handleValue()))
        setError(error ? error(handleValue()) : undefined)
    }, [rules])

    const clearError: FieldRef<T>['clearError'] = useCallback(
        () => setError(undefined),
        []
    )

    const fieldName = useMemo(() => {
        return path ? `${path}.${name}` : name
    }, [path, name])

    const defaultValue = useMemo(() => {
        const value = dot.pick(fieldName, initialData)
        const fieldValue = value !== undefined ? value : initialValue

        return mask ? mask(fieldValue as T) : fieldValue
    }, [initialData, initialValue, fieldName, mask])

    const fieldRef: FieldRef<T> = useMemo(
        () => ({
            name: fieldName,
            isValid,
            getValue,
            setValue,
            getError,
            setError(err) {
                handleError(err)
            },
            validate,
            clearError,
            reset() {
                setValue(defaultValue)
                setError(undefined)
            }
        }),
        [fieldName, isValid, getValue, setValue, getError, validate]
    )

    if (ref) {
        useImperativeHandle(ref, () => fieldRef)
    }

    useEffect(() => {
        registerField(fieldName, fieldRef as unknown as FieldRef<string>)
        return () => unregisterField(fieldName)
    }, [fieldName, fieldRef, registerField, unregisterField])

    return {
        fieldRef: inputRef,
        defaultValue,
        clearError
    }
}
