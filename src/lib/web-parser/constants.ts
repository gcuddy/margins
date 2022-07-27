export const DIV_TO_P_BLOCK_TAGS = [
	'a',
	'blockquote',
	'dl',
	'div',
	'img',
	'p',
	'pre',
	'table'
].join(',');

// TODO: ability to add/modify this list
// TODO: add "boost" to certain tags via a map

export const VERY_POSITIVE_SCORE_HINTS = ['article-content'];

export const POSITIVE_SCORE_HINTS = [
	'article',
	'article-content',
	'articlecontent',
	'instapaper_body',
	'blog',
	'body',
	'content',
	'entry-content-asset',
	'entry',
	'hentry',
	'main',
	'Normal',
	'page',
	'pagination',
	'permalink',
	'post',
	'story',
	'text',
	'[-_]copy', // usatoday
	'\\Bcopy'
];
// The above list, joined into a matching regular expression
export const POSITIVE_SCORE_RE = new RegExp(POSITIVE_SCORE_HINTS.join('|'), 'i');

// TODO: same as for positive
export const NEGATIVE_SCORE_HINTS = [
	'adbox',
	'advert',
	'author',
	'bio',
	'bookmark',
	'bottom',
	'byline',
	'clear',
	'com-',
	'combx',
	'comment',
	'comment\\B',
	'contact',
	'copy',
	'credit',
	'crumb',
	'date',
	'deck',
	'excerpt',
	'featured', // tnr.com has a featured_content which throws us off
	'foot',
	// 'footer', <- I want the footer!
	//   "footnote", <- not sure about this one
	'graf',
	'head',
	'info',
	'infotext', // newscientist.com copyright
	'instapaper_ignore',
	'jump',
	'linebreak',
	'link',
	'masthead',
	'media',
	'meta',
	'modal',
	'outbrain', // slate.com junk
	'promo',
	'pr_', // autoblog - press release
	'related',
	'respond',
	'roundcontent', // lifehacker restricted content warning
	'scroll',
	'secondary',
	'share',
	'shopping',
	'shoutbox',
	'side',
	'sidebar',
	'sponsor',
	'stamp',
	'sub',
	'summary',
	'tags',
	'tools',
	'widget'
];
// The above list, joined into a matching regular expression
export const NEGATIVE_SCORE_RE = new RegExp(NEGATIVE_SCORE_HINTS.join('|'), 'i');

export const PHOTO_HINTS = ['figure', 'photo', 'image', 'caption'];
export const PHOTO_HINTS_RE = new RegExp(PHOTO_HINTS.join('|'), 'i');

export const NON_TOP_CANDIDATE_TAGS = [
	'br',
	'b',
	'i',
	'label',
	'hr',
	'area',
	'base',
	'basefont',
	'input',
	'img',
	'link',
	'meta'
];

export const NON_TOP_CANDIDATE_TAGS_RE = new RegExp(`^(${NON_TOP_CANDIDATE_TAGS.join('|')})$`, 'i');

const SENTENCE_END_RE = new RegExp('.( |$)');
export const hasSentencend = (text: string) => SENTENCE_END_RE.test(text);

export const FOOTNOTE_HINT_RE = /\bfootnotes?\b/i;

export const KEEP_SELECTORS = [
	'iframe[src^="https://www.youtube.com"]',
	'iframe[src^="https://www.youtube-nocookie.com"]',
	'iframe[src^="http://www.youtube.com"]',
	'iframe[src^="https://player.vimeo"]',
	'iframe[src^="http://player.vimeo"]',
	'iframe[src^="https://www.redditmedia.com"]'
];

export const STRIP_OUTPUT_TAGS = [
	'title',
	'script',
	'noscript',
	'link',
	'style',
	'hr',
	'embed',
	'iframe',
	'object'
];
export const CLEAN_CONDITIONALLY_TAGS = ['table', 'div', 'button', 'form'].join(',');

export const IS_LINK = new RegExp('https?://', 'i');
const IMAGE_RE = '.(png|gif|jpe?g)';
export const IS_IMAGE = new RegExp(`${IMAGE_RE}`, 'i');
export const IS_SRCSET = new RegExp(`${IMAGE_RE}(\\?\\S+)?(\\s*[\\d.]+[wx])`, 'i');

export const TAGS_TO_REMOVE = ['script', 'style', 'form'].join(',');

/** imported from Mercury */

// A list of strings that can be considered LIKELY candidates when
// extracting content from a resource. Essentially, the inverse of the
// blacklist above - if something matches both blacklist and whitelist,
// it is kept. This is useful, for example, if something has a className
// of "rss-content entry-content". It matched 'rss', so it would normally
// be removed, however, it's also the entry content, so it should be left
// alone.
//
// These strings are joined together and then tested for existence using
// re:test, so may contain simple, non-pipe style regular expression queries
// if necessary.
export const UNLIKELY_CANDIDATES_WHITELIST = [
	'and',
	'article',
	'body',
	'blogindex',
	'column',
	'content',
	'entry-content-asset',
	'format', // misuse of form
	'hfeed',
	'hentry',
	'hatom',
	'main',
	'page',
	'posts',
	'shadow'
];

// A list of strings that can be considered unlikely candidates when
// extracting content from a resource. These strings are joined together
// and then tested for existence using re:test, so may contain simple,
// non-pipe style regular expression queries if necessary.
export const UNLIKELY_CANDIDATES_BLACKLIST = [
	'ad-break',
	'adbox',
	'advert',
	'addthis',
	'agegate',
	'aux',
	'blogger-labels',
	'combx',
	'comment',
	'conversation',
	'disqus',
	'entry-unrelated',
	'extra',
	'foot',
	// 'form', // This is too generic, has too many false positives
	'header',
	'hidden',
	'loader',
	'login', // Note: This can hit 'blogindex'.
	'menu',
	'meta',
	'nav',
	'outbrain',
	'pager',
	'pagination',
	'predicta', // readwriteweb inline ad box
	'presence_control_external', // lifehacker.com container full of false positives
	'popup',
	'printfriendly',
	'related',
	'remove',
	'remark',
	'rss',
	'share',
	'shoutbox',
	'sidebar',
	'sociable',
	'sponsor',
	'taboola',
	'tools'
];

// The removal is implemented as a blacklist and whitelist, this test finds
// blacklisted elements that aren't whitelisted. We do this all in one
// expression-both because it's only one pass, and because this skips the
// serialization for whitelisted nodes.
const candidatesBlacklist = UNLIKELY_CANDIDATES_BLACKLIST.join('|');
export const CANDIDATES_BLACKLIST = new RegExp(candidatesBlacklist, 'i');
const candidatesWhitelist = UNLIKELY_CANDIDATES_WHITELIST.join('|');
export const CANDIDATES_WHITELIST = new RegExp(candidatesWhitelist, 'i');

// cleanAttributes
export const REMOVE_ATTRS = ['style', 'align'];
export const REMOVE_ATTR_SELECTORS = REMOVE_ATTRS.map((selector) => `[${selector}]`);
export const REMOVE_ATTR_LIST = REMOVE_ATTRS.join(',');
export const WHITELIST_ATTRS = [
	'src',
	'srcset',
	'sizes',
	'type',
	'href',
	'class',
	'id',
	'alt',
	'xlink:href',
	'width',
	'height'
];

export const WHITELIST_ATTRS_RE = new RegExp(`^(${WHITELIST_ATTRS.join('|')})$`, 'i');
