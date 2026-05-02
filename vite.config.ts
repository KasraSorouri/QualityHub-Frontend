import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  resolve: {
    alias: [
      {
        find: /^@mui\/icons-material$/,
        replacement: '@mui/icons-material/esm/index.js',
      },
      {
        find: /^@mui\/icons-material\/(.*)$/,
        replacement: '@mui/icons-material/esm/$1',
      },
    ],
  },
  server: {
    host: true,
    port: 3000,
  },

});
