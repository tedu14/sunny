import { PropsWithChildren, createContext, useContext } from 'react'
import { ScopeContextProps, ScopeProps } from './types'

const ScopeContext = createContext({} as ScopeContextProps)

export function Scope({ path, children }: PropsWithChildren<ScopeProps>) {
    const context = useContext(ScopeContext)

    return (
        <ScopeContext.Provider
            value={{
                path: context?.path ? `${context.path}.${path}` : path
            }}
        >
            {children}
        </ScopeContext.Provider>
    )
}

export function useScope() {
    return useContext(ScopeContext)
}
