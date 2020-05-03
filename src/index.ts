import request = require('request');
import cheerio = require('cheerio');

export enum ResultType {
    any = 'any',
    video = 'video',
    channel = 'channel',
    playlist = 'playlist',
    movie = 'movie',
    live = 'live',
}

const ResultFilter: { [key in ResultType]: string } = {
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
        return Object.keys(o).map((v, i) => {
            return (i !== 0 ? '&' : '?') + `${v}=${o[v]}`;
        }).join('');
    }

    /**
     * Extracts the youtube thumbnail and removes the unnecessary parameters
     * @param $result Cheerio Element
     */
    private getThumbnail($result: any): string {
        const $img = $result.find('.yt-thumb-simple img');
        return (
            $img.attr('data-thumb') ||
            $img.attr('src')
        ).split('?sqp=').shift();
    }

    /**
     * Fetches the channel information (link, name and verified status)
     * @param $result Cheerio Element
     */
    private getChannelData($result: any): { name: string, link: string, verified: boolean } {
        const $verified = $result.find('span.yt-channel-title-icon-verified');
        const $channel = $result.find('.yt-lockup-byline a');

        const data = {
            name: $channel.text(),
            link: `https://youtube.com${$channel.attr('href')}`,
            verified: $verified && $verified.attr('title') === 'Verified'
        };

        // This will need a more reliable workaround
        if ($channel.length === 0) {
            data.name = 'Youtube Movies';
            data.link = 'https://www.youtube.com/channel/UClgRkhTL3_hImCAmdLfDE4g';
            data.verified = true;
        }

        return data;
    }

    /**
     * Attempts to find the result type based on the badges
     * and description
     * @param $result Cheerio Element
     */
    private getType($result: any): ResultType {
        let type = ResultType.any;

        const $liveBadge = $result.find('.yt-badge-live');
        const $desc = $result.find('.accessible-description')
            .text().split(':').shift();

        if ($liveBadge.length) {
            type = ResultType.live;
        } else {
            switch ($desc) {
                case ' - Duration':
                    type = ResultType.video;
                    break;
                case ' - Movie - Duration':
                    type = ResultType.movie;
                    break;
                case ' - Channel':
                    type = ResultType.channel;
                    break;
                case ' - Playlist':
                    type = ResultType.playlist;
                    break;
            }
        }

        return type;
    }

    /**
     * Extract the title data and ID.
     * Fetches playlist ID for playlists and youtube ID for everything else.
     * @param $result Cheerio Element
     * @param type ResultType
     */
    private getTitleData(
        $result: any,
        type: ResultType
    ): {
        text: string,
        id: string,
        link: string
    } {
        const $title = $result.find('.yt-lockup-title a');
        const $link = $title.attr('href');
        const id = (type === ResultType.playlist ?
            $link.split('list=').pop() :
            $link.split('?v=').pop()
        );
        return {
            text: $title.text(),
            id,
            link: `https://www.youtube.com${$link}`
        };
    }

    /**
     * Fetch the duration (in seconds) from the video type (hh:mm:ss)
     * @param $result Cheerio Element
     */
    private getDuration($result: any, type: ResultType): number {
        let $time = $result.find('.video-time').text().trim();
        let duration = -1;

        if (type === ResultType.movie) {
            $time = $result.find('.accessible-description').text().trim();
            if ($time.length) $time = $time.split('Duration:').pop();
        }

        if ($time.length) {
            const spl = $time.split(':');
            if (spl.length === 0) duration = +spl;
            else {
                duration = +spl.pop();
                if (spl.length === 1) duration += +spl[0] * 60;
                if (spl.length === 2) {
                    duration += +spl[1] * 60;
                    duration += +spl[0] * 3600;
                }
            }
        }

        return duration;
    }

    /**
     * Fetch the number of people watching a live stream
     * @param $result Cheerio Element
     * @param $ CheerioStatic
     */
    public getWatchers($result: any, $: CheerioStatic): number {
        const $items = $result.find('.yt-lockup-meta-info li');
        let users = 0;

        $items.each((index: number, item: any) => {
            const $item = $(item);
            if ($item.text().includes('watching')) {
                users = +$item.text().replace(/[^0-9.]/g, '');
            }
        });

        return users;
    }

    /**
     * Get the number of views a video has
     * @param $result Cheerio Element
     * @param $ CheerioStatic
     */
    private getViews($result: any, $: CheerioStatic): number {
        let views = -1;
        const $items = $result.find('.yt-lockup-meta-info li');

        $items.each((index: number, item: any) => {
            const $item = $(item);
            if ($item.text().includes('views')) {
                views = +$item.text().replace(/[^0-9.]/g, '');
            }
        });

        return views;
    }

    /**
     * Get the date a video was uploaded
     * @param $result Cheerio Element
     * @param $ CheerioStatic
     */
    private getResultTimestamp($result: any, $: CheerioStatic): string {
        const $items = $result.find('.yt-lockup-meta-info li');
        let time = 'unknown';

        $items.each((index: number, item: any) => {
            const $item = $(item);
            if ($item.text().includes('ago')) {
                time = $item.text();
            }
        });

        return time;
    }

    /**
     * Load a url and begin scraping the data.
     * @param url Youtube URL
     * @param params SearchOptions
     */
    private load(
        url: string,
        params: SearchOptions
    ): Promise<SearchResult[]> {
        return new Promise((resolve, reject) => {
            request({ method: 'GET', url }, (err, res, body) => {
                if (err) return reject(err);

                const results: SearchResult[] = [];
                const $ = cheerio.load(body);

                $('.yt-lockup').each((index, item) => {
                    const $result = $(item);
                    const type = this.getType($result);
                    const title = this.getTitleData($result, type);

                    // Populate default data
                    const data: SearchResult = {
                        type,
                        channel: this.getChannelData($result),
                        id: title.id,
                        title: title.text,
                        link: title.link,
                        description: $result.find('.yt-lockup-description').text(),
                        thumbnail: this.getThumbnail($result)
                    };

                    // Add data for live streams
                    if (type === ResultType.live) {
                        data.watching = this.getWatchers($result, $);
                    }

                    // Add data for anything that's not a playlist or live stream
                    if ([ResultType.playlist, ResultType.live].indexOf(type) === -1) {
                        data.duration = this.getDuration($result, type);

                        // Exclude views and uploaded for movies
                        if (type !== ResultType.movie) {
                            data.views = this.getViews($result, $);
                            data.uploaded = this.getResultTimestamp($result, $);
                        }
                    }

                    // Add data for playlists
                    if (type === ResultType.playlist) {
                        data.videoCount = +$result.find('.formatted-video-count-label b').text();
                    }

                    if (index < params.limit) {
                        // Skip random google ads that get scraped accidentally
                        // I need a sample of the response to filter this correctly
                        if (!data.link.includes('www.googleadservices.com')) {
                            results.push(data);
                        }
                    }
                });

                resolve(results);
            });
        });
    }

    /**
     * Search youtube for results.
     * Result type defaults to 'video'. See advanced use for more information
     * @param query Search Query
     * @param options Search Options
     */
    public search(
        query: string,
        options?: Partial<SearchOptions>
    ): Promise<SearchResult[]> {
        return new Promise((resolve, reject) => {
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
            this.load(url, params).then(resolve).catch(reject);
        });
    }

    /**
     * Lazy shortcut to get the first result. Probably useful with discord bots.
     * @param query Search String
     */
    public searchOne(query: string): Promise<SearchResult | null> {
        return new Promise((resolve, reject) => {
            this.search(query, { type: ResultType.video, limit: 1 }).then(results => {
                resolve(results.length ? results[0] : null);
            }).catch(reject);
        });
    }
}

/* For quick use without creating a new instance */
const youtube = new Youtube();
export default youtube;
