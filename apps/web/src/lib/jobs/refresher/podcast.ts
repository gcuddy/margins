// this shuold be moved to like a parser file lol

export const ERRORS = {
    'parsingError' : new Error("Parsing error."),
    'requiredError' : new Error("One or more required values are missing from feed."),
    'fetchingError' : new Error("Fetching error."),
    'optionsError' : new Error("Invalid options.")
  }

  /*
  ============================================
  === DEFAULT OPTIONS and OPTIONS BUILDING ===
  ============================================
  */

  const metaFields = ['title', 'description', 'subtitle', 'imageURL', 'lastUpdated', 'link',
  'language', 'editor', 'author', 'summary', 'categories', 'owner',
  'explicit', 'complete', 'blocked', 'person'] as const;
  const episodeFields = ['title', 'description', 'subtitle', 'imageURL', 'pubDate',
  'link', 'language', 'enclosure', 'duration', 'summary', 'blocked',
  'explicit', 'order', 'person'] as const

  type MetaField = typeof metaFields[number];
    type EpisodeField = typeof episodeFields[number];

    type Options = {
        fields: {
            meta: MetaField[],
            episodes: EpisodeField[]
        },
        required: {
            meta: MetaField[],
            episodes: EpisodeField[]
        },
        uncleaned: {
            meta: MetaField[],
            episodes: EpisodeField[]
        }
    }

  export const DEFAULT: Options = {
    fields: {
      meta: ['title', 'description', 'subtitle', 'imageURL', 'lastUpdated', 'link',
              'language', 'editor', 'author', 'summary', 'categories', 'owner',
              'explicit', 'complete', 'blocked', 'person'],
      episodes: ['title', 'description', 'subtitle', 'imageURL', 'pubDate',
              'link', 'language', 'enclosure', 'duration', 'summary', 'blocked',
              'explicit', 'order', 'person']
    },
    required: {
      meta: [],
      episodes: []
    },
    uncleaned: {
      meta: [],
      episodes: []
    }
  }

  // from https://stackoverflow.com/questions/1584370/how-to-merge-two-arrays-in-javascript-and-de-duplicate-items
  function mergeDedupe(arr: any[])
  {
    return [...new Set([].concat(...arr))];
  }

  export const buildOptions = function (params?: Partial<Options>) {
    if (!params) return DEFAULT;
    try {

      // default options
      // tried to accomplish this by referencing the DEFAULT object,
      // but ran into problems with mutation when doing Object.assign(options[key], params[key])
      const options = {
        ...DEFAULT,
        ...params,
      }


      // if 'default' given in parameters, merge default options with given custom options
      //  and dedupe
    //   if (options.fields.meta.includes('default')) {
    //     options.fields.meta = mergeDedupe([DEFAULT.fields.meta, params.fields.meta])
    //     options.fields.meta.splice(options.fields.meta.indexOf('default'), 1)
    //   }

    //   if (options.fields.episodes.includes('default')) {
    //     options.fields.episodes = mergeDedupe([DEFAULT.fields.episodes, params.fields.episodes])
    //     options.fields.episodes.splice(options.fields.episodes.indexOf('default'), 1)
    //   }

      return options

    } catch (err) {
      throw ERRORS.optionsError
    }
  }

// from https://github.com/podverse/podcast-feed-parser/blob/develop/index.js
export const GET = {
    imageURL: function (node: any) {
      if (node.image) {
        return node.image.url
      }

      if (node["itunes:image"]) {
        return node["itunes:image"].href
      }

      return undefined
    },

    subtitle: function <T>(node: Record<string, T>) {
      return node['itunes:subtitle']
    },

    lastUpdated: function <T>(node: Record<string, T>) {
      return node.lastBuildDate
    },

    editor: function <T>(node: Record<string, T>) {
      return node.managingEditor
    },

    author: function <T>(node: Record<string, T>) {
      return node['itunes:author']
    },

    summary: function <T>(node: Record<string, T>) {
      return node['itunes:summary']
    },

    owner: function <T>(node: Record<string, T>) {
      return node['itunes:owner']
    },

    explicit: function <T>(node: Record<string, T>) {
      return node['itunes:explicit']
    },

    complete: function <T>(node: Record<string, T>) {
      return node['itunes:complete']
    },

    blocked: function <T>(node: Record<string, T>) {
      return node['itunes:block']
    },

    order: function <T>(node: Record<string, T>) {
      return node['itunes:order']
    },

    guid: function <T>(node: Record<string, T>) {
      return node.guid && node.guid['#text']
    },

    duration: function <T>(node: Record<string, T>) {
      return node['itunes:duration']
    },

    categories: function <T>(node: Record<string, T>) {
      // returns categories as an array containing each category/sub-category
      // grouping in lists. If there is a sub-category, it is the second element
      // of an array.

      let categoriesArray = [];
      if(node["itunes:category"] && node["itunes:category"]?.length > 0){
        categoriesArray = node["itunes:category"].map( item => {
          const category = []
          category.push(item.text) // primary category
          if (item['itunes:category']) { // sub-category
            category.push(item['itunes:category'].text)
          }
          return category
        })
      }

      return categoriesArray
    },

    person: function<T>(node: Record<string, T>){
      return node['podcast:person']
    }
  } as const;

  const getDefault = function <T extends {}>(node: T, field: keyof T) {
    return (node[field]) ? node[field] : undefined
  }

  const CLEAN = {

    enclosure: function (object) {
      return {
        length: object.length,
        type: object.type,
        url: object.url
      }
    },

    duration: function (string) {
      // gives duration in seconds
      let times = string.split(':'),
      sum = 0, mul = 1

      while (times.length > 0) {
        sum += mul * parseInt(times.pop())
        mul *= 60
      }

      return sum
    },

    owner: function (object) {
      const ownerObject = {}

      if (object.hasOwnProperty("itunes:name")) {
        ownerObject.name = object["itunes:name"]
      }

      if (object.hasOwnProperty("itunes:email")) {
        ownerObject.email = object["itunes:email"]
      }

      return ownerObject
    },

    lastUpdated: function (string) {
      return new Date(string).toISOString()
    },

    pubDate: function (string) {
      return new Date(string).toISOString()
    },

    guid: function (string) {
      if (typeof string === 'object' && '_' in string) {
        return string._
      } else {
        return string
      }
    },

    complete: function (string) {
      if (string.toLowerCase == 'yes') {
        return true
      } else {
        return false
      }
    },

    blocked: function (string) {
      if (string.toLowerCase == 'yes') {
        return true
      } else {
        return false
      }
    },

    explicit: function (string) {
      if (['yes', 'explicit', 'true'].includes(string.toLowerCase())) {
        return true
      } else if (['clean', 'no', 'false'].includes(string.toLowerCase())) {
        return false
      } else {
        return undefined
      }
    },

    imageURL: function (string) {
      return string
    },

    person: function (array) {
      return [].concat(array).map(person=>{
        return {name: person['_'], ...person['$']}
      })
    }

  }

  const cleanDefault = function (node) {
    // return first item of array
    if (node !== undefined && node[0]!== undefined) {
      return node[0]
    } else {
      return node
    }
  }

  export const getInfo = function (node, field: EpisodeField, uncleaned) {
    // gets relevant info from podcast feed using options:
    // @field - string - the desired field name, corresponding with GET and clean
    //     functions
    // @uncleaned - boolean - if field should not be cleaned before returning

    let info;

    // if field has a GET function, use that
    // if not, get default value
    info = (field in GET) ? GET[field](node) : getDefault(node,field)

    // if field is not marked as uncleaned, clean it using CLEAN functions
    if (!uncleaned && info !== undefined) {
      info = (CLEAN[field]) ? CLEAN[field].call(this, info) : cleanDefault(info)
    } else {
    }

    return info
  }

  export function createMetaObjectFromFeed (channel, options) {

    const meta = {}

    options.fields.meta.forEach( (field) => {
      const obj = {}
      var uncleaned = false

      if (options.uncleaned && options.uncleaned.meta) {
        var uncleaned = (options.uncleaned.meta.includes(field))
      }

      obj[field] = getInfo(channel, field, uncleaned)

      Object.assign(meta, obj)
    })

    if (options.required && options.required.meta) {
      options.required.meta.forEach( (field) => {
        if (!Object.keys(meta).includes(field)) {
          throw ERRORS.requiredError
        }
      })
    }

    return meta
  }

  type Episode = {
    title: string,
    summary?: string,
    enclosureUrl?: string,
    duration?: number;
    image?: string;
    published?: string | Date;
    // order?
    link?: string;
  }

  // function builds episode objects from parsed podcast feed
  export function createEpisodesObjectFromFeed (channel: any, options: Options): Episode[] {
    const episodes: Episode[] = []

    channel.item.forEach( (item) => {
      const episode: Partial<Record<EpisodeField, any>> = {};

      options.fields.episodes.forEach( (field) => {
        const obj = {}
        let uncleaned = false

        if (options.uncleaned && options.uncleaned.episodes) {
          uncleaned = (options.uncleaned.episodes.includes(field))
        }

        episode[field] = getInfo(item, field, uncleaned)

        Object.assign(episode, obj)
      })

      if (options.required && options.required.episodes) {
        options.required.episodes.forEach( (field) => {
          if (!Object.keys(episode).includes(field)) {
            throw ERRORS.requiredError
          }
        })
      }

      episodes.push(episode)
    })

    episodes.sort(
      function (a, b) {
        // sorts by order first, if defined, then sorts by date.
        // if multiple episodes were published at the same time,
        // they are then sorted by title
        if (a.order == b.order) {
          if (a.pubDate == b.pubDate) {
            return a.title > b.title ? -1 : 1
          }
          return b.pubDate > a.pubDate ? 1 : -1
        }

        if (a.order && !b.order) {
          return 1
        }

        if (b.order && !a.order) {
          return -1
        }

        return a.order > b.order ? -1 : 1
      }
    )

    return episodes
  }

  export const getPodcastFromFeed = function (feedObject: Record<string, any>, params?: typeof DEFAULT ) {
      const options = buildOptions(params)

      const channel = feedObject.rss.channel;
      if (channel["itunes:new-feed-url"]) {
        console.warn("\nWarning: Feed includes <itunes:new-feed-url> element, which indicates that the feed being parsed may be outdated.\n")
      }

      const meta = createMetaObjectFromFeed(channel, options)
      const episodes = createEpisodesObjectFromFeed(channel, options)

     console.log({meta, episodes})
      return {meta, episodes}
  }
