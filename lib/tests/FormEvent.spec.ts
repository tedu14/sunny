import { formEvents } from 'lib/FormEvent'
import { beforeEach, describe, expect, it, vi } from 'vitest'

describe('FormEvent', () => {
    let callback: ReturnType<typeof vi.fn>

    beforeEach(() => {
        callback = vi.fn()
    })

    it('should call a listener when an event is emitted', () => {
        formEvents.once('testEvent', callback)
        formEvents.listen('testEvent', 'test')

        expect(callback).toHaveBeenCalledTimes(1)
        expect(callback).toHaveBeenCalledWith('test')
    })
})
