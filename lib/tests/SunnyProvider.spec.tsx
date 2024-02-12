import { PropsWithChildren } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react-hooks'
import { render, screen } from '@testing-library/react'

import { SunnyProvider, useSunnyProvider } from 'lib/SunnyProvider'
import { FormRef } from '..'

describe('SunnyProvider', () => {
    let formRef: FormRef

    const factory = () => {
        const wrapper = ({ children }: PropsWithChildren) => (
            <SunnyProvider>{children}</SunnyProvider>
        )
        const { result } = renderHook(() => useSunnyProvider(), { wrapper })
        return { result }
    }

    beforeEach(() => {
        formRef = vi.fn() as unknown as FormRef
    })

    it('should allows a form to be registered and retrieved', () => {
        const { result } = factory()

        act(() => {
            result.current.registerForm('testForm', formRef)
        })

        expect(result.current.getForm('testForm')).toBe(formRef)
    })

    it('should allows a form to be unregistered', () => {
        const { result } = factory()

        act(() => {
            result.current.registerForm('testForm', formRef)
        })

        act(() => {
            result.current.unregisterForm('testForm')
        })

        expect(result.current.getForm('testForm')).toBeUndefined()
    })

    it('should provide the context to the consumer', () => {
        const Component = () => {
            const context = useSunnyProvider()
            return <div>{context && 'provided'}</div>
        }
        render(
            <SunnyProvider>
                <Component />
            </SunnyProvider>
        )

        expect(screen.getByText('provided')).toBeInTheDocument()
    })
})
