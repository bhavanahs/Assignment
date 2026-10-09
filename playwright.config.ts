import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: './test/playwright/specs',
    forbidOnly: Boolean(process.env.CI),
    retries: process.env.CI ? 1 : 0,
    workers: process.env.CI ? 2 : undefined,
    timeout: 45_000,
    expect: {
        timeout: 10_000
    },
    reporter: 'list',
    use: {
        baseURL: 'https://www.securian.com',
        headless: true,
        actionTimeout: 10_000,
        navigationTimeout: 30_000,
        screenshot: 'only-on-failure',
        trace: 'retain-on-failure'
    },
    projects: [
        {
            name: 'chrome',
            use: {
                browserName: 'chromium',
                channel: 'chrome'
            }
        },
        {
            name: 'firefox',
            use: {
                browserName: 'firefox'
            }
        }
    ]
});