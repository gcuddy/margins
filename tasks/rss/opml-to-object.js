import fs from "fs";
//xml parser
import { XMLParser } from "fast-xml-parser";

// accept cli input opml file
const opmlFile = process.argv[2];

// read opml file
const rawOpml = fs.readFileSync(opmlFile, "utf8");

// parse opml file
const options = {
	ignoreAttributes: false,
	attributeNamePrefix: "@_",
};
const parser = new XMLParser(options);
const { opml } = parser.parse(rawOpml);

// extract rss feeds from opml file
// const rssFeeds = opml.opml.body.outline.outline.map((outline) => outline.xmlUrl);

// create object of rss feeds

console.log(Object.fromEntries(opml.body.outline.map((outilne) => [outilne["@_text"], outilne["@_xmlUrl"]])));

// console.log(opml.body.outline);
