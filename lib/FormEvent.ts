import { isArrayFulled } from './utils'

type Listener<T = unknown[]> = (...args: T[] | unknown[]) => void
type EventMap = {
    [key: string | number]: Listener[]
}

class FormEvent {
    private readonly events: EventMap = Object.create(null)

    protected on<K extends string>(event: K, listener: Listener) {
        if (!this.events[event]) {
            this.events[event] = []
        }
        this.events[event].push(listener)
    }

    protected off<K extends string>(event: K, listener: Listener) {
        if (this.events[event]) {
            this.events[event] = this.events[event].filter(l => l !== listener)
        }
    }

    public once<K extends string>(event: K, listener: Listener) {
        const onceListener: Listener = (...args) => {
            listener.apply(this, args)
            this.off(event, onceListener)
        }
        this.on(event, onceListener)
    }

    public listen<K extends string>(event: K, ...args: unknown[]) {
        if (isArrayFulled(this.events[event])) {
            console.log(typeof this.events[event], this.events[event])
            this.events[event].forEach(listener => listener.apply(this, args))
        }
    }
}

export const formEvents = new FormEvent()
