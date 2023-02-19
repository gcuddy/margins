import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';


export async function getScreenshot(url: string) {
    let result: null | Buffer = null;
    let browser = null;
    console.time("scrape")

    try {
        const options = process.env.AWS_REGION
            ? {
                args: chromium.args,
                executablePath: await chromium.executablePath(),
                headless: chromium.headless,
            }
            : {
                args: [],
                executablePath:
                    process.platform === 'win32'
                        ? 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
                        : process.platform === 'linux'
                            ? '/usr/bin/google-chrome'
                            : '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
            };
        browser = await puppeteer.launch(options);
        const page = await browser.newPage();
        await page.setViewport({ width: 2000, height: 1000 });
        await page.goto(url, { waitUntil: 'networkidle0' });
        result = await page.screenshot({ type: 'png' });
        //     const options = {
        //         args: chromium.args,
        //         defaultViewport: chromium.defaultViewport,
        //         headless: chromium.headless,
        //         executablePath: await chromium.executablePath(),
        //         ignoreHTTPSErrors: true
        //     };
        //     const extra = addExtra(puppeteer);
        //     const stealth = StealthPlugin();
        //     stealth.enabledEvasions.delete('user-agent-override');
        //     extra.use(stealth);
        //     const adblocker = AdblockerPlugin();
        //     extra.use(adblocker);

        //     browser = await extra.launch(options);
        //     const page = await browser.newPage();
        //     await page.setViewport({ width: 1920, height: 1080 });
        //     await page.goto(url, { waitUntil: 'networkidle0'});
        //   result = await page.screenshot({type: 'png'})
    } catch (error) {
        console.error(error);
        return result;
    } finally {
        if (browser !== null) {
            await browser.close();
        }
    }
    console.timeEnd('scrape');
    return result;
}
