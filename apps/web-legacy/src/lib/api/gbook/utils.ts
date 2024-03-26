import type { books_v1 } from '@googleapis/books';

export function getGbookImage(book: books_v1.Schema$Volume) {
    const { volumeInfo } = book;
    if (!volumeInfo) return '';
    const { imageLinks } = volumeInfo;
    if (!imageLinks) return;
    const { extraLarge, large, medium, small, thumbnail } = imageLinks;
    // try thumbnail first, setting zoom to 0 and removing curl
    // if that fails, try small, medium, large, extraLarge
    if (thumbnail) {
        console.log('thumbnail', thumbnail);
        const url = new URL(thumbnail);
        // url.searchParams.set("zoom", "0");
        url.searchParams.delete('edge');
        return url.href;
    }

    return extraLarge ?? large ?? medium ?? small ?? thumbnail;
}
