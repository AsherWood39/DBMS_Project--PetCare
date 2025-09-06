import { defineConfig } from 'vite'

export default defineConfig({
  root: '.', // or change to 'src' if your index.html is in a subfolder
  server: {
    port: 3000, // optional: change port if needed
  },
})