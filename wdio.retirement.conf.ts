import { config as sharedConfig } from './wdio.shared.conf.js';

const isCi = Boolean(process.env.CI);

export const config: WebdriverIO.Config = {
    ...sharedConfig,
    specs: ['./test/webdriverio/specs/retirement-calculator.acceptance.spec.ts'],
    baseUrl: 'https://www.securian.com',
    maxInstances: 2,
    waitforTimeout: 10_000,
    specFileRetries: isCi ? 1 : 0,
    jasmineOpts: {
        ...sharedConfig.jasmineOpts,
        defaultTimeoutInterval: 45_000
    },
    capabilities: [
        {
            browserName: 'chrome',
            'goog:chromeOptions': {
                args: ['--headless=new', '--disable-gpu']
            }
        },
        {
            browserName: 'firefox',
            'moz:firefoxOptions': {
                args: ['-headless']
            }
        }
    ]
};
