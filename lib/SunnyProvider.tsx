import {
    PropsWithChildren,
    createContext,
    useCallback,
    useContext,
    useRef
} from 'react'
import { FormRef, Obj, SunnyContextProps } from './types'
import { formEvents } from './FormEvent'

const SunnyContext = createContext({} as SunnyContextProps)

export function SunnyProvider({ children }: PropsWithChildren) {
    const forms = useRef(new Map<string, FormRef<Obj>>())

    const registerForm: SunnyContextProps['registerForm'] = useCallback(
        function register(formName, formRef) {
            forms.current.set(formName, formRef as unknown as FormRef<Obj>)
            formEvents.listen(formName, formRef)
        },
        []
    )

    const unregisterForm: SunnyContextProps['unregisterForm'] = useCallback(
        function unregister(formName) {
            forms.current.delete(formName)
        },
        []
    )

    const getForm: SunnyContextProps['getForm'] = useCallback(function getForm(
        formName
    ) {
        return forms.current.get(formName)
    }, [])

    return (
        <SunnyContext.Provider
            value={{ registerForm, unregisterForm, getForm }}
        >
            {children}
        </SunnyContext.Provider>
    )
}

export function useSunnyProvider() {
    return useContext(SunnyContext)
}
