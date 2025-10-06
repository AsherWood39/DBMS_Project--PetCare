import { defineConfig } from 'vite';
import { resolve } from 'path';
import fs from 'fs';

function collectHtmlEntries() {
  const dirs = ['.', 'pages'];
  const entries = {};
  for (const dir of dirs) {
    const full = resolve(__dirname, dir);
    if (!fs.existsSync(full)) continue;
    for (const f of fs.readdirSync(full)) {
      if (f.endsWith('.html')) {
        entries[f.replace('.html', '')] = resolve(full, f);
      }
    }
  }
  return entries;
}

export default defineConfig({
  base: '/',          // <— simpler for Vercel root deployment
  publicDir: 'public',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: { input: collectHtmlEntries() }
  },
  server: {
    // Configure the dev server to handle 404s
    historyApiFallback: {
      rewrites: [
        { from: /^\/404$/, to: '/pages/404.html' },
        { from: /./, to: '/pages/404.html' } // Catch all 404s
      ]
    }
  }
});