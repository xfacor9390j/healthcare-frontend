import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load .env files
  const env = loadEnv(mode, process.cwd(), '');

  // Use env in config (removes TS6133)
  console.log(`Building with API URL: ${env.VITE_USER_SERVICE_URL}`);

  return {
    plugins: [react()],
    server: {
      port: 5173,
      proxy: {
        '/api/v1/users': {
          target: 'http://localhost:3001',
          changeOrigin: true,
        },
        '/api/v1/appointments': {
          target: 'http://localhost:3002',
          changeOrigin: true,
        }
      }
    }
  };
});
