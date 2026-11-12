import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests/browser',
  timeout: 120000,
  workers: 1,
  use: {
    baseURL: process.env.QA_URL || 'http://127.0.0.1:4173',
    launchOptions: { args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] },
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure'
  },
  reporter: [['list'], ['json', { outputFile: 'qa/browser/results.json' }]],
  webServer: process.env.QA_URL ? undefined : { command:'npm run dev -- --port 4173',url:'http://127.0.0.1:4173',reuseExistingServer:!process.env.CI }
});
