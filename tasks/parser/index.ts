
// take in a url from cli and run web-parser

// take in a url from cli and run web-parser
import { Parser } from  '../../src/lib/web-parser/index';

const url = process.argv[2];

const parser = new Parser(url);
