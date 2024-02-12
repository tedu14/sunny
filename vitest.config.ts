/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

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
        include: ['lib/tests/*.{test,spec}.{ts,tsx}']
    },
    resolve: {
        alias: {
            lib: path.resolve(__dirname, 'lib')
        }
    }
})
