import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import process from 'node:process';
import fs from 'fs';
import path from 'path';
import {BASE_URL} from "./src/constants"

function generateDocsIndex() {
  try {
    const docsDir = path.resolve(process.cwd(), 'docs');
    if (!fs.existsSync(docsDir)) {
      return;
    }

    const files = fs.readdirSync(docsDir)
      .filter((f) => f.toLowerCase().endsWith('.md') || f.toLowerCase().endsWith('.csv'));

    const index = files.map((filename) => {
      if (filename.toLowerCase().endsWith('.csv')) {
        return { filename, title: filename.replace(/\.csv$/i, '') };
      }
      
      const base = filename.replace(/\.md$/i, '');
      // Remove trailing space + hash if present
      const title = base.replace(/\s[0-9a-fA-F]+$/i, '');
      return { filename, title };
    });

    fs.writeFileSync(
      path.join(docsDir, 'index.json'),
      JSON.stringify(index, null, 2),
      'utf-8'
    );

    // Copy docs to dist
    const distDocsDir = path.resolve(process.cwd(), 'dist', 'docs');
    if (!fs.existsSync(distDocsDir)) {
      fs.mkdirSync(distDocsDir, { recursive: true });
    }
    fs.cpSync(path.resolve(process.cwd(), 'docs'), distDocsDir, { recursive: true });
  } catch (e) {
    console.warn('Failed to generate docs index:', e);
  }
}

export default defineConfig({
  base: BASE_URL,
  plugins: [
    {
      name: 'docs-index-generator',
      apply: 'serve',
      configureServer(server) {
        generateDocsIndex();
        const docsDir = path.resolve(process.cwd(), 'docs');
        if (fs.existsSync(docsDir)) {
          const watcher = fs.watch(docsDir, { recursive: false }, () => {
            generateDocsIndex();
          });
          server.httpServer?.once('close', () => watcher.close());
        }
      },
    },
    {
      name: 'docs-index-generator-build',
      apply: 'build',
      buildStart() {
        generateDocsIndex();
      },
    },
    react(),
  ],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          csv: ['papaparse'],
          icons: ['lucide-react']
        }
      }
    },
    chunkSizeWarningLimit: 1000,
    emptyOutDir: true
  },
  server: {
    port: 3000,
    host: true,
    cors: true
  },
  preview: {
    port: 4173,
    host: true
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
    'process.env.CSV_URL': JSON.stringify(process.env.CSV_URL || ''),
    'process.env.REFRESH_INTERVAL': JSON.stringify(process.env.REFRESH_INTERVAL || '300000')
  }
});