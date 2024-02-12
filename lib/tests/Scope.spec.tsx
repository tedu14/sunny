import { render, screen } from '@testing-library/react'
import { Scope, useScope } from 'lib/Scope'
import { describe, expect, it } from 'vitest'

describe('Scope', () => {
    it('should provides the correct scope path without a parent', () => {
        const Component = () => {
            const scope = useScope()
            return <div>{scope.path}</div>
        }

        render(
            <Scope path="single">
                <Component />
            </Scope>
        )

        expect(screen.getByText('single')).toBeInTheDocument()
    })

    it('should provides the correct scope path to nested components', () => {
        const Component = () => {
            const scope = useScope()
            return <div>{scope.path}</div>
        }

        render(
            <Scope path="parent">
                <Scope path="child">
                    <Component />
                </Scope>
            </Scope>
        )

        expect(screen.getByText('parent.child')).toBeInTheDocument()
    })
})
