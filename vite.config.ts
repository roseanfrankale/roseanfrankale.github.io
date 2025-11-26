import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // IMPORTANT: Change 'repo-name' to your actual GitHub repository name
  base: '/repo-name/', 
  define: {
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY)
  }
})
