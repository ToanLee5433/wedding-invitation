import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', 'VITE_');
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [react()],
    // API keys are kept server-side only via VITE_ prefix env vars
    // Never expose GEMINI_API_KEY to client bundle
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    },
    // Cấu hình cho SPA routing - tất cả routes sẽ trả về index.html
    appType: 'spa',

    // Build optimization for faster loading
    build: {
      target: 'esnext',
      minify: 'esbuild', // Use esbuild (built-in, no extra dependency)
      cssMinify: true,
      sourcemap: false,
      // Code splitting for better caching
      rollupOptions: {
        output: {
          manualChunks: {
            // Core React bundle
            vendor: ['react', 'react-dom'],
            // Animation library (heavy)
            motion: ['framer-motion'],
            // Database client
            supabase: ['@supabase/supabase-js'],
            // Icons library
            icons: ['lucide-react'],
          },
          // Optimize chunk names
          chunkFileNames: 'assets/[name]-[hash].js',
          entryFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash].[ext]',
        }
      },
      // Reduce warnings
      chunkSizeWarningLimit: 1000,
      // Additional performance optimizations
      reportCompressedSize: false, // Faster builds
      cssCodeSplit: true, // Split CSS for better caching
    },

    // Optimize dependencies
    optimizeDeps: {
      include: ['react', 'react-dom', 'framer-motion', 'lucide-react'],
    },
  };
});
