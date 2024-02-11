import { ForwardedRef, MutableRefObject, RefObject } from 'react'

type InputRef = RefObject<HTMLInputElement> | ForwardedRef<HTMLInputElement>

type JoinDot<T, K extends string> = K extends ''
    ? T
    : `${T extends string ? T : ''}.${K}`

type NestedKeys<O, Parent extends string = ''> = {
    [K in keyof O]: O[K] extends Obj
        ? NestedKeys<O[K], JoinDot<K & string, Parent>>
        : JoinDot<K & string, Parent>
}

export type Obj = {
    [x: string | number]: unknown
}

export type ObjError<D = Obj> = Record<keyof NestedKeys<D>, string | undefined>
export type KeyData<D = Obj> = keyof NestedKeys<D>

export type FieldRef<T = string> = {
    name: string
    isValid: () => boolean
    getValue: () => T
    setValue: (value: T) => void
    getError: () => string | undefined
    setError: (error: string | undefined) => void
    validate: () => void
    clearError: () => void
    reset: () => void
}
export type FieldRule<T = unknown> = (value: T) => string | undefined
export type FieldMask<T = unknown> = (value: T) => string | number

export type FormRef<D = Obj> = {
    setData: (data: D) => void
    getData: (fieldNames?: KeyData<D>[]) => D
    setErrors: (errors: ObjError<D>) => void
    validate: (fieldNames?: KeyData<D>[]) => void
    isValid: (fieldsNames?: KeyData<D>[]) => boolean
    reset: () => void
    getErrors: () => ObjError<D>
    submit: () => void
}

export type SunnyContextProps = {
    registerForm: <D>(formName: string, formRef: FormRef<D>) => void
    unregisterForm: (formName: string) => void
    getForm: <D>(formName: string) => FormRef<D>
}

export type FormContextProps = {
    registerField: (fieldName: string, fieldRef: FieldRef) => void
    unregisterField: (fieldName: string) => void
} & Pick<FormProps, 'initialData'>
export type FormProps = {
    initialData?: Obj
    onSubmit?: <D = Obj>(data: D) => void
    name: string
} & Omit<JSX.IntrinsicElements['form'], 'onSubmit'>

export type FieldHookProps<T = string> = {
    name: string
    rules?: FieldRule<T>[]
    mask?: FieldMask<T>
    initialValue?: T
    setValue?: (value: T, ref: InputRef) => void
    getValue?: (ref: InputRef) => T
    ref?: ForwardedRef<FieldRef<T>>
}

export type ScopeProps = {
    path: string
}
export type ScopeContextProps = Pick<ScopeProps, 'path'>

export type UseFormHookReturn<D, N> = {
    formRef: N extends string
        ? RefObject<FormRef<D>>
        : MutableRefObject<FormRef<D>>
}
