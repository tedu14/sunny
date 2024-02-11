import { useCallback } from 'react'
import { FieldRef, FormRef, KeyData, Obj } from './types'
import { useSunnyProvider } from './SunnyProvider'
import { formEvents } from './FormEvent'

export function useSunny() {
    const { getForm } = useSunnyProvider()

    const pipeForm = useCallback(
        function pipe<D>(formName: string, cb: (form: FormRef<D>) => void) {
            const formRef = getForm<D>(formName)

            if (formRef) {
                cb(formRef)
                return
            }
            formEvents.once(formName, (formEventRef: FormRef<D>) => {
                cb(formEventRef)
            })
        },
        [getForm]
    )

    const pipeField = useCallback(function pipe<D = Obj>(
        fieldFormName: `${string}.${KeyData<D> extends string ? KeyData<D> : ''}`,
        cb: <T>(field: FieldRef<T>) => void
    ) {
        formEvents.once(fieldFormName, (fieldRef: FieldRef) => {
            cb(fieldRef)
        })
    }, [])

    return {
        pipeForm,
        pipeField
    }
}
