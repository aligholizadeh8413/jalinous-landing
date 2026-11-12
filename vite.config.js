import { defineConfig } from 'vite';

export default defineConfig({
  base: process.env.GITHUB_ACTIONS ? '/jalinous-landing/' : './',
  server: { allowedHosts: true },
  build: {
    target: 'es2022',
    rollupOptions: { output: { manualChunks: { three: ['three'], motion: ['gsap', 'gsap/ScrollTrigger'] } } }
  }
});
