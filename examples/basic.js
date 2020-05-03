const youtube = require('scrape-youtube').default;

// Quick search for a single video. Good for discord bots.
// Returns `null` if no video is found.
youtube.searchOne('Short Change Hero').then(video => {
    console.log(JSON.stringify(video, null, 2));
}).catch(console.error);

// or async:
// const video = await youtube.searchOne('Short Change Hero');
