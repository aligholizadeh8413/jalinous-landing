import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests/browser',
  timeout: 420000,
  workers: 1,
  use: {
    baseURL: process.env.QA_URL || 'http://127.0.0.1:4173/jalinous-landing/',
    launchOptions: { args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] },
    screenshot: 'only-on-failure',
    trace: 'off'
  },
  reporter: [['list'], ['json', { outputFile: 'qa/browser/results.json' }]],
  webServer: process.env.QA_URL ? undefined : { command:'npm run dev -- --port 4173',url:'http://127.0.0.1:4173/jalinous-landing/',reuseExistingServer:!process.env.CI }
});
