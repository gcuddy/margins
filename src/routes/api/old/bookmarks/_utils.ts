// import cheerio from 'cheerio';
export async function fetchHtml(url: string) {
	const response = await fetch(url);
	const html = await response.text();
	return html;
}
// export async function getTitle(html: string) {
// 	const $ = cheerio.load(html);
// 	const title = $('title').text();
// 	return title;
// }
