import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

// Fix __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  server: {
    host: "::",  // Binds to all network interfaces (IPv4 & IPv6)
    port: 5173,  // You can change this if needed
    strictPort: true, // Ensures it doesn't auto-switch ports
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000/',
        changeOrigin: true
      },
      '/storage': {
        target: 'http://127.0.0.1:8000/',
        changeOrigin: true
      }
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
