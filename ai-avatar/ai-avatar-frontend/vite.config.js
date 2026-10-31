import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
  root: __dirname,
  plugins: [
    react(),
    {
      name: 'rewrite-root',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url === '/' || req.url === '') {
            req.url = '/index.html';
          }
          next();
        });
      },
    },
  ],
  server: {
    port: 5173,
    host: true,
  },
});
