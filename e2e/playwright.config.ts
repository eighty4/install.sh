import {defineConfig, devices} from '@playwright/test'

// https://playwright.dev/docs/test-configuration

export default defineConfig({
    testDir: './tests',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: 'html',
    use: {
        // baseURL: 'http://127.0.0.1:3000',
        trace: 'on-first-retry',
    },
    projects: [
        {
            name: 'chromium',
            use: {...devices['Desktop Chrome']},
        },

        {
            name: 'firefox',
            use: {...devices['Desktop Firefox']},
        },

        {
            name: 'webkit',
            use: {...devices['Desktop Safari']},
        },
    ],

    webServer: {
      command: './start_app.sh',
      url: 'http://localhost:5711',
      reuseExistingServer: !process.env.CI,
    },
})
