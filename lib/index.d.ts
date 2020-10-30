import { SearchOptions, Video } from './interface';
declare class Youtube {
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
    /**
     * Search YouTube for a list of videos
     * @param query Search Query
     * @param options Optional Search Options
     */
    search(query: string, options?: SearchOptions): Promise<Video[]>;
}
declare const youtube: Youtube;
export default youtube;
