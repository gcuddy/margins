import type { DocumentType } from "@prisma/client";

const googleBooksRegex = /https?:\/\/www\.google\.com\/books\/edition\/.*\/(.*)/;
const urlToTypeLookup: Map<string, DocumentType> = new Map([
    ['https://www.youtube.com/watch?v=', 'video'],
    ['https://www.google.com/books/edition/', 'book'],
    ['https://books.google.com/books/about', 'book'],
    ['http://books.google.com/books/about', 'book'],
])

export function lookupUrlType(url: string) {
    for (const [key, value] of urlToTypeLookup) {
        if (url.startsWith(key)) {
            return value
        }
    }
}

// https://www.google.com/books/edition/The_End_of_History_and_the_Last_Man/NdFpQwKfX2IC?hl=en
// google books regex
