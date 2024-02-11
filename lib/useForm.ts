import { useEffect, useMemo, useRef } from 'react'
import { FormRef, UseFormHookReturn } from './types'
import { useSunnyProvider } from './SunnyProvider'

export function useForm<D>(name?: string): UseFormHookReturn<D, typeof name> {
    const formInitialRef = useRef<FormRef<D>>(null)
    const formMutatedRef = useRef<FormRef<D>>()

    const { getForm } = useSunnyProvider()

    const formRef = useMemo(
        () => (name ? formMutatedRef : formInitialRef),
        [name]
    )

    useEffect(() => {
        if (name) {
            formMutatedRef.current = getForm(name)
        }
    }, [name])

    return {
        formRef: formRef as unknown as UseFormHookReturn<
            D,
            typeof name
        >['formRef']
    }
}
