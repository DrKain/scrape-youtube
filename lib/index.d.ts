import request = require('request');
export declare enum ResultType {
    any = "any",
    video = "video",
    channel = "channel",
    playlist = "playlist",
    movie = "movie",
    live = "live"
}
export declare const ResultFilter: {
    [key in ResultType]: string;
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
     * Generate video thumbnail
     * @param id Youtube video ID
     */
    private getThumbnail;
    /**
     * Convert an hh:mm:ss string into total seconds
     * @param text hh:mm:ss string
     */
    private parseDuration;
    /**
     * Convert a string into a number.
     * @param s string
     */
    private num;
    /**
     * Compresses the "runs" texts into a single string.
     * @param key vRender key
     */
    private compress;
    /**
     * Fetch channel badges and check if they are verified channels
     * @param vRender vRender
     */
    private isChannelVerified;
    /**
     * Extract channel data from the vRender object
     * @param vRender vRender
     */
    private getChannelData;
    private getDuration;
    private getViews;
    private getUploadedDate;
    /**
     * Load a url and begin scraping the data.
     * @param url Youtube URL
     * @param params SearchOptions
     * @param options request.Options
     */
    private load;
    private extractInitialData;
    /**
     * Search youtube for results.
     * Result type defaults to 'video'. See advanced use for more information
     * @param query Search Query
     * @param options Search Options
     * @param requestOptions request.Options
     */
    search(query: string, options?: Partial<SearchOptions>, requestOptions?: request.Options): Promise<SearchResult[]>;
    /**
     * Lazy shortcut to get the first result. Probably useful with discord bots.
     * @param query Search String
     * @param options request.Options
     */
    searchOne(query: string, requestOptions?: request.Options): Promise<SearchResult | null>;
}
declare const youtube: Youtube;
export default youtube;
