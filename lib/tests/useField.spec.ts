import { act, renderHook } from '@testing-library/react-hooks'
import {
    FieldHookProps,
    FieldRef,
    FormContextProps,
    ScopeContextProps
} from 'lib/types'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useField } from '..'
import { useRef } from 'react'
import { render } from '@testing-library/react'

type MockObj<D> = {
    [K in keyof D]: D[K] extends (...args: unknown[]) => void
        ? ReturnType<typeof vi.fn>
        : D[K]
}

describe('useField', () => {
    const factory = (props?: Partial<Omit<FieldHookProps, 'name'>>) => {
        const { result } = renderHook(() =>
            useField({ name: 'test', ...props })
        )
        return { result }
    }

    const getRef = () => {
        const { result } = renderHook(() => useRef<FieldRef>(null))

        return {
            fieldRef: result.current
        }
    }

    beforeEach(() => {
        vi.mock('../FormProvider', () => ({
            useFormProvider: () =>
                ({
                    initialData: {},
                    registerField: vi.fn(),
                    unregisterField: vi.fn()
                }) as MockObj<FormContextProps>
        }))

        vi.mock('../Scope', () => ({
            useScope: () =>
                ({
                    path: ''
                }) as MockObj<ScopeContextProps>
        }))
    })

    afterEach(() => {
        vi.resetAllMocks()
    })

    it('should an initializes and returns default values', () => {
        const { result } = factory({
            initialValue: 'test'
        })

        expect(result.current.defaultValue).toBe('test')
    })
})
