import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    specPattern: 'tests/e2e/**/*.spec.js',
    supportFile: false
  },
})
