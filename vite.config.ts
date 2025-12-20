import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const port = process.env.PORT ? Number(process.env.PORT) : 3000;

  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    preview: {
      port: port,
      host: '0.0.0.0',
      strictPort: true, // Fail if port is unavailable (important for Railway)
    },
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});
