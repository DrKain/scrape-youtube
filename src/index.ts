import { get } from 'https';
import { ResultFilter, ResultType, SearchOptions, Video } from './interface';
import { getVideoData } from './parser';

class Youtube {
    constructor() { }

    private getURL(query: string, options: SearchOptions): string {
        const url = new URL('/results', 'https://www.youtube.com');
        url.search = new URLSearchParams({
            search_query: query,
            sp: ResultFilter[(options.type || 'video') as ResultType],
            page: `${options.page ?? 0}`
        }).toString();
        return url.href;
    }

    private extractRenderData(page: string): Promise<JSON> {
        return new Promise((resolve, reject) => {
            try {
                // Last update they actually commented it as scraper data.
                const data = page.split('// scraper_data_begin')[1].trim()
                    .split('// scraper_data_end')[0].trim()
                    .slice(0, -1)
                    .slice('var ytInitialData = '.length);

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
                console.log(e);
                reject('Failed to extract video data. The request may have been blocked');
            }
        });
    }

    /**
     * Parse the data extracted from the page to match each interface
     * @param data Video Renderer Data
     */
    private parseData(data: any): Promise<Video[]> {
        return new Promise((resolve, reject) => {
            try {
                const results: Video[] = [];

                data.forEach((item: any) => {
                    const vRender = item['videoRenderer'];
                    if (!vRender) return;

                    try {
                        const result: Video = getVideoData(vRender);
                        results.push(result);
                    } catch (e) {
                        console.log(e);
                    }

                    resolve(results);
                });
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

        return new Promise((resolve, reject) => {
            get(url, res => {
                res.setEncoding('utf8');
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => resolve(data));
            }).on('error', reject);
        });
    }

    /**
     * Search YouTube for a list of videos
     * @param query Search Query
     * @param options Optional Search Options
     */
    public search(query: string, options: SearchOptions = {}): Promise<Video[]> {
        return new Promise(async (resolve, reject) => {
            try {
                const page = await this.load(query, options);
                const data = await this.extractRenderData(page);
                require('fs').writeFileSync('debug.json', JSON.stringify(data, null, 2));
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
