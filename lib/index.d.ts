import { SearchOptions, Results } from './interface';
export * from './interface';
declare class Youtube {
    /**
     * Enable debugging for extra information during each search
     */
    debug: boolean;
    host: string;
    path: string;
    constructor();
    private getURL;
    private extractRenderData;
    /**
     * Parse the data extracted from the page to match each interface
     * @param data Video Renderer Data
     */
    private parseData;
    /**
     * Load the page and scrape the data
     * @param query Search query
     * @param options Search options
     */
    private load;
    search(query: string, options?: SearchOptions): Promise<Results>;
}
export declare const youtube: Youtube;
export declare const search: (query: string, options?: SearchOptions) => Promise<Results>;
