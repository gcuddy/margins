// simple rss fetcher looks something like this:

import { XMLParser } from "fast-xml-parser";

const parser = new XMLParser();

import fetch from "node-fetch";
import { z } from "zod";

const parseXML = (xml: string) => parser.parse(xml);

const fetchText = async (...args: Parameters<typeof fetch>) => {
	let f = await fetch(...args);
	return f.text();
};

const jsonFeedSchema = z.object({
	version: z.string(),
	title: z.string(),
	items: z.array(
		z.object({
			id: z.string(),
			url: z.string().optional(),
			title: z.string(),
			date_published: z.string().optional(),
		})
	),
});

const rssFeedSchema = z.object({
	rss: z.object({
		channel: z.object({
			item: z.array(
				z.object({
					title: z.string(),
					link: z.string(),
					pubDate: z.string(),
				})
			),
		}),
	}),
});

const atomFeedSchema = z.object({
	feed: z.object({
		entry: z.array(
			z.object({
				// title: z.string(),
				// link: z.object({
				// 	href: z.string(),
				// }),
				updated: z.string(),
			})
		),
	}),
});

// take in rss, atom, or json feed and return a list of items after the lastRunAt date
const parseRSS = (text: string, lastRunAt: Date) => {
	// check if it's json feed
	if (text.startsWith("{")) {
		const { items } = jsonFeedSchema.passthrough().parse(JSON.parse(text));
		return items.filter(
			({ date_published }) => lastRunAt && date_published && new Date(date_published) > lastRunAt
		);
	}
	// check if it's rss
	if (text.startsWith("<rss")) {
		const { rss } = rssFeedSchema.passthrough().parse(parseXML(text));
		return rss.channel.item.filter(({ pubDate }) => lastRunAt && new Date(pubDate) > new Date(lastRunAt));
	}
	// check if it's atom
	if (text.startsWith("<feed")) {
		const { feed } = atomFeedSchema.passthrough().parse(parseXML(text));
		return feed.entry.filter(({ updated }) => lastRunAt && new Date(updated) > new Date(lastRunAt));
	}
};

const fetchRSS = (url: string) =>
	fetchText(url)
		.then(parseXML)
		.then(({ rss }) => rss);

const newRSSItems = ({ url, lastRunAt }: { url: string; lastRunAt: Date }) => {
	fetchRSS(url).then(({ channel: { item } }) =>
		(
			item as {
				title: string;
				link: string;
				pubDate: string;
			}[]
		).filter(({ pubDate }) => lastRunAt && new Date(pubDate) > new Date(lastRunAt))
	);
};
const rssFeeds = {
	"AI Weirdness": "https://www.aiweirdness.com/rss/",
	"Go Make Things": "https://gomakethings.com/feed/index.xml",
	"Zell Liew": "https://zellwk.com/feed.xml",
	All: "https://www.thecity.nyc/rss/index.xml",
	"overview for Seventeenthirtythree": "https://www.reddit.com/user/Seventeenthirtythree.rss",
	"Obsidian Forum - Latest posts by @kepano": "https://forum.obsidian.md/u/kepano/activity.rss",
	"Marc Brooker's Blog": "https://brooker.co.za/blog/rss.xml",
	"the webb blog": "https://blog.webb.page/feed/atom",
	"Stephan Ango": "http://stephanango.com/feed/index.xml",
	Matt: "https://write.as/matt/feed/",
	"Left Align": "https://leftalign.substack.com/feed",
	"The Contender": "https://thecontender.co/blog?format=rss",
	SupChina: "https://supchina.com/feed/",
	"Hillel Wayne": "https://www.hillelwayne.com/index.xml",
	"The Curtain": "https://guscuddy.substack.com/feed",
	"IDEAS IN FOOD": "https://blog.ideasinfood.com/ideas_in_food/atom.xml",
	"devonzuegel.com": "https://devonzuegel.com/feed.xml",
	"Nate Meyvis": "https://www.natemeyvis.com/writing/rss/",
	swissmiss: "http://feeds2.feedburner.com/Swissmiss",
	"kottke.org": "http://feeds.kottke.org/main",
	"52 Insights": "https://www.52-insights.com/feed/",
	"Grow by Ginkgo": "https://www.growbyginkgo.com/feed/",
	"Emergence Magazine": "https://emergencemagazine.org/feed/",
	"John Vervaeke": "https://www.youtube.com/feeds/videos.xml?channel_id=UCpqDUjTsof-kTNpnyWper_Q",
	"color files": "https://www.are.na/kat-su/color-files/feed/rss",
	"Gus Cuddy's Blog": "https://www.guscuddy.com/feed.xml",
	"Streetsblog New York City": "https://nyc.streetsblog.org/feed/",
	"Weiwei Hsu": "https://weiweihsu.com/feed.xml",
	"Computer :(": "https://whatthefuck.computer/rss.xml",
	"5 am girlfriend": "https://neocities.org/site/5amgirlfriend.rss",
	"ocean waves (snufkin)": "https://neocities.org/site/ocean-waves.rss",
	"big team farms (sarah mock)": "https://sarahmock.substack.com/feed",
	"tiny subversions (darius kazemi)": "http://tinysubversions.com/feed.xml",
	"the digital diarist": "https://thedigitaldiarist.ca/feed.xml",
	"niceware (woomy from elekk.xyz)": "https://neocities.org/site/niceware.rss",
	"rnd - devurandom": "https://rnd.neocities.org/blog/main.rss",
	"shan't we tell the vicar? (mara wilson)": "https://mara.substack.com/feed.xml",
	"Write Freely": "https://blog.writefreely.org/feed/",
	"the wondersmith": "https://www.thewondersmith.com/blog?format=rss",
	"c e p h e u s": "https://neocities.org/site/cepheus.rss",
	Rivendell: "https://neocities.org/site/rivendell.rss",
	"Backchannel Latest": "https://www.wired.com/feed/category/backchannel/latest/rss",
	"links I would gchat you if we were friends": "https://linksiwouldgchatyou.substack.com/feed",
	"Serious Eats": "https://feeds.feedburner.com/seriouseatsfeaturesvideos",
	"pketh.org": "https://pketh.org/feed.xml",
	"Julia Evans": "https://jvns.ca/atom.xml",
	"ton - obsidian": "https://forum.obsidian.md/u/ton/activity.rss",
	"outlier releases": "https://www.reddit.com/user/hanseano.rss",
	"ryanjamurphy - mpu": "https://talk.macpowerusers.com/u/ryanjamurphy/activity.rss",
	"abe - outlier reddit": "https://www.reddit.com/user/abe1x.rss",
	"Waxy.org": "https://waxy.org/feed/",
	"Release notes from kit": "https://github.com/sveltejs/kit/releases.atom",
	"Robin Rendle": "https://www.robinrendle.com/feed/notes.xml",
	"Nadia Eghbal": "https://nadiaeghbal.com/feed.xml",
	JJJJound: "http://www.jrsrules.com/feed/",
	"ryanjamurphy - devonthink": "https://discourse.devontechnologies.com/u/ryanjamurphy/activity.rss",
	"Geoff Graham": "https://geoffgraham.me/feed/",
	"Simon Collison | Articles & Stream": "https://colly.com/articles/feed",
	"Brad Frost": "http://feeds.feedburner.com/brad-frosts-blog",
	"Chen Hui Jing": "https://chenhuijing.com/feed.xml",
	"Miriam Eric Suzanne": "https://www.miriamsuzanne.com/feed.xml",
	KitchenWitch: "https://kitchenwitch.substack.com/feed",
	"Zach Leatherman": "https://www.zachleat.com/web/feed/",
	"adrienne maree brown": "http://adriennemareebrown.net/feed/",
	"John August": "https://johnaugust.com/feed",
	Piccalilli: "https://piccalil.li/feed.xml",
	"Max Böck": "https://mxb.dev/feed.xml",
	"Jim Nielsen’s Weblog": "https://blog.jim-nielsen.com/feed.xml",
	"Ethan Marcotte’s website": "https://ethanmarcotte.com/wrote/feed.xml",
	"daverupert.com": "https://daverupert.com/atom.xml",
	"The Technium": "https://feedpress.me/thetechnium",
	"I Love Typography": "https://ilovetypography.com/feed/",
	"Real Life": "https://reallifemag.com/feed/",
	"The Scholar's Stage": "https://scholars-stage.blogspot.com/feeds/posts/default?alt=rss",
	"Unimaginable Heights - Home": "https://neocities.org/site/unimaginable-heights.rss",
	"Are.na / Laurel Schwulst": "https://www.are.na/laurel-schwulst/feed/rss",
	"Living Designers and Design Studios":
		"https://www.are.na/laurel-schwulst/living-designers-and-design-studios/feed/rss",
	"Food in Jars": "https://feedpress.me/FIJ",
	"blog.lmorchard.com": "http://blog.lmorchard.com.s3-website-us-east-1.amazonaws.com/index.rss",
	"cinni's dream home": "https://cinni.net/rss.xml",
	"novov blog": "https://novov.me/blog/feed.xml",
	"Are.na / Seth Thompson": "https://www.are.na/seth-thompson/feed/rss",
	"Observations on film art": "http://www.davidbordwell.net/blog/feed/atom/",
	"Private Feed for gcuddy": "https://github.com/gcuddy.private.atom?token=AF3LA2Z2XGU2DAQTIYX6SHN6L6ZDS",
	"Philip Bloom": "https://www.youtube.com/feeds/videos.xml?channel_id=UCcM_6ay33BNpChknCrMCgig",
	"Put This On": "https://putthison.com/feed/",
	"Die, Workwear!": "https://dieworkwear.com/feed/",
	"the Literary Saloon": "https://www.complete-review.com/saloon/rss.xml",
	ArtsJournal: "https://www.artsjournal.com/feed",
	"The History of the Web": "https://thehistoryoftheweb.com/feed/",
	"Electric Bikes Blog": "https://electricbikeblog.com/feed/",
	"Lucy Bellwood": "https://lucybellwood.com/feed/",
	"Frank Chimero": "https://frankchimero.com/feed.xml",
	"BrettTerpstra.com - The Mad Science of Brett Terpstra": "http://brett.trpstra.net/brettterpstra",
	TYNAN: "http://feeds.feedburner.com/tynan",
	"Mr. Money Mustache": "https://www.mrmoneymustache.com/feed/",
	MacStories: "https://www.macstories.net/feed/json/",
	"HowlRound.com": "https://howlround.com/feed",
	"The SelbyThe Selby": "https://theselby.com/feed/",
	"Marginal REVOLUTION": "http://feeds.feedburner.com/marginalrevolution/feed",
	MacSparky: "https://www.macsparky.com/blog?format=rss",
	"ryanjamurphy - obsidian": "https://forum.obsidian.md/u/ryanjamurphy/activity.rss",
	Rescripted: "https://rescripted.org/feed/",
	"The Brooklyn Rail": "https://brooklynrail.org/rss",
	Tasshin: "https://tasshin.com/feed/",
	"aaronzlewis.com": "https://aaronzlewis.com/feed.xml",
	Stratechery: "https://rss.stratechery.passport.online/feed/rss/NsFLVJJkE3pGHK4eQLhcuN",
	"Piper Haywood": "https://piperhaywood.com/feed/",
	"Interdependent Thoughts": "https://www.zylstra.org/blog/feed/",
	"A List Apart: The Full Feed": "https://alistapart.com/main/feed/",
	"Vox: All Posts by Terry Nguyen": "https://www.vox.com/authors/terry-nguyen/rss",
	"Robin's blog": "https://www.robinsloan.com/feed/index.xml",
	Infovore: "http://feeds.feedburner.com/infovoredotorg",
	"New Models": "http://feeds.feedburner.com/newmodels/rss",
	"Gwern.net Newsletter": "https://gwern.substack.com/feed/",
	ribbonfarm: "https://www.ribbonfarm.com/feed/",
	"Pluralistic: Daily links from Cory Doctorow": "https://pluralistic.net/feed/",
	"Marco.org": "https://marco.org/rss",
	"swyx.io Writing and Speaking": "https://www.swyx.io/rss.xml",
	"tomcritchlow.com": "https://tomcritchlow.com/feed.xml",
	"Subpixel Space": "https://subpixel.space/feed.xml",
	"Token Theatre Friends": "https://tokentheatrefriends.com/feed/",
	"Katy DeCorah": "https://katydecorah.com/feed.xml",
	"Daring Fireball": "https://daringfireball.net/feeds/main",
	"Craig Mod": "https://www.youtube.com/feeds/videos.xml?channel_id=UCT9rTVrcpQng1NUc-uLAJdw",
	"The Public Domain Review": "https://publicdomainreview.org/rss.xml",
	"Josh Comeau's blog": "https://www.joshwcomeau.com/rss.xml",
	"Austin Kleon": "https://austinkleon.com/feed/",
	"Robin Sloan": "https://society.robinsloan.com/feed.xml",
	"Frame Problems": "https://www.youtube.com/feeds/videos.xml?channel_id=UCNJeGFWrst9jevwCe0T7rcw",
	"maya.land": "https://maya.land/feed.xml",
	webcurios: "https://webcurios.co.uk/feed/",
	"gen yeet": "https://genyeet.substack.com/feed",
	"Sarah Fossheim's Blog": "https://fossheim.io/feed.xml",
	"Vox: All Posts by Rebecca Jennings": "https://www.vox.com/authors/rebecca-jennings/rss",
	"Kicks Condor": "https://www.kickscondor.com/feed.json",
	"Rob Weychert": "http://feeds.feedburner.com/robweychert",
	"Articles on SaraSoueidan.com": "https://www.sarasoueidan.com/blog/index.xml",
	Deeplinks: "https://www.eff.org/rss/updates.xml",
	thesephist: "https://thesephist.com/index.xml",
	"Lobsters: vim - Vim editor": "https://lobste.rs/t/vim.rss",
	"Lobsters: art - Art": "https://lobste.rs/t/art.rss",
	"Humane Ingenuity": "https://buttondown.email/dancohen/rss",
	"Lobsters: javascript - Javascript programming": "https://lobste.rs/t/javascript.rss",
	"Lobsters: mac - Apple macOS": "https://lobste.rs/t/mac.rss",
	"Lobsters: philosophy - Philosophy": "https://lobste.rs/t/philosophy.rss",
	"Best of MetaFilter": "http://feeds.feedburner.com/BestOfMetafilter",
	"Nicole van der Hoeven": "https://nicolevanderhoeven.com/index.xml",
	"MetaFilter Projects": "http://feeds2.feedburner.com/mefi/Projects",
	"Neurotic Gradient Descent": "http://neuroticgradientdescent.blogspot.com/feeds/posts/default",
	"/u/youngsatchel": "http://reddit.com/u/youngsatchel.rss",
	"Secret Flying": "https://www.secretflying.com/feed/",
	"The Flight Deal": "https://www.theflightdeal.com/feed/",
	"Robbie and Gary Gardening Easy":
		"https://www.youtube.com/feeds/videos.xml?channel_id=UC1cDQMkljsH2M3XesAPvAxw",
	"overview for RomeoStevens": "https://www.reddit.com/user/RomeoStevens.rss",
	"/u/Seventeenthirtythree": "https://www.reddit.com/user/seventeenthirtythree.rss",
	"/r/manybaggers": "http://reddit.com/r/manybaggers/top.rss?t=month",
	"/r/streamentry": "https://www.reddit.com/r/streamentry/top/.rss?t=month",
	"top scoring links : GoNets": "https://www.reddit.com/r/GoNets/top.rss?t=month",
	"Mark Bone": "https://www.youtube.com/feeds/videos.xml?user=markandrewbone",
	"Potato Jet": "https://www.youtube.com/feeds/videos.xml?channel_id=UCNJe8uQhM2G4jJFRWiM89Wg",
	MacWright: "https://macwright.com/rss.xml",
	"alexdanco.com": "https://alexdanco.com/feed/",
	"Applied Divinity Studies": "https://applieddivinitystudies.com/atom.xml",
	"Gerald Undone": "https://www.youtube.com/feeds/videos.xml?channel_id=UC09qASY4ixFS-KXIH6Nw0rg",
	"Tania Rascia | RSS Feed": "https://www.taniarascia.com/rss.xml",
	"Tyler Stalman": "https://www.youtube.com/feeds/videos.xml?channel_id=UC6OICk-ceplUJf4sCN3DMnQ",
	FOSTERTALK: "https://foster.substack.com/feed.xml",
	"Snakes and Ladders": "https://blog.ayjay.org/feed/",
	"50 Watts": "http://50watts.com/rss/",
	"Obsidian Forum - Latest posts by @nickmilo": "https://forum.obsidian.md/u/nickmilo/activity.rss",
	"Words for Young Men": "https://wordsforyoungmen.tumblr.com/rss",
	"Kent C. Dodds Blog": "https://kentcdodds.com/blog/rss.xml",
	"Ahmad Shadeed Blog": "https://ishadeed.com/feed.xml",
	"Clagnut summaries": "http://clagnut.com/feeds/summaries.xml",
	"Cory Doctorow's craphound.com": "https://craphound.com/feed/",
	"Podcast Notes": "https://podcastnotes.org/feed/",
	"Weiwei Xu": "http://weiweihsu.com/feed.xml",
	"Wet Paint – Artnet News": "https://news.artnet.com/news-pro/wet-paint/feed",
	Macdrifter: "http://www.macdrifter.com/feeds/all.atom.xml",
	"Notes, links, etc": "https://styledeficit.tumblr.com/rss",
	"London Review of Books": "https://www.lrb.co.uk/feeds/rss",
	"gilest.org": "https://gilest.org/feed/index.xml",
	"Nets – The Athletic": "https://theathletic.com/team/nets/?rss",
	"surma.dev": "https://surma.dev/index.xml",
	"Fastmail blog": "https://fastmail.blog/rss/",
	"Home on Dwarkesh Patel": "https://dwarkeshpatel.com/index.xml",
	"Uses This": "https://usesthis.com/feed.atom",
	"Baldur Bjarnason's Notes on the Web": "https://feedpress.me/baldurbjarnason",
	"Fonts In Use: Staff Picks": "https://feeds.feedburner.com/FontsInUsePicks",
	"Obsidian Roundup": "https://www.obsidianroundup.org/blog/rss/",
	"Lea Verou": "http://feeds.feedburner.com/leaverou",
	"Adrian Roselli": "https://adrianroselli.com/feed",
	"Stéphanie Walter – UX and UI Design, Mobile optimization": "https://feedpress.me/stephaniewalter-blog-en",
	"Best New Albums - Pitchfork": "https://pitchfork.com/rss/reviews/best/albums/",
	"Exeunt Magazine NYC": "http://exeuntnyc.com/feed/",
	"Vintage, Arts, Architecture (1900-1980)✨": "https://danismm.tumblr.com/rss",
	"winning the internet (pudding.cool)": "https://feeds.feedburner.com/WinningTheInternet/",
	"Meaningness - Better ways of thinking, feeling, and acting—around problems of meaning: self, society, ethics, purpose, and value":
		"https://meaningness.com/rss.xml",
	"CSS { In Real Life }": "https://css-irl.info/rss.xml",
	"The Selby": "https://theselby.com/feed/atom/",
	"Alec Soth": "https://www.youtube.com/feeds/videos.xml?channel_id=UCHIxfgu7HE9_Tok9OGNrQ_g",
	"Chinese Cooking Demystified":
		"https://www.youtube.com/feeds/videos.xml?channel_id=UC54SLBnD5k5U3Q6N__UjbAw",
	"J. Kenji López-Alt": "https://www.youtube.com/feeds/videos.xml?channel_id=UCqqJQ_cXSat0KIAVfIfKkVA",
	"What's Up, Fraidycat?": "https://fraidyc.at/blog/feed.xml",
	VGDensetsu: "https://vgdensetsu.tumblr.com/rss",
	"now - The Studio of James T. Green": "https://www.jamestgreen.com/now?format=rss",
	"Flicker Fusion": "https://flickerfusion.com/index.xml",
	"Joe Carey": "https://joecarey.com/feed/",
	gazs: "https://gazs.tumblr.com/rss",
	Chuang: "https://chuangcn.org/feed/",
	"Remains of the Day": "https://www.eugenewei.com/blog?format=rss",
	"Stories by Medieval Indonesia on Medium": "https://medium.com/feed/@indomedieval",
	"the m john harrison blog": "https://ambientehotel.wordpress.com/feed/",
	"The Tattooed Book Geek": "https://thetattooedbookgeek.wordpress.com/feed/",
	"The Position Light": "https://position-light.blogspot.com/feeds/posts/default",
	"Doctors Without Boredom": "https://blogs.mereorthodoxy.com/matthewloftus/feed/",
	"Dana Gioia": "https://www.youtube.com/feeds/videos.xml?channel_id=UC6dDuuRPo6HXxn69LMLrwyw",
	"A Working Library": "https://aworkinglibrary.com/feed/index.xml",
	"Everest Pipkin": "https://everest-pipkin.com/rss.xml",
	"abject sublime": "https://abjectsubli.me/feed.xml",
	"Eater NY -  All": "https://ny.eater.com/rss/index.xml",
	"Four Short Links – Radar": "https://www.oreilly.com/radar/topics/four-short-links/feed/index.xml",
	"Monday Note - Medium": "https://mondaynote.com/feed",
	Tachy: "https://tachy.org/feed/feed.xml",
	"greg.org": "https://greg.org/feed",
	"Winnie Lim": "https://winnielim.org/feed/",
	mylarmelodies: "https://www.youtube.com/feeds/videos.xml?channel_id=UCz0l5LJhNQkktxKWcGUtWxg",
	"Love Thinking about Finance, Monetary Economics, and Money View": "http://elhamsaeidinezhad.com/feed/",
	"thoughts + feelings - The Studio of James T. Green": "https://www.jamestgreen.com/thoughts?format=rss",
	"Matt Widmann": "https://mattwidmann.net/index.xml",
	"Hundred Rabbits": "http://100r.co/links/rss.xml",
	"Longest Voyage": "https://longest.voyage/index.xml",
	"Ryan Veeder": "https://www.rcveeder.net/blog/feed/",
	"Pedestrian Observations": "https://pedestrianobservations.com/feed/",
	"Ramblings from Jessie": "https://blog.jessfraz.com/index.xml",
	"Lady and Pups": "https://ladyandpups.com/feed/",
	Interconnected: "https://interconnected.org/home/feed",
	"Make Things. Make Sense.": "https://doriantaylor.com/f07f5044-01bc-472d-9079-9b07771b731c",
	"smitten kitchen": "http://feeds.feedburner.com/smittenkitchen",
	"Web Development History": "https://webdevelopmenthistory.com/feed/",
	"Deconstructing Yourself": "https://deconstructingyourself.com/feed",
	"Qualia  Computing": "https://qualiacomputing.com/feed/",
	Axle: "https://axle.design/feed.rss",
	"Gurteen Knowledge": "https://feeds.feedburner.com/GurteenKnowledgeUpdate",
	"Harold Jarche": "https://jarche.com/feed/",
	"Dan Luu": "https://danluu.com/atom.xml",
	"Mark's Daily Apple": "https://www.marksdailyapple.com/feed/",
	"The Woks of Life": "https://feeds.feedburner.com/thewoksoflife",
	Feedbin: "https://feedbin.com/blog/atom.xml",
	"Property 'attr' does not exist on type 'CheerioElement' - Stack Overflow":
		"https://stackoverflow.com/feeds/question/61081983",
	"The Center for Artistic Activism": "https://c4aa.org/feed",
	"Obsidian Forum - Latest posts by @pseudometa": "https://forum.obsidian.md/u/pseudometa/activity.rss",
	"Obsidian Forum - Latest posts by @davecan": "https://forum.obsidian.md/u/davecan/activity.rss",
	"Aquarium Drunkard": "http://feeds.feedburner.com/AnAquariumDrunkard",
	"Nicole Express": "https://nicole.express/feed.xml",
	"Chris Aldrich": "https://boffosocko.com/feed/",
	"Are.na / Chris Beiser": "https://www.are.na/chris-beiser/feed/rss",
} as const;

// improve this code with promise.all
// async function pSSFeeds({ lastRunAt }: { lastRunAt: Date }) {
// 	return await Promise.all(
// 		Object.entries(rssFeeds).map(([name, url]) => {
// 			try {
// 				return newRSSItems({
// 					url,
// 					lastRunAt,
// 				})
// 					.then((items) => {
// 						if (items.length) console.log(`ew from ${name} RSS: ${items.length} items`);
// 						return { name, items };
// 					})
// 					.catch((e) => console.error(`Error fetching ${url}`, e));
// 			} catch (e) {
// 				console.error(`Error fetching ${url}`, e);
// 			}
// 		})
// 	);
// }

// async function pollRSSFeeds({ lastRunAt }: { lastRunAt: Date }) {
// 	return Object.entries(rssFeeds).map(async ([name, url]) => {
// 		try {
// 			let items = await newRSSItems({
// 				url,
// 				lastRunAt,
// 			});
// 			if (items.length) console.log(`ew from ${name} RSS: ${items.length} items`);
// 			return { name, items };
// 		} catch (e) {
// 			console.error(`Error fetching ${url}`, e);
// 		}
// 	});
// }

async function pollFeeds() {
	console.time("pollFeeds");
	const toParse = Object.entries(rssFeeds);
	const items = await Promise.all(
		toParse.map(([name, url]) =>
			fetchText(url)
				.then((text) => parseRSS(text, new Date("Fri, 23 Dec 2022 05:21:01 +0000")))
				.catch((e) => {
					console.error(`Error fetching ${url}`, e);
					return [];
				})
		)
	);
	console.dir({ items }, { depth: null });
	console.timeEnd("pollFeeds");
}

async function main() {
	pollFeeds();

	// console.time("pollRssFeeds");
	// pSSFeeds({ lastRunAt: new Date("Fri, 23 Dec 2022 05:21:01 +0000") });
	// console.timeEnd("pollRssFeeds");
	// console.time("prssFeeds");
	// pSSFeeds({ lastRunAt: new Date("Fri, 23 Dec 2022 05:21:01 +0000") });
	// console.timeEnd("prsFeeds");
}

main();
// fetchRSS('https://mastodon.social/@craigmod.rss').then(res => console.log(res))
