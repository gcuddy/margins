import chrome from "chrome-aws-lambda";
import pkg from 'puppeteer-core';
const { launch } = pkg;
// import typ{ launch, Page } from "puppeteer-core";
type Page = typeof pkg["Page"]

interface ScreenshotOptions {
    url: string;
    width: number;
    height: number;
    css: string;
    js: string;
    deviceScaleFactor: number;
    type: "jpeg" | "png";
    waitUntil: "load" | "domcontentloaded" | "networkidle0" | "networkidle2";
}

let _page: Page | null;

async function getPage() {
    let page = _page;
    if (!page) {
        const chromePathOnLambda = await chrome.executablePath;
        console.log({ chromePathOnLambda });
        const fonts = [
            "https://cdn.jsdelivr.net/gh/googlei18n/noto-emoji@948b1a7f1ed4ec7e27930ad8e027a740db3fe25e/fonts/NotoColorEmoji.ttf",
            "https://cdn.jsdelivr.net/gh/googlefonts/Arimo@dcb3e77c8800e3a35974ce45e23e1a983e1682d4/fonts/ttf/Arimo-Regular.ttf",
            "https://cdn.jsdelivr.net/gh/googlefonts/Arimo@dcb3e77c8800e3a35974ce45e23e1a983e1682d4/fonts/ttf/Arimo-Bold.ttf",
            "https://cdn.jsdelivr.net/gh/googlefonts/Arimo@dcb3e77c8800e3a35974ce45e23e1a983e1682d4/fonts/ttf/Arimo-Italic.ttf",
            "https://cdn.jsdelivr.net/gh/googlefonts/Arimo@dcb3e77c8800e3a35974ce45e23e1a983e1682d4/fonts/ttf/Arimo-BoldItalic.ttf",
            "https://cdn.jsdelivr.net/gh/googlefonts/noto-fonts@8194fd72cbc46bb88e8246b68e42b96cbef0c700/hinted/ttf/NotoSans/NotoSans-Regular.ttf",
            "https://cdn.jsdelivr.net/gh/googlefonts/noto-cjk@165c01b46ea533872e002e0785ff17e44f6d97d8/Sans/OTC/NotoSansCJK-Regular.ttc",
            "https://cdn.jsdelivr.net/gh/googlefonts/noto-fonts@8194fd72cbc46bb88e8246b68e42b96cbef0c700/hinted/ttf/NotoSansThai/NotoSansThai-Regular.ttf",
        ];
        await Promise.all(
            fonts.map(async (f) =>
                chrome.font(f)?.catch((e) => {
                    console.error("Unable to fetch font %s", f, e);
                })
            )
        );
        // Disabled because it is not compatible with the latest version…
        // await patchFontConfig()
        const browser = await launch({
            args: [...chrome.args, "--font-render-hinting=none"],
            executablePath: chromePathOnLambda || "/opt/homebrew/bin/chromium",
            headless: true,
        });
        console.log({ browser });
        page = await browser.newPage();
        _page = page;
    }
    return page;
}

export async function renderImage({
    url,
    type,
    height,
    width,
    css,
    js,
    deviceScaleFactor,
    waitUntil,
}: ScreenshotOptions) {
    const page = await getPage();
    await page.setViewport({ width, height, deviceScaleFactor });
    await page.goto(url, { waitUntil, timeout: 6400 }).catch((e) => console.error(e));
    if (js) {
        await page
            .evaluate(async (code) => {
                try {
                    await eval(code);
                } catch (e) {
                    const errorBox = document.createElement("personal-puppeteer-error-box");
                    errorBox.setAttribute(
                        "style",
                        `position: fixed; bottom: 0; right: 0; background: red; color: white; z-index: 999999999; padding: 10px;`
                    );
                    errorBox.textContent = String(e);
                    document.body.appendChild(errorBox);
                }
            }, js)
            .catch(console.error);
    }
    // See: https://github.com/puppeteer/puppeteer/issues/511
    await page.evaluate(async (css) => {
        const style = document.createElement("style");
        style.textContent = `
        *,
        *::after,
        *::before {
          transition-delay: 0s !important;
          transition-duration: 0s !important;
          animation-delay: -0.0001s !important;
          animation-duration: 0s !important;
          animation-play-state: paused !important;
          caret-color: transparent !important;
          color-adjust: exact !important;
        }
        ${css}
      `;
        document.head.appendChild(style);
        document.documentElement.dataset.screenshotMode = "1";
        await new Promise(requestAnimationFrame);
        await new Promise(requestAnimationFrame);
    }, css || "");
    const file = await page.screenshot({ type });
    return file;
}
