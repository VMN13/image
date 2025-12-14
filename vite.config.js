// vite.config.js
export default {
  build: {
    rollupOptions: {
      external: ['react-dom'],  // Or use esbuild options if applicable
    },
  },
};