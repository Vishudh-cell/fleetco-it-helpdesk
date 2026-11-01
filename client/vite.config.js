import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/ask': 'http://localhost:5000',
      '/escalate': 'http://localhost:5000',
      '/health': 'http://localhost:5000',
      '/interactions': 'http://localhost:5000',
      '/escalations': 'http://localhost:5000',
      '/kb': 'http://localhost:5000'
    }
  }
});
