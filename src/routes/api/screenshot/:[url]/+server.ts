// TODO: this isn't working right now
import type { RequestHandler } from './$types';
// import chromium from '@sparticuz/chromium';
// import puppeteer from 'puppeteer-core';
import { error } from '@sveltejs/kit';

function isFullUrl(url) {
	try {
		new URL(url);
		return true;
	} catch (e) {
		// invalid url OR local path
		return false;
	}
}

async function screenshot(url, { format, viewport, dpr = 1, withJs = true, wait, timeout = 8500 }) {
	// Must be between 3000 and 8500
	timeout = Math.min(Math.max(timeout, 3000), 8500);

	// const browser = await puppeteer.launch({
	// 	executablePath: await chromium.executablePath,
	// 	args: chromium.args,
	// 	defaultViewport: {
	// 		width: viewport[0],
	// 		height: viewport[1],
	// 		deviceScaleFactor: 1,
	// 	},
	// 	headless: chromium.headless,
	// });
	const browser = await puppeteer.launch({
		args: chromium.args,
		defaultViewport: chromium.defaultViewport,
		executablePath: await chromium.executablePath,
		headless: chromium.headless,
		ignoreHTTPSErrors: true,
	});

	const page = await browser.newPage();

	if (!withJs) {
		page.setJavaScriptEnabled(false);
	}

	const response = await Promise.race([
		page.goto(url, {
			waitUntil: wait || ['load'],
			timeout,
		}),
		new Promise((resolve) => {
			setTimeout(() => {
				resolve(false); // false is expected below
			}, timeout - 1500); // we need time to execute the window.stop before the top level timeout hits
		}),
	]);

	if (response === false) {
		// timed out, resolved false
		await page.evaluate(() => window.stop());
	}

	// let statusCode = response.status();
	// TODO :handle 4xx/5xx status codes better

	const options: puppeteer.ScreenshotOptions = {
		type: format,
		encoding: 'base64',
		fullPage: false,
		captureBeyondViewport: false,
		clip: {
			x: 0,
			y: 0,
			width: viewport[0],
			height: viewport[1],
		},
	};

	if (format === 'jpeg') {
		options.quality = 80;
	}

	const output = await page.screenshot(options);

	await browser.close();

	return output;
}

export const GET: RequestHandler = async ({ url, params }) => {
	// get url, size, aspectratio, zoom from query params
	console.log(`url: ${url}`);
	// const _url = decodeURIComponent(params.url);
	const _url = decodeURIComponent(params.url);
	if (!_url) {
		throw error(400, 'Missing url');
	}
	const size = url.searchParams.get('size') || 'small';
	const aspectratio = url.searchParams.get('aspectRatio') || '1:1';
	const zoom = url.searchParams.get('zoom') || 'standard';
	let wait = ['load'];
	if (Number(url.searchParams.get('wait')) === 0) {
		wait = ['domcontentloaded'];
	} else if (Number(url.searchParams.get('wait')) === 1) {
		wait = ['load'];
	} else if (Number(url.searchParams.get('wait')) === 2) {
		wait = ['load', 'networkidle0'];
	} else if (Number(url.searchParams.get('wait')) === 3) {
		wait = ['load', 'networkidle2'];
	}

	let timeout;
	if (url.searchParams.get('timeout')) {
		timeout = Number(url.searchParams.get('timeout')) * 1000;
	}

	const format = 'jpeg';

	let dpr = 1;
	if (zoom === 'bigger') {
		dpr = 1.4;
	} else if (zoom === 'smaller') {
		dpr = 0.71428571;
	} else if (zoom === 'standard') {
		dpr = 1;
	}

	let viewport: [number, number] = [375, 375];
	if (size === 'small') {
		if (aspectratio === '1:1') {
			viewport = [375, 375];
		} else if (aspectratio === '9:16') {
			viewport = [375, 667];
		}
	} else if (size === 'medium') {
		if (aspectratio === '1:1') {
			viewport = [650, 650];
		} else if (aspectratio === '9:16') {
			viewport = [650, 1156];
		}
	} else if (size === 'large') {
		// 0.5625 aspect ratio not supported on large
		if (aspectratio === '1:1') {
			viewport = [1024, 1024];
		}
	} else if (size === 'opengraph') {
		// ignores aspectratio
		// always maintain a 1200×630 output image
		if (zoom === 'bigger') {
			// dpr = 1.4
			viewport = [857, 450];
		} else if (zoom === 'smaller') {
			// dpr = 0.714
			viewport = [1680, 882];
		} else {
			viewport = [1200, 630];
		}
	}
	try {
		if (!isFullUrl(_url)) {
			throw error(400, 'Invalid url');
		}
		if (!viewport || viewport.length !== 2) {
			throw error(400, 'Incorrect API usage.');
		}
		const output = await screenshot(url, {
			format,
			viewport,
			dpr,
			wait,
			timeout,
		});
		console.log(url, format, { viewport }, { size }, { dpr }, { aspectratio });
		return new Response(output, {
			status: 200,
			headers: {
				'content-type': `image/${format}`,
			},
		});
		// return {
		// 	statusCode: 200,
		// 	headers: {
		// 		'content-type': `image/${format}`,
		// 	},
		// 	body: output,
		// 	isBase64Encoded: true,
		// };
	} catch (e) {
		console.error(e);
		throw error(500, 'Internal Server Error');
	}
};
