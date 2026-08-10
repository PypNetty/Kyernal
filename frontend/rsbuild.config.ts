import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  plugins: [pluginReact()],
  server: {
    host: '0.0.0.0',
    port: 3000,
  },
  html: {
    title: 'KLIXY | Arena', // <-- C'est ici que la magie opère
  },
});
