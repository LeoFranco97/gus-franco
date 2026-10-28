import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Relative base so the same build works on GitHub Pages project sites
// (user.github.io/repo/), a custom domain, or Netlify/Vercel.
export default defineConfig({
  base: './',
  plugins: [react()],
})
