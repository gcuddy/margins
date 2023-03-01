import * as z from "zod"
import * as imports from "../zod-utils"
import { CompleteSession, SessionModel, CompleteKey, KeyModel, CompleteInteraction, InteractionModel, CompleteFavorite, FavoriteModel, CompleteArticle, ArticleModel, CompleteCollection, CollectionModel, CompleteAnnotation, AnnotationModel, CompleteSubscription, SubscriptionModel, CompleteEntryData, EntryDataModel, CompleteStylesheet, StylesheetModel, CompleteState, StateModel, CompleteTagging, TaggingModel, CompleteTag, TagModel, CompleteBookmark, BookmarkModel, CompleteEntryTag, EntryTagModel, CompleteContext, ContextModel, CompleteContextNode, ContextNodeModel, CompleteColorDescription, ColorDescriptionModel, CompleteInvitationCode, InvitationCodeModel, CompleteSmartList, SmartListModel, CompleteTwitterIntegration, TwitterIntegrationModel, CompleteLog, LogModel, CompleteRelation, RelationModel, CompleteAuthorizationKey, AuthorizationKeyModel } from "./index"

export const _UserModel = z.object({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  email: z.string(),
  username: z.string(),
  default_state_id: z.number().int().nullish(),
  default_archive_id: z.number().int().nullish(),
})

export interface CompleteUser extends z.infer<typeof _UserModel> {
  session: CompleteSession[]
  Key: CompleteKey[]
  followedBy: CompleteUser[]
  following: CompleteUser[]
  interactions: CompleteInteraction[]
  favorites: CompleteFavorite[]
  articles: CompleteArticle[]
  collections: CompleteCollection[]
  annotations: CompleteAnnotation[]
  subscriptions: CompleteSubscription[]
  documentData: CompleteEntryData[]
  stylesheets: CompleteStylesheet[]
  states: CompleteState[]
  default_state?: CompleteState | null
  taggings: CompleteTagging[]
  tags: CompleteTag[]
  bookmarks: CompleteBookmark[]
  EntryTag: CompleteEntryTag[]
  context: CompleteContext[]
  context_nodes: CompleteContextNode[]
  color_descriptions: CompleteColorDescription[]
  invitationCodes: CompleteInvitationCode[]
  invitationCode?: CompleteInvitationCode | null
  views: CompleteSmartList[]
  TwitterIntegration: CompleteTwitterIntegration[]
  Log: CompleteLog[]
  relations: CompleteRelation[]
  AuthorizationKey?: CompleteAuthorizationKey | null
}

/**
 * UserModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const UserModel: z.ZodSchema<CompleteUser> = z.lazy(() => _UserModel.extend({
  session: SessionModel.array(),
  Key: KeyModel.array(),
  followedBy: UserModel.array(),
  following: UserModel.array(),
  interactions: InteractionModel.array(),
  favorites: FavoriteModel.array(),
  articles: ArticleModel.array(),
  collections: CollectionModel.array(),
  annotations: AnnotationModel.array(),
  subscriptions: SubscriptionModel.array(),
  documentData: EntryDataModel.array(),
  stylesheets: StylesheetModel.array(),
  states: StateModel.array(),
  default_state: StateModel.nullish(),
  taggings: TaggingModel.array(),
  tags: TagModel.array(),
  bookmarks: BookmarkModel.array(),
  EntryTag: EntryTagModel.array(),
  context: ContextModel.array(),
  context_nodes: ContextNodeModel.array(),
  color_descriptions: ColorDescriptionModel.array(),
  invitationCodes: InvitationCodeModel.array(),
  invitationCode: InvitationCodeModel.nullish(),
  views: SmartListModel.array(),
  TwitterIntegration: TwitterIntegrationModel.array(),
  Log: LogModel.array(),
  relations: RelationModel.array(),
  AuthorizationKey: AuthorizationKeyModel.nullish(),
}))
