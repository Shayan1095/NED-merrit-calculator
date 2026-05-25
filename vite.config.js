import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: "/NED_merit_calculator/",
  plugins: [react()],
})