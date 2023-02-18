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
    video: "document",
    movie: "film"
};
