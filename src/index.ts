import { ResultFilter, ResultType, SearchOptions, Video, Playlist, Results, LiveStream } from './interface';
import { getStreamData, getPlaylistData, getVideoData } from './parser';
import { get } from 'https';

class Youtube {
    public debug = false;
    constructor() { }

    private getURL(query: string, options: SearchOptions): string {
        const url = new URL('/results', 'https://www.youtube.com');
        url.search = new URLSearchParams({ search_query: query }).toString();
        return url.href + '&sp=' + ResultFilter[(options.type || 'video') as ResultType];
    }

    private extractRenderData(page: string): Promise<JSON> {
        return new Promise((resolve, reject) => {
            try {
                const data = page.split('var ytInitialData = ')[1]
                .split(';</script>')[0];

                resolve(
                    JSON.parse(data).contents
                        .twoColumnSearchResultsRenderer
                        .primaryContents
                        .sectionListRenderer
                        .contents[0]
                        .itemSectionRenderer
                        .contents
                );
            } catch (e) {
                if (this.debug) console.log(e);
                reject('Failed to extract video data. The request may have been blocked');
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
                    streams: []
                };

                data.forEach((item: any) => {

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
    private load(query: string, options: SearchOptions): Promise<string> {
        const url = this.getURL(query, options);
        if (this.debug) console.log(url);

        return new Promise((resolve, reject) => {
            get(url, res => {
                res.setEncoding('utf8');
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => resolve(data));
            }).on('error', reject);
        });
    }

    public search(query: string, options: SearchOptions = {}): Promise<Results> {
        return new Promise(async (resolve, reject) => {
            try {
                const page = await this.load(query, options || {});
                const data = await this.extractRenderData(page);
                const results = await this.parseData(data);
                resolve(results);
            } catch (e) {
                reject(e);
            }
        });
    }
}

const youtube = new Youtube();
export default youtube;
