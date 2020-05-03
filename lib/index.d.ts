/// <reference types="cheerio" />
export declare enum ResultType {
    any = "any",
    video = "video",
    channel = "channel",
    playlist = "playlist",
    movie = "movie",
    live = "live"
}
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
export declare class Youtube {
    host: string;
    constructor();
    /**
     * Generates a request URL using the search options provided.
     * @param params SearchOptions
     */
    private getRequestURL;
    /**
     * Converts an object into a browser query string.
     * { one: 'two' } becomes ?one=two
     * @param o Object
     */
    private querystring;
    /**
     * Extracts the youtube thumbnail and removes the unnecessary parameters
     * @param $result Cheerio Element
     */
    private getThumbnail;
    /**
     * Fetches the channel information (link, name and verified status)
     * @param $result Cheerio Element
     */
    private getChannelData;
    /**
     * Attempts to find the result type based on the badges
     * and description
     * @param $result Cheerio Element
     */
    private getType;
    /**
     * Extract the title data and ID.
     * Fetches playlist ID for playlists and youtube ID for everything else.
     * @param $result Cheerio Element
     * @param type ResultType
     */
    private getTitleData;
    /**
     * Fetch the duration (in seconds) from the video type (hh:mm:ss)
     * @param $result Cheerio Element
     */
    private getDuration;
    /**
     * Fetch the number of people watching a live stream
     * @param $result Cheerio Element
     * @param $ CheerioStatic
     */
    getWatchers($result: any, $: CheerioStatic): number;
    /**
     * Get the number of views a video has
     * @param $result Cheerio Element
     * @param $ CheerioStatic
     */
    private getViews;
    /**
     * Get the date a video was uploaded
     * @param $result Cheerio Element
     * @param $ CheerioStatic
     */
    private getResultTimestamp;
    /**
     * Load a url and begin scraping the data.
     * @param url Youtube URL
     * @param params SearchOptions
     */
    private load;
    /**
     * Search youtube for results.
     * Result type defaults to 'video'. See advanced use for more information
     * @param query Search Query
     * @param options Search Options
     */
    search(query: string, options?: Partial<SearchOptions>): Promise<SearchResult[]>;
    /**
     * Lazy shortcut to get the first result. Probably useful with discord bots.
     * @param query Search String
     */
    searchOne(query: string): Promise<SearchResult | null>;
}
declare const youtube: Youtube;
export default youtube;
