import { youtube, SearchResult } from '../src'; // scrape-youtube

// Quick search for a single video. Good for discord bots.
// Returns `null` if no video is found.
youtube.searchOne('Short Change Hero').then((video: any) => {
    console.log(video);
}).catch(console.error);

// or multiple results
youtube.search('Short Change Hero').then((videos: any) => {
    videos.forEach((video: SearchResult) => console.log(video.title));
}).catch(console.error);
