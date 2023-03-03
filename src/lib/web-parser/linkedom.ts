import { parseHTML} from 'linkedom';

export function JSDOM(html: string) { return parseHTML(html); }
