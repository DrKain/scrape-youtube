# [![scrape-youtube](https://raw.githubusercontent.com/DrKain/scrape-youtube/master/text-logo.png)](#)

[![Version](https://img.shields.io/npm/v/scrape-youtube.svg)](https://www.npmjs.com/package/scrape-youtube)
[![Downloads](https://img.shields.io/npm/dt/scrape-youtube)](https://www.npmjs.com/package/scrape-youtube)
[![Documentation](https://img.shields.io/badge/documentation-yes-brightgreen.svg)](https://github.com/DrKain/scrape-youtube/wiki)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/DrKain/scrape-youtube/graphs/commit-activity)
[![License: MIT](https://img.shields.io/github/license/DrKain/scrape-youtube)](https://github.com/DrKain/scrape-youtube/blob/master/LICENSE)

> A lightning fast package to scrape YouTube search results. This was made for Discord Bots.

## Install

```sh
npm install scrape-youtube --save
```

## Example

```javascript
import { youtube } from 'scrape-youtube';
// const youtube = require('scrape-youtube');

youtube.search('Short Change Hero').then((results) => {
    // Unless you specify a custom type you will only receive 'video' results
    console.log(results.videos);
});
```

## Custom Types

Supported types are: `video`, `live`, `movie`, `channel`, `playlist` and `any`

```javascript
youtube.search('lofi hip hop beats to relax/study to', { type: 'live' }).then((results) => {
    console.log(results.streams);
});
```

## Examples

Please see [the examples](https://github.com/DrKain/scrape-youtube/tree/master/examples) directory for examples on what data you will receive from each search.  
Your IDE should have autocompletion that works with the interface files, but these are here just in case.

If you want help using this in Discord Bot, please visit the [wiki page](https://github.com/DrKain/scrape-youtube/wiki/Discord-Bot) for TS/JS examples.

## Playlists

Please note that the "videos" listed in playlist responses will only contain 1-2 items. This is what is available from the search results.  
If you wish to load an entire playlist, consider using [ytdl-core](https://npmjs.com/package/ytdl-core).

## Custom Filters

You can pass `{ sp: 'ABC' }` as the second parameter to use custom filters like upload date, duration, features ect.  
You will need to fetch the SP parameter yourself from youtube. Please see [this image](https://i.imgur.com/9WHMvkI.png) for an example.

## Request Options

You can pass `{ requestOptions: { } }` as the second parameter to use a proxy, custom headers, agents ect.  
See [http.request](https://nodejs.org/api/http.html#http_http_request_options_callback) for more information.

```ts
const options = {
    requestOptions: {
        headers: {
            Cookie: 'PREF=f2=8000000',
            'Accept-Language': 'de'
        }
    }
};

youtube.search('Poets of the fall', options);
```

For example, using `Cookie: 'PREF=f2=8000000'` will enable restricted mode to filter out videos with bad language or adult themes.  
Additionally, `'Accept-Language': 'de'` will load YouTube in German, sometimes resulting in different titles and content responses.

## Extra Info

You can use [ytdl-core](https://github.com/fent/node-ytdl-core) by [fent](https://github.com/fent) to load extra information like exact upload dates,
full descriptions, like/dislike ratio, video ads ect.  
Please see [this](https://github.com/DrKain/scrape-youtube/wiki/Extra-Info) example in the wiki to see how.

## Debugging

In some cases advanced debugging might be required for fixing issues on GitHub.  
When enabled **each search** will create 3 files, please compress/zip and include with your issue.  
**It's not recommended to use this unless requested specifically.**

```javascript
youtube.debug = true; // Enable regular debugging
youtube.debugger.enabled = true; // Enable debug dumps
youtube.debugger.setDirectory('path/to/somewhere'); // Directory to write the dumps
```

## Quick Info

-   Multiple pages currently can not be loaded. This may change in the future, but currently you will be limited to 20 results.
-   This package will only make **1** request per search, even when using `any` types.
-   If this package stops working, please open an issue on GitHub. I will fix it within a day.

## 👤 Author

This project was made by **Kain (ksir.pw)**
Feel free to contact me if you have any trouble with this package.

-   Website: [ksir.pw](https://ksir.pw)
-   Github: [@DrKain](https://github.com/DrKain)
-   Discord: Kain#6880

## 🤝 Contributing

Contributions, issues and feature requests are welcome!
Feel free to check [issues page](https://github.com/DrKain/scrape-youtube/issues).

## Show your support

Give a ⭐️ if this project helped you!

## 📝 License

Copyright © 2018 [Kain (ksir.pw)](https://github.com/DrKain).
This project is [MIT](https://github.com/DrKain/scrape-youtube/blob/master/LICENSE) licensed.
