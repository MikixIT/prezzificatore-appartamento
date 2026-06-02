import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const repositoryName = 'prezzificatore-appartamento';

export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? `/${repositoryName}/` : '/',
  plugins: [react()],
  css: {
    modules: {
      localsConvention: 'camelCase',
    },
  },
  test: {
    globals: false,
    environment: 'node',
  },
}));
