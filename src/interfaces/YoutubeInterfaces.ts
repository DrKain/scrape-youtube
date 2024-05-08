

export interface YoutubeGetSearchData {
    contents: {
        twoColumnSearchResultsRenderer: {
            primaryContents: {
                sectionListRenderer: {
                    contents: SectionListRendererContents[]
                },
                richGridRenderer: {
                    contents: RichGridRendererContents[]
                }
            }
        }
    }
}

export interface SectionListRendererContents {
    itemSectionRenderer: {
        contents: ItemSectionRendererContents[]
    }
}

export interface ItemSectionRendererContents {
    videoRenderer?: VideoRenderer
    reelSheldRenderer?: {

    },
    playlistRenderer?: {

    },
    channelRenderer?: {

    }
}

export interface VideoRenderer {
    videoId: string
    title: VideoRendererTitle
    ownerText: {
        runs: VideoRendererChannelRun[]
    }
    longBylineText: {
        runs: VideoRendererChannelRun[]
    }
    detailedMetadataSnippets: {
        snippetText: {}
    }[]
    descriptionSnippet: {}
    viewCountText: {
        simpleText: string
        runs: {
            text: string
        }[]
    }
    publishedTimeText?: {
        simpleText: string
    }
    lengthText?: {
        simpleText: string
    }
    ownerBadges?: Badge[]
    channelThumbnailSupportedRenderers?: {
        channelThumbnailWithLinkRenderer?: ChannelTumbnailWithLinkRenderer
    }
}

export interface Badge {
    metadataBadgeRenderer: {
        style: string
    }
}

export interface ChannelTumbnailWithLinkRenderer {
    thumbnail?: {
        thumbnails?: {
            url: string
        }[]
    }
}

export interface VideoRendererChannelRun {
    text: string
    navigationEndpoint: {
        browseEndpoint: {
            canonicalBaseUrl: string
            browseId: string
        }
    }
}

export interface VideoRendererTitle {
    runs?: {
        text: string
    }[]
}


export interface RichGridRendererContents {
    richItemRenderer: {
        content: ItemSectionRendererContents
    }
}