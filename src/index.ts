import request = require('request');
import cheerio = require('cheerio');
import ytdl = require('ytdl-core');

export enum ResultType {
    any = 'any',
    video = 'video',
    channel = 'channel',
    playlist = 'playlist',
    movie = 'movie',
    live = 'live'
}

export const ResultFilter: { [key in ResultType]: string } = {
    [ResultType.any]: 'CAA%253D',
    [ResultType.video]: 'EgIQAQ%253D%253D',
    [ResultType.channel]: 'EgIQAg%253D%253D',
    [ResultType.playlist]: 'EgIQAw%253D%253D',
    [ResultType.movie]: 'EgIQBA%253D%253D',
    [ResultType.live]: 'EgJAAQ%253D%253D'
};

export interface SearchOptions {
    query: string;
    type: ResultType | string;
    page: number;
    limit: number;
}

export interface SearchResult {
    type: ResultType;

    channel: {
        name: string;
        link: string;
        verified: boolean;
    };

    id: string;
    title: string;
    link: string;
    description: string;
    thumbnail: string;

    duration?: number;
    watching?: number;
    views?: number;
    uploaded?: string;
    videoCount?: number;
}

export class Youtube {
    public host = 'https://www.youtube.com';
    public detectLinks = false;

    constructor() { }

    /**
     * Generates a request URL using the search options provided.
     * @param params SearchOptions
     */
    private getRequestURL(params: SearchOptions): string {
        return (
            `${this.host}/results` +
            this.querystring({
                search_query: encodeURIComponent(params.query),
                page: params.page,
                sp: ResultFilter[params.type as ResultType]
            })
        );
    }

    /**
     * Converts an object into a browser query string.
     * { one: 'two' } becomes ?one=two
     * @param o Object
     */
    private querystring(o: any) {
        return Object.keys(o).map((v, i) => (i !== 0 ? '&' : '?') + `${v}=${o[v]}`).join('');
    }

    /**
     * Generate video thumbnail
     * @param id Youtube video ID
     */
    private getThumbnail(id: any): string {
        return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
    }

    /**
     * Convert an hh:mm:ss string into total seconds
     * @param text hh:mm:ss string
     */
    private parseDuration(text: string): number {
        const nums = text.split(':');
        let sum = 0;
        let multi = 1;

        while (nums.length > 0) {
            sum += multi * parseInt(nums.pop() || '-1', 10);
            multi *= 60;
        }

        return sum;
    }

    /**
     * Convert a string into a number.
     * @param s string
     */
    private num(s: any): number {
        return +`${s}`.replace(/[^0-9.]/g, '');
    }

    /**
     * Compresses the "runs" texts into a single string.
     * @param key vRender key
     */
    private compress(key: any) {
        return (key && key['runs'] ?
            key['runs'].map((v: any) => v.text) : []
        ).join('');
    }

    /**
     * Fetch channel badges and check if they are verified channels
     * @param vRender vRender
     */
    private isChannelVerified(vRender: any) {
        const badges = (vRender['ownerBadges'] ?
            vRender['ownerBadges'].map((badge: any) => badge['metadataBadgeRenderer']['style']) : []
        );
        return badges.includes('BADGE_STYLE_TYPE_VERIFIED_ARTIST');
    }

    /**
     * Extract channel data from the vRender object
     * @param vRender vRender
     */
    private getChannelData(vRender: any): { name: string, link: string, verified: boolean } {
        const channel: any = vRender['ownerText']['runs'][0];

        return {
            name: channel['text'],
            link: (
                'https://youtube.com' +
                channel['navigationEndpoint']['commandMetadata']['webCommandMetadata']['url']
            ),
            verified: this.isChannelVerified(vRender)
        };
    }

    private getDuration(vRender: any) {
        return this.parseDuration(vRender['lengthText']['simpleText']);
    }

    private getViews(vRender: any) {
        return this.num(vRender['viewCountText']['simpleText']);
    }

    private getUploadedDate(vRender: any) {
        // Sometimes publishedTimeText is not available.
        // EG: https://i.imgur.com/cR1na6k.png
        return vRender['publishedTimeText'] ? vRender['publishedTimeText']['simpleText'] : '';
    }

    /**
     * Load a url and begin scraping the data.
     * @param url Youtube URL
     * @param params SearchOptions
     * @param options request.Options
     */
    private load(
        url: string,
        params: SearchOptions,
        options?: request.Options
    ): Promise<SearchResult[]> {
        return new Promise((resolve, reject) => {
            request({ method: 'GET', url, ...(options || {}) }, async (err, res, body) => {
                if (err) return reject(err);
                try {
                    const results: SearchResult[] = [];
                    const $ = cheerio.load(body);
                    const data: any[] = await this.extractInitialData($);

                    data.forEach((item: any) => {
                        try {
                            const vRender = item['videoRenderer'];
                            if (vRender) {
                                const id = vRender['videoId'];

                                // TODO: Add multiple types again
                                const result: SearchResult = {
                                    type: ResultType.video,
                                    channel: this.getChannelData(vRender),
                                    id,
                                    title: this.compress(vRender['title']),
                                    link: `https://www.youtube.com/watch?v=${id}`,
                                    description: this.compress(vRender['descriptionSnippet']),
                                    thumbnail: this.getThumbnail(id),
                                    views: this.getViews(vRender),
                                    duration: this.getDuration(vRender),
                                    uploaded: this.getUploadedDate(vRender)
                                };

                                results.push(result);
                            }
                        } catch (e) {
                            console.log(e);
                        }
                    });

                    resolve(results);
                } catch (e) {
                    reject(e);
                }
            });
        });
    }

    private extractInitialData($: any): Promise<any> {
        return new Promise((resolve, reject) => {
            try {
                let json: any = null;

                $('script').each((i: number, script: any) => {
                    const html = $(script).html();

                    if (html && html.includes('window["ytInitialData"]')) {
                        const start = (html.split('window["ytInitialData"] = ').pop() || '');
                        const end = start.split('window["ytInitialPlayerResponse"]').shift();

                        if (end) {
                            json = JSON.parse(`${end.replace(/;/g, '')}`);

                            // Unavoidable Ladder
                            resolve(
                                json.contents
                                    .twoColumnSearchResultsRenderer
                                    .primaryContents
                                    .sectionListRenderer
                                    .contents[0]
                                    .itemSectionRenderer
                                    .contents
                            );
                        } else throw Error('Failed to extract InitialData');
                    }
                });

                if (!json) {
                    throw Error('Failed to extract InitialData. The request may have been blocked.');
                }

            } catch (e) {
                reject(e);
            }
        });
    }

    /**
     * Search youtube for results.
     * Result type defaults to 'video'. See advanced use for more information
     * @param query Search Query
     * @param options Search Options
     * @param requestOptions request.Options
     */
    public search(
        query: string,
        options?: Partial<SearchOptions>,
        requestOptions?: request.Options
    ): Promise<SearchResult[]> {
        return new Promise(async (resolve, reject) => {

            const params: SearchOptions = {
                query: query.trim(),
                page: 0,
                type: ResultType.video,
                limit: 10,
                ...options,
            };

            if (params.query.length === 0) {
                return reject(new Error('Search cannot be blank'));
            }

            if (params.type !== ResultType.video) {
                params.type = ResultType.video;
                console.warn('Search type must be `video`. Other types are unsupported in this version but will be re-added in the future');
            }

            if (!Object.keys(ResultType).includes(params.type)) {
                return reject(new Error(`Unexpected result type: ${params.type}`));
            }

            if (params.page < 0) {
                return reject(new Error(`Page number can not be lower than 0`));
            }

            if (params.limit <= 0) {
                return reject(new Error('Limit can not be lower than 1'));
            }

            const url = this.getRequestURL(params);
            this.load(url, params, requestOptions).then(resolve).catch(reject);
        });
    }

    /**
     * Fetches video information using the ytdl-core package, then generates a SearchResult
     * @param query Youtube URL
     */
    private ytdlSearch(query: string): Promise<SearchResult> {
        return new Promise(async (resolve, reject) => {
            try {
                const vdata = await ytdl.getInfo(query);
                if (vdata && vdata.videoDetails) {
                    const details = vdata.videoDetails;

                    const preview: SearchResult = {
                        type: ResultType.video,
                        channel: {
                            name: details.author.name,
                            link: details.author.user_url,
                            verified: details.author.verified
                        },
                        id: details.videoId,
                        title: details.title,
                        link: `https://www.youtube.com/watch?v=${details.videoId}`,
                        description: details.shortDescription,
                        thumbnail: this.getThumbnail(details.videoId),
                        duration: +details.lengthSeconds,
                        views: +details.viewCount
                    };

                    resolve(preview);
                } else throw new Error('Failed to load video details');
            } catch (e) {
                reject(e);
            }
        });
    }

    /**
     * Lazy shortcut to get the first result. Probably useful with discord bots.
     * @param query Search String
     * @param options request.Options
     */
    public searchOne(query: string, requestOptions?: request.Options): Promise<SearchResult | null> {
        return new Promise(async (resolve, reject) => {

            // Detect if input is already a video URL. This
            // should save some time when it comes to discord
            // bots
            if (ytdl.validateURL(query)) {
                this.ytdlSearch(query).then(resolve).catch(reject);
            }  else {
                this.search(query, { type: ResultType.video, limit: 1 }, requestOptions).then(results => {
                    resolve(results.length ? results[0] : null);
                }).catch(reject);
            }

        });
    }
}

/* For quick use without creating a new instance */
const youtube = new Youtube();
export default youtube;
