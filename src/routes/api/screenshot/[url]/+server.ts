import type { RequestHandler } from "./$types";
import { error } from "@sveltejs/kit";
import { renderImage } from "./image";
import { SCREENSHOT_SERVICE_KEY } from "$env/static/private";

function isFullUrl(url: string) {
	try {
		new URL(url);
		return true;
	} catch (e) {
		// invalid url OR local path
		return false;
	}
}

export const GET: RequestHandler = async ({ url, params, request, setHeaders }) => {
	// get url, size, aspectratio, zoom from query params
	console.log(`url: ${url}`);

	// only allow requests from this server

	// const apiKey = request.headers.get("authorization");
	// if (SCREENSHOT_SERVICE_KEY !== apiKey) {
	// 	throw error(401, {
	// 		message: "Not authenticated",
	// 	});
	// }
	// const _url = decodeURIComponent(params.url);
	const _url = decodeURIComponent(params.url);
	if (!_url) {
		throw error(400, "Missing url");
	}
	if (!isFullUrl(_url)) {
		throw error(400, "Invalid url");
	}
	const type = url.searchParams.get("type") === "jpeg" ? "jpeg" : ("png" as const);
	const waitUntil = (() => {
		const allowedValues = ["load", "domcontentloaded", "networkidle0", "networkidle2"] as const;
		const value = String(url.searchParams.get("waitUntil") || "load");
		const index = allowedValues.indexOf(value as any);
		return allowedValues[index] || "load";
	})();

	const result = await renderImage({
		url: _url,
		type,
		width: Number(url.searchParams.get("width")) || 1280,
		height: Number(url.searchParams.get("height")) || 720,
		deviceScaleFactor: Number(url.searchParams.get("deviceScaleFactor")) || 1,
		waitUntil,
		//TODO
		js: "",
		css: "",
	});

	setHeaders({
		"content-type": `image/${type}`,
		"Cache-Control": "public, max-age=31536000, s-maxage=31536000, immutable",
		// TODO: access control allow origin
	});

	if (!result) {
		throw error(500, "Failed to render image");
	}
	return new Response(result, {
		status: 200,
	});
};
