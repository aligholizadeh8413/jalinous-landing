import { defineConfig } from 'vite';

export default defineConfig({
  base: process.env.GITHUB_ACTIONS ? `/${(process.env.GITHUB_REPOSITORY || 'aligholizadeh8413/Jalinous').split('/')[1]}/` : './',
  server: { allowedHosts: true },
  build: {
    target: 'es2022',
    rollupOptions: { output: { manualChunks: { three: ['three'], motion: ['gsap', 'gsap/ScrollTrigger'] } } }
  }
});
