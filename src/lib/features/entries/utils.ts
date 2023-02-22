import type { DocumentType } from "@prisma/client";

import type { IconName } from "$lib/icons";

export const icons: Record<DocumentType, IconName> = {
    bookmark: "bookmark",
    article: "newspaper",
    recipe: "chef",
    tweet: "tweet",
    audio: "musicNote",
    book: "bookOpen",
    album: "musicNote",
    epub: "documentText",
    image: "photo",
    video: "videoCamera",
    movie: "film"
};

export const iconsMini: Record<DocumentType, IconName> = {
    bookmark: "bookmarkMini",
    article: "newspaperMini",
    recipe: "chefMini",
    tweet: "tweet",
    audio: "musicalNoteMini",
    book: "bookOpenMini",
    album: "musicalNoteMini",
    epub: "documentTextMini",
    image: "photoMini",
    video: "videoCameraMini",
    movie: "filmMini"
}
