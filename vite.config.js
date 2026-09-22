import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// Served from web.mit.edu/anish559/www/ by default; the GitHub Pages
// workflow builds with BASE_PATH=/ for anish-1101-lab.github.io.
export default defineConfig({
  base: process.env.BASE_PATH || "/anish559/www/",
  plugins: [react()],
})
