import { defineConfig } from 'vite';

export default defineConfig({
  root: './source',
  publicDir: '../public',
  build: {
    outDir: '../output',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]',
      },
    },
  },
});
