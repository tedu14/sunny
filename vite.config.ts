import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    build: {
        lib: {
            entry: 'lib/index.ts',
            name: 'Sunny',
            formats: ['es', 'umd']
        },
        rollupOptions: {
            external: ['react'],
            output: {
                globals: {
                    react: 'React'
                }
            }
        }
    }
})
