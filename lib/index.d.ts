import { SearchOptions, Results } from './interface';
declare class Youtube {
    debug: boolean;
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
declare const youtube: Youtube;
export default youtube;
