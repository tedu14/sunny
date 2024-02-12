/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './test-setup.ts',
        coverage: {
            provider: 'v8',
            include: ['lib/*.{ts,tsx}'],
            reporter: ['text', 'text-summary', 'lcov', 'html']
        },
        include: ['lib/*.{test,spec}.{ts,tsx}']
    }
})
