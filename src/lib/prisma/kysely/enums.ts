export const EntryFilterType = {
    Library: "Library",
    Subscriptions: "Subscriptions",
    All: "All"
} as const;
export type EntryFilterType = (typeof EntryFilterType)[keyof typeof EntryFilterType];
export const BookGenre = {
    Fiction: "Fiction",
    NonFiction: "NonFiction"
} as const;
export type BookGenre = (typeof BookGenre)[keyof typeof BookGenre];
export const Status = {
    Backlog: "Backlog",
    Now: "Now",
    Archive: "Archive"
} as const;
export type Status = (typeof Status)[keyof typeof Status];
export const Color = {
    Yellow: "Yellow",
    Blue: "Blue",
    Green: "Green",
    Pink: "Pink",
    Purple: "Purple"
} as const;
export type Color = (typeof Color)[keyof typeof Color];
export const RelationType = {
    Related: "Related",
    SavedFrom: "SavedFrom",
    Grouped: "Grouped"
} as const;
export type RelationType = (typeof RelationType)[keyof typeof RelationType];
export const AnnotationType = {
    bookmark: "bookmark",
    note: "note",
    annotation: "annotation",
    reply: "reply",
    document: "document",
    qa: "qa"
} as const;
export type AnnotationType = (typeof AnnotationType)[keyof typeof AnnotationType];
export const DocumentType = {
    article: "article",
    podcast: "podcast",
    rss: "rss",
    pdf: "pdf",
    epub: "epub",
    bookmark: "bookmark",
    image: "image",
    video: "video",
    tweet: "tweet",
    audio: "audio",
    book: "book",
    movie: "movie",
    tv: "tv",
    song: "song",
    album: "album",
    playlist: "playlist",
    recipe: "recipe",
    game: "game",
    board_game: "board_game"
} as const;
export type DocumentType = (typeof DocumentType)[keyof typeof DocumentType];
export const CollectionItemType = {
    Entry: "Entry",
    Annotation: "Annotation",
    Section: "Section",
    Collection: "Collection"
} as const;
export type CollectionItemType = (typeof CollectionItemType)[keyof typeof CollectionItemType];
export const FavoriteType = {
    FOLDER: "FOLDER",
    FAVORITE: "FAVORITE"
} as const;
export type FavoriteType = (typeof FavoriteType)[keyof typeof FavoriteType];
export const Entry_location = {
    inbox: "inbox",
    soon: "soon",
    later: "later",
    archive: "archive"
} as const;
export type Entry_location = (typeof Entry_location)[keyof typeof Entry_location];
export const State_type = {
    inbox: "inbox",
    soon: "soon",
    later: "later",
    archive: "archive"
} as const;
export type State_type = (typeof State_type)[keyof typeof State_type];
export const ViewType = {
    All: "All",
    Backlog: "Backlog",
    Now: "Now",
    Archive: "Archive",
    Collection: "Collection",
    CustomView: "CustomView"
} as const;
export type ViewType = (typeof ViewType)[keyof typeof ViewType];
