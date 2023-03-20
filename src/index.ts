import {
    ResultFilter,
    ResultType,
    SearchOptions,
    Video,
    Playlist,
    Results,
    LiveStream,
    ChannelResult
} from './interface';
import { getStreamData, getPlaylistData, getVideoData, getChannelRenderData } from './parser';
import { get } from 'https';
export * from './interface';

class Youtube {
    /**
     * Enable debugging for extra information during each search
     */
    public debug = false;
    public host = 'https://www.youtube.com';
    public path = '/results';

    constructor() {}

    private getURL(query: string, options: SearchOptions): string {
        const url = new URL(this.path, this.host);
        let sp = ResultFilter[(options.type || 'video') as ResultType];

        url.search = new URLSearchParams({
            search_query: query,
            ...(options.params || {})
        }).toString();

        if (options.sp) sp = options.sp;

        return url.href + '&sp=' + sp;
    }

    private extractRenderData(page: string): Promise<JSON> {
        return new Promise((resolve, reject) => {
            try {
                // #1 - Remove line breaks
                page = page.split('\n').join('');
                // #2 - Split at start of data
                page = page.split('var ytInitialData')[1];
                // #3 - Remove the first equals sign
                const spot = page.split('=');
                spot.shift();
                // #4 - Join the split data and split again at the closing tag
                const data = spot.join('=').split(';</script>')[0];

                let render = null;
                let contents = [];
                const primary = JSON.parse(data).contents.twoColumnSearchResultsRenderer.primaryContents;

                // The renderer we want. This should contain all search result information
                if (primary['sectionListRenderer']) {
                    if (this.debug) console.log('[ytInitialData] sectionListRenderer');

                    // Filter only the search results, exclude ads and promoted content
                    render = primary.sectionListRenderer.contents.filter((item: any) => {
                        return (
                            item.itemSectionRenderer &&
                            item.itemSectionRenderer.contents &&
                            item.itemSectionRenderer.contents.filter(
                                (c: any) => c['videoRenderer'] || c['playlistRenderer'] || c['channelRenderer']
                            ).length
                        );
                    });

                    if (render.length) contents = render.shift().itemSectionRenderer.contents;
                }

                // YouTube occasionally switches to a rich grid renderer.
                // More testing will be needed to see how different this is from sectionListRenderer
                if (primary['richGridRenderer']) {
                    if (this.debug) console.log('[ytInitialData] richGridRenderer');
                    contents = primary.richGridRenderer.contents
                        .filter((item: any) => {
                            return item.richItemRenderer && item.richItemRenderer.content;
                        })
                        .map((item: any) => item.richItemRenderer.content);
                }

                resolve(contents);
            } catch (e) {
                reject(e);
            }
        });
    }

    /**
     * Parse the data extracted from the page to match each interface
     * @param data Video Renderer Data
     */
    private parseData(data: any): Promise<Results> {
        return new Promise((resolve, reject) => {
            try {
                const results: Results = {
                    videos: [],
                    playlists: [],
                    streams: [],
                    channels: []
                };

                data.forEach((item: any) => {
                    if (item['channelRenderer']) {
                        try {
                            const result: ChannelResult = getChannelRenderData(item['channelRenderer']);
                            results.channels.push(result);
                        } catch (e) {
                            if (this.debug) console.log(e);
                        }
                    }

                    if (item['videoRenderer'] && item['videoRenderer']['lengthText']) {
                        try {
                            const result: Video = getVideoData(item['videoRenderer']);
                            results.videos.push(result);
                        } catch (e) {
                            if (this.debug) console.log(e);
                        }
                    }

                    if (item['videoRenderer'] && !item['videoRenderer']['lengthText']) {
                        try {
                            const result: LiveStream = getStreamData(item['videoRenderer']);
                            results.streams.push(result);
                        } catch (e) {
                            if (this.debug) console.log(e);
                        }
                    }

                    if (item['playlistRenderer']) {
                        try {
                            const result: Playlist = getPlaylistData(item['playlistRenderer']);
                            results.playlists.push(result);
                        } catch (e) {
                            if (this.debug) console.log(e);
                        }
                    }
                });

                resolve(results);
            } catch (e) {
                console.warn(e);
                reject('Fatal error when parsing result data. Please report this on GitHub');
            }
        });
    }

    /**
     * Load the page and scrape the data
     * @param query Search query
     * @param options Search options
     */
    private load(query: string, options: SearchOptions = {}): Promise<string> {
        const url = this.getURL(query, options);
        if (this.debug) console.log(url);

        const request = options.request || {};

        return new Promise((resolve, reject) => {
            get(Object.assign(new URL(url), request), (res: any) => {
                res.setEncoding('utf8');
                let data = '';
                res.on('data', (chunk: any) => (data += chunk));
                res.on('end', () => resolve(data));
            }).on('error', reject);
        });
    }

    public search(query: string, options: SearchOptions = {}): Promise<Results> {
        return new Promise(async (resolve, reject) => {
            try {
                const page = await this.load(query, options);
                const data = await this.extractRenderData(page);
                const results = await this.parseData(data);
                resolve(results);
            } catch (e) {
                reject(e);
            }
        });
    }
}

export const youtube = new Youtube();
export const search = (query: string, options: SearchOptions = {}): Promise<Results> => {
    return youtube.search(query, options);
};
