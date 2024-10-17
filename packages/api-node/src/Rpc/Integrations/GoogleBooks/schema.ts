import * as S from "@effect/schema/Schema"

// generated from https://app.quicktype.io/ json response from google books api

export class ReadingModes extends S.Class<ReadingModes>("ReadingModes")({
  text: S.optional(S.Union(S.Boolean, S.Null)),
  image: S.optional(S.Union(S.Boolean, S.Null)),
}) { }

export class PanelizationSummary extends S.Class<PanelizationSummary>(
  "PanelizationSummary",
)({
  containsEpubBubbles: S.optional(S.Union(S.Boolean, S.Null)),
  containsImageBubbles: S.optional(S.Union(S.Boolean, S.Null)),
}) { }

export class IndustryIdentifier extends S.Class<IndustryIdentifier>(
  "IndustryIdentifier",
)({
  type: S.optional(S.Union(S.Null, S.String)),
  identifier: S.optional(S.Union(S.Null, S.String)),
}) { }

export class ImageLinks extends S.Class<ImageLinks>("ImageLinks")({
  smallThumbnail: S.optional(S.Union(S.Null, S.String)),
  thumbnail: S.optional(S.Union(S.Null, S.String)),
  small: S.optional(S.Union(S.Null, S.String)),
  medium: S.optional(S.Union(S.Null, S.String)),
  large: S.optional(S.Union(S.Null, S.String)),
}) { }

export class Dimensions extends S.Class<Dimensions>("Dimensions")({
  height: S.optional(S.Union(S.Null, S.String)),
}) { }

export class VolumeInfo extends S.Class<VolumeInfo>("VolumeInfo")({
  title: S.optional(S.Union(S.Null, S.String)),
  subtitle: S.optional(S.Union(S.Null, S.String)),
  authors: S.optional(S.Union(S.Array(S.String), S.Null)),
  publisher: S.optional(S.Union(S.Null, S.String)),
  publishedDate: S.optional(S.Union(S.Null, S.String)),
  description: S.optional(S.Union(S.Null, S.String)),
  industryIdentifiers: S.optional(S.Union(S.Array(IndustryIdentifier), S.Null)),
  readingModes: S.optional(S.Union(ReadingModes, S.Null)),
  pageCount: S.optional(S.Union(S.Number, S.Null)),
  printedPageCount: S.optional(S.Union(S.Number, S.Null)),
  dimensions: S.optional(S.Union(Dimensions, S.Null)),
  printType: S.optional(S.Union(S.Null, S.String)),
  categories: S.optional(S.Union(S.Array(S.String), S.Null)),
  averageRating: S.optional(S.Union(S.Number, S.Null)),
  ratingsCount: S.optional(S.Union(S.Number, S.Null)),
  maturityRating: S.optional(S.Union(S.Null, S.String)),
  allowAnonLogging: S.optional(S.Union(S.Boolean, S.Null)),
  contentVersion: S.optional(S.Union(S.Null, S.String)),
  panelizationSummary: S.optional(S.Union(PanelizationSummary, S.Null)),
  imageLinks: S.optional(S.Union(ImageLinks, S.Null)),
  language: S.optional(S.Union(S.Null, S.String)),
  previewLink: S.optional(S.Union(S.Null, S.String)),
  infoLink: S.optional(S.Union(S.Null, S.String)),
  canonicalVolumeLink: S.optional(S.Union(S.Null, S.String)),
}) { }

export class OfferListPrice extends S.Class<OfferListPrice>("OfferListPrice")({
  amountInMicros: S.optional(S.Union(S.Number, S.Null)),
  currencyCode: S.optional(S.Union(S.Null, S.String)),
}) { }

export class Offer extends S.Class<Offer>("Offer")({
  finskyOfferType: S.optional(S.Union(S.Number, S.Null)),
  listPrice: S.optional(S.Union(OfferListPrice, S.Null)),
  retailPrice: S.optional(S.Union(OfferListPrice, S.Null)),
  giftable: S.optional(S.Union(S.Boolean, S.Null)),
}) { }

export class SaleInfoListPrice extends S.Class<SaleInfoListPrice>(
  "SaleInfoListPrice",
)({
  amount: S.optional(S.Union(S.Number, S.Null)),
  currencyCode: S.optional(S.Union(S.Null, S.String)),
}) { }

export class SaleInfo extends S.Class<SaleInfo>("SaleInfo")({
  country: S.optional(S.Union(S.Null, S.String)),
  saleability: S.optional(S.Union(S.Null, S.String)),
  isEbook: S.optional(S.Union(S.Boolean, S.Null)),
  listPrice: S.optional(S.Union(SaleInfoListPrice, S.Null)),
  retailPrice: S.optional(S.Union(SaleInfoListPrice, S.Null)),
  buyLink: S.optional(S.Union(S.Null, S.String)),
  offers: S.optional(S.Union(S.Array(Offer), S.Null)),
}) { }

export class Layer extends S.Class<Layer>("Layer")({
  layerId: S.optional(S.Union(S.Null, S.String)),
  volumeAnnotationsVersion: S.optional(S.Union(S.Null, S.String)),
}) { }

export class LayerInfo extends S.Class<LayerInfo>("LayerInfo")({
  layers: S.optional(S.Union(S.Array(Layer), S.Null)),
}) { }

export class Pdf extends S.Class<Pdf>("Pdf")({
  isAvailable: S.optional(S.Union(S.Boolean, S.Null)),
}) { }

export class Epub extends S.Class<Epub>("Epub")({
  isAvailable: S.optional(S.Union(S.Boolean, S.Null)),
  acsTokenLink: S.optional(S.Union(S.Null, S.String)),
}) { }

export class AccessInfo extends S.Class<AccessInfo>("AccessInfo")({
  country: S.optional(S.Union(S.Null, S.String)),
  viewability: S.optional(S.Union(S.Null, S.String)),
  embeddable: S.optional(S.Union(S.Boolean, S.Null)),
  publicDomain: S.optional(S.Union(S.Boolean, S.Null)),
  textToSpeechPermission: S.optional(S.Union(S.Null, S.String)),
  epub: S.optional(S.Union(Epub, S.Null)),
  pdf: S.optional(S.Union(Pdf, S.Null)),
  webReaderLink: S.optional(S.Union(S.Null, S.String)),
  accessViewStatus: S.optional(S.Union(S.Null, S.String)),
  quoteSharingAllowed: S.optional(S.Union(S.Boolean, S.Null)),
}) { }

export class GoogleBookVolume extends S.Class<GoogleBookVolume>("GoogleBookVolume")({
  kind: S.optional(S.Union(S.Null, S.String)),
  id: S.optional(S.Union(S.Null, S.String)),
  etag: S.optional(S.Union(S.Null, S.String)),
  selfLink: S.optional(S.Union(S.Null, S.String)),
  volumeInfo: VolumeInfo,
  layerInfo: S.optional(S.Union(LayerInfo, S.Null)),
  saleInfo: S.optional(S.Union(SaleInfo, S.Null)),
  accessInfo: S.optional(S.Union(AccessInfo, S.Null)),
}) { }

export class GoogleBookVolumes extends S.Class<GoogleBookVolumes>(
  "GoogleBookVolumes",
)({
  kind: S.NullishOr(S.String),
  totalItems: S.NullishOr(S.Number),
  items: S.UndefinedOr(S.Array(GoogleBookVolume)),
}) { }


export class GoogleBooksSearchError extends S.TaggedError<GoogleBooksSearchError>()('GoogleBooksSearchError', {}) { }


export class GoogleBooksSearch extends S.TaggedRequest<GoogleBooksSearch>()(
  "GoogleBooksSearch",
  {
    failure: GoogleBooksSearchError,
    success: GoogleBookVolumes,
    payload: {
      query: S.String,
    },
  },
) { }

export class GoogleBooksGetError extends S.TaggedError<GoogleBooksGetError>()('GoogleBooksGetError', {}) { }

export class GoogleBooksGet extends S.TaggedRequest<GoogleBooksGet>()(
  "GoogleBooksGet",
  {
    failure: GoogleBooksGetError,
    success: GoogleBookVolume,
    payload: {
      id: S.String,
    },
  },
) { }
