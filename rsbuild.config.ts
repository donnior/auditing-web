import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { tanstackRouter } from '@tanstack/router-plugin/rspack'

export default defineConfig({
  plugins: [pluginReact()],
  html: {
    template: './public/index.html',
  },
  tools: {
    rspack: {
      plugins: [
        tanstackRouter({
          target: 'react',
          autoCodeSplitting: true,
          routeToken: '_layout',
        }),
      ],
    },
  },
  server: {
    proxy: {
      '/xcauditing': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },

});
