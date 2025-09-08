import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  root: '.', // Root directory for the project
  base: './', // Base URL for assets (important for deployment)
  
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false, // Set to true if you want source maps in production
    
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        login: resolve(__dirname, 'pages/login.html'),
        signup: resolve(__dirname, 'pages/signup.html'),
        feature: resolve(__dirname, 'pages/feature.html')
      }
    }
  },
  
  server: {
    port: 3000,
    open: true, // Automatically open the browser
    host: true  // Allow access from network
  },
  
  // Handle assets and static files
  publicDir: 'public',
  
  // Optimize dependencies
  optimizeDeps: {
    include: []
  }
})