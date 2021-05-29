# Scrape YouTube

[![NPM](https://img.shields.io/npm/v/scrape-youtube)](https://www.npmjs.com/package/scrape-youtube) [![NPM](https://img.shields.io/npm/dt/scrape-youtube)](https://www.npmjs.com/package/scrape-youtube) [![NPM](https://img.shields.io/npm/types/scrape-youtube)](https://www.npmjs.com/package/scrape-youtube)

## **What is this?**

A [lightning fast](https://i.imgur.com/ipsWhkv.png) package to scrape YouTube search results. This was made and optimized for Discord Bots.  
This package is updated often to fix minor problems or parsing issues. Please ensure you have the latest version before making an issue on GitHub.

#### Install

`npm install scrape-youtube`

#### Require

```javascript
import youtube from 'scrape-youtube';
// const youtube = require('scrape-youtube').default;
```

#### Search

```javascript
youtube.search('Short Change Hero').then((results) => {
    // Unless you specify a type, it will only return 'video' results
    console.log(results.videos);
});
```

#### Custom Types

Supported types are: `video`, `live`, `movie`, `channel`, `playlist` and `any`

```javascript
youtube.search('lofi hip hop beats to relax/study to', { type: 'live' }).then((results) => {
    console.log(results.streams);
});
```

#### Example Response (Video)

This is the structure of a single video result. The search function will return up to 20 results per search.

```json
{
    "id": "lkvScx3Po8I",
    "title": "The Heavy - Short Change Hero",
    "link": "https://youtu.be/lkvScx3Po8I",
    "thumbnail": "https://i.ytimg.com/vi/lkvScx3Po8I/hqdefault.jpg",
    "channel": {
        "id": "UC5g2uRFlAhGAZ0vFQPE0k3Q",
        "name": "Magloire Lamine",
        "link": "https://www.youtube.com/channel/UC5g2uRFlAhGAZ0vFQPE0k3Q",
        "verified": false,
        "thumbnail": "https://yt3.ggpht.com/ytc/AAUvwnh3gRpzNqa02vyPn9yMnnlllHM-N32Em1h0nyQedA=s0?imgmax=0"
    },
    "description": "",
    "views": 10090187,
    "uploaded": "7 years ago",
    "duration": 238
}
```

#### Example Response (Live Stream)

This is the structure of a single live stream result.

```json
{
    "id": "5qap5aO4i9A",
    "title": "lofi hip hop radio - beats to relax/study to",
    "link": "https://youtu.be/5qap5aO4i9A",
    "thumbnail": "https://i.ytimg.com/vi/5qap5aO4i9A/hqdefault.jpg",
    "channel": {
        "id": "UCSJ4gkVC6NrvII8umztf0Ow",
        "name": "Lofi Girl",
        "link": "https://www.youtube.com/channel/UCSJ4gkVC6NrvII8umztf0Ow",
        "verified": false,
        "thumbnail": "https://yt3.ggpht.com/ytc/AAUvwnhGIymQGp3jRMECbTCBSRAUqi8sKbATpWowQG44CA=s0?imgmax=0"
    },
    "watching": 36682
}
```

### Example Response (Playlist)

This is the structure of a single playlist result. Please note that the "videos" will only contain 1-2 items. This is what is available from the search results. If you wish to load an entire playlist, consider using [ytdl-core](https://npmjs.com/package/ytdl-core).

```json
{
    "id": "PLEPHBRITc9qNl4G4IaZPGsx0nueg6d_6N",
    "title": "Johann Sebastian Bach Adagios for relaxation",
    "link": "https://www.youtube.com/playlist?list=PLEPHBRITc9qNl4G4IaZPGsx0nueg6d_6N",
    "thumbnail": "https://i.ytimg.com/vi/yoaNCEE4QLY/hqdefault.jpg",
    "channel": {
        "id": "UCUDT_zh1GA8qfisSZXemt6Q",
        "name": "Fredericia's Channel",
        "link": "https://www.youtube.com/channel/UCUDT_zh1GA8qfisSZXemt6Q",
        "verified": false,
        "thumbnail": "https://www.gstatic.com/youtube/img/originals/promo/ytr-logo-for-search_160x160.png"
    },
    "videoCount": 15,
    "videos": [
        {
            "id": "yoaNCEE4QLY",
            "title": "J S Bach Jesu Joy of Man's Desiring chamber orchestra version",
            "link": "https://youtu.be/yoaNCEE4QLY",
            "duration": 210,
            "thumbnail": "https://i.ytimg.com/vi/yoaNCEE4QLY/hqdefault.jpg"
        },
        {
            "id": "mGV_oiAcmaY",
            "title": "Bach Violin Concerto in D Minor",
            "link": "https://youtu.be/mGV_oiAcmaY",
            "duration": 380,
            "thumbnail": "https://i.ytimg.com/vi/mGV_oiAcmaY/hqdefault.jpg"
        }
    ]
}
```

### Example Response (Channel)

This is an example response for a single channel search result.  
The subscriber count is unfortunately a string, You can attempt to convert it yourself if you wish.
The thumbnail is converted to the largest available image

```json
{
    "id": "UC0hNui8bT7yV0Xb8w8YxjHw",
    "name": "Poets of the Fall (Official)",
    "link": "https://www.youtube.com/channel/UC0hNui8bT7yV0Xb8w8YxjHw",
    "verified": true,
    "thumbnail": "https://yt3.ggpht.com/ytc/AAUvwniodp2yJktm7UlbHChoA_yqHNDEAUUZlJOKj6Ltxw=s0?imgmax=0",
    "description": "Welcome to the official Poets of the Fall YouTube channel! Finnish rockers Poets of the Fall - singer Marko, guitarist Olli and ...",
    "videoCount": 98,
    "subscribers": "381K",
    "subscriberCount": 381000
}
```

### Custom Filters

You can pass `{ sp: 'ABC' }` as the second parameter to use custom filters like upload date, duration, features ect.  
You will need to fetch the SP parameter yourself from youtube. Please see [this image](https://i.imgur.com/9WHMvkI.png) for an example.

### Custom Request Options

You can pass `{ requestOptions: { } }` as the second parameter to use custom headers, agents ect.  
See [http.request](https://nodejs.org/api/http.html#http_http_request_options_callback) for more information.
Example:

```javascript
youtube.search('Poets of the fall', {
    requestOptions: {
        headers: { 'Accept-Language': 'de' }
    }
});
```

### Extra Info

You can use [ytdl-core](https://github.com/fent/node-ytdl-core) by [fent](https://github.com/fent) to load extra information like exact upload dates, full descriptions, like/dislike ratio, video ads ect. Please see [this](https://github.com/DrKain/scrape-youtube/wiki/Extra-Info) example in the wiki to see how.

### Discord Bots

See [this](https://github.com/DrKain/scrape-youtube/wiki/Discord-Bot) example on how to use this in a Discord Bot. Voice channel example coming soon.

### Debugging

In some cases advanced debugging might be required for fixing issues on GitHub.  
When enabled **each search** will create 3 files, please compress/zip and include with your issue.  
**It's not recommended to use this unless requested specifically.**

```javascript
youtube.debug = true; // Enable regular debugging
youtube.debugger.enabled = true; // Enable debug dumps
youtube.debugger.setDirectory('path/to/somewhere'); // Directory to write the dumps
```

#### Notes

-   Multiple pages can not be loaded. YouTube changed how loading works so this is currently not available.
-   This package will only make a single request per search.
-   If this package stops working please create an [issue on GitHub](https://github.com/DrKain/scrape-youtube/issues) so I can fix it as soon as possible.
-   If this readme is lacking, Please feel free to create a PR fixing or adding any information you feel would help. I gladly accept any helpful pull requests or contributions.
