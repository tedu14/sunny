import {
    FormEvent,
    PropsWithChildren,
    createContext,
    forwardRef,
    useCallback,
    useContext,
    useEffect,
    useImperativeHandle,
    useMemo,
    useRef
} from 'react'
import dot from 'dot-object'

import { FieldRef, FormContextProps, FormProps, FormRef } from './types'
import { isArrayFulled } from './utils'
import { useSunnyProvider } from './SunnyProvider'
import { formEvents } from './FormEvent'

const FormContext = createContext({} as FormContextProps)

export const FormProvider = forwardRef<FormRef, PropsWithChildren<FormProps>>(
    function UnForm(
        { children, initialData, onSubmit, name, ...formProps },
        ref
    ) {
        const fields = useRef(new Map<string, FieldRef>())

        const { registerForm, unregisterForm } = useSunnyProvider()

        const registerField: FormContextProps['registerField'] = useCallback(
            function register(fieldName, fieldRef) {
                fields.current.set(fieldName, fieldRef)
                formEvents.listen(`${name}.${fieldName}`, fieldRef)
            },
            [name]
        )

        const unregisterField: FormContextProps['unregisterField'] =
            useCallback(function unregister(fieldName) {
                fields.current.delete(fieldName)
            }, [])

        const getFields = useCallback(
            () => Array.from(fields.current.values()),
            []
        )

        const setData: FormRef['setData'] = useCallback(function setData(data) {
            const fieldsRef = getFields()
            fieldsRef.forEach(field => {
                const value = dot.pick(field.name, data)
                field.setValue(value)
            })
        }, [])

        const getData: FormRef['getData'] = useCallback(function getData(
            fieldsNames
        ) {
            const fieldsRef = getFields()

            if (isArrayFulled(fieldsNames)) {
                const data = fieldsNames!.reduce(
                    (acc, fieldName) => {
                        const field = fieldsRef.find(f => f.name === fieldName)
                        if (field) {
                            const value = field.getValue()
                            dot.str(fieldName as unknown as string, value, acc)
                        }
                        return acc
                    },
                    {} as Record<string, unknown>
                )
                return data
            }

            const data = fieldsRef.reduce(
                (acc, field) => {
                    const value = field.getValue()
                    dot.str(field.name, value, acc)
                    return acc
                },
                {} as Record<string, unknown>
            )
            return data
        }, [])

        const setErrors: FormRef['setErrors'] = useCallback(function setErrors(
            errors
        ) {
            const fieldsRef = getFields()
            fieldsRef.forEach(field => {
                const error = dot.pick(field.name, errors)
                field.setError(error)
            })
        }, [])

        const validate: FormRef['validate'] = useCallback(function validate(
            fieldsNames
        ) {
            const fieldsRef = getFields()

            if (isArrayFulled(fieldsNames)) {
                fieldsNames!.forEach(fieldName => {
                    const field = fieldsRef.find(f => f.name === fieldName)
                    if (field) {
                        field.validate()
                    }
                })
                return
            }

            fieldsRef.forEach(field => field.validate())
        }, [])

        const isValid: FormRef['isValid'] = useCallback(function isValid(
            fieldsNames
        ) {
            const fieldsRef = getFields()

            if (isArrayFulled(fieldsNames)) {
                return fieldsNames!.every(fieldName => {
                    const field = fieldsRef.find(f => f.name === fieldName)
                    return field?.isValid()
                })
            }

            return fieldsRef.every(field => field.isValid)
        }, [])

        const reset: FormRef['reset'] = useCallback(function reset() {
            const fieldsRef = getFields()
            fieldsRef.forEach(field => field.reset())
        }, [])

        const getErrors: FormRef['getErrors'] = useCallback(
            function getErrors() {
                const fieldsRef = getFields()
                const errors = fieldsRef.reduce(
                    (acc, field) => {
                        const error = field.getError()
                        if (error) {
                            dot.str(field.name, error, acc)
                        }
                        return acc
                    },
                    {} as Record<string, string>
                )
                return errors
            },
            []
        )

        const handleSubmit = useCallback(
            (ev?: FormEvent<HTMLFormElement>) => {
                ev?.preventDefault?.()
                const data = getData()
                onSubmit?.(data)
            },
            [onSubmit]
        )

        const formRef: FormRef = useMemo(
            () => ({
                setData,
                getData,
                setErrors,
                validate,
                isValid,
                reset,
                getErrors,
                submit() {
                    handleSubmit()
                }
            }),
            [
                setData,
                getData,
                setErrors,
                validate,
                isValid,
                reset,
                getErrors,
                handleSubmit
            ]
        )

        useEffect(() => {
            registerForm(name, formRef)
            return () => unregisterForm(name)
        }, [name, formRef, registerForm, unregisterForm])

        useImperativeHandle(ref, () => formRef, [formRef])

        return (
            <FormContext.Provider
                value={{
                    registerField,
                    unregisterField,
                    initialData: initialData || {}
                }}
            >
                <form onSubmit={handleSubmit} {...formProps}>
                    {children}
                </form>
            </FormContext.Provider>
        )
    }
)

export function useFormProvider() {
    return useContext(FormContext)
}
