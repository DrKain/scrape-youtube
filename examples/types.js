const youtube = require('scrape-youtube').default;

// If you only want to search for certain types you can pass the `type` parameter
youtube.search('The Heavy', { type: 'playlist' });

// Note! Things like playlists or movies won't have "views" or "uploaded"
// You will need to handle this in your code.
