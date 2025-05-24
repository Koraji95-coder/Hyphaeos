import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // Enables "@/services/api"
    },
  },
  //server: {
  //  proxy: {
  //    '/api': {
  //      target: 'http://localhost:5137', // 👈 backend dev server port
  //      changeOrigin: true,
  //      secure: false,
  //    }
  //  }
  //}
});