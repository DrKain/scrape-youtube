scrape-youtube
=============

[![NPM](https://nodei.co/npm/scrape-youtube.png?downloads=true)](https://www.npmjs.com/package/scrape-youtube)  
[![NPM](https://img.shields.io/npm/v/scrape-youtube)](https://www.npmjs.com/package/scrape-youtube) [![NPM](https://img.shields.io/librariesio/github/DrKain/scrape-youtube)](https://www.npmjs.com/package/scrape-youtube)  

  
 **What is this?***
------------------
Scrape information from youtube search results. This supports videos, playlists, channels, movies and shows.  
This was made for Discord Bots but can be used for whatever.  
  
Basic Use
---------------------

Require the package using javascript
```javascript
const youtube = require('scrape-youtube').default;
// or typescript
// import youtube from 'scrape-youtube';
```

Then you're good to go.  

```javascript
youtube.search('Short Change Hero').then(results => {
    console.log(results)
});
// To quickly get one result: 
// youtube.searchOne('Short Change Hero').then(...)
```

## Example Response (video)
```json
{
  "type": "video",
  "channel": {
    "name": "Magloire Lamine",
    "link": "https://youtube.com/user/TENESANGO",
    "verified": false
  },
  "id": "lkvScx3Po8I",
  "title": "The Heavy - Short Change Hero",
  "link": "https://www.youtube.com/watch?v=lkvScx3Po8I",
  "description": "... long description ...",     
  "thumbnail": "https://i.ytimg.com/vi/lkvScx3Po8I/hqdefault.jpg",
  "duration": 238,
  "views": 7960221,
  "uploaded": "6 years ago"
}
```  
  
## Filter result types
Accepts either `any`, `video`, `channel`, `playlist`, `movie` or `live`.

##### **Be careful when using `any` because values like `likes` and `views` are not in playlist types.**

```javascript
await youtube.search('Ok Go', { type: 'playlist' });

// import youtube, { ResultType } from 'scrape-youtube';
// await youtube.search('Ok Go', { type: ResultType.playlist });
```

## Limit number of results
```javascript
// limit to 5 results
await youtube.search('Ok Go', { limit: 5 });
```

## Example Response (playlist)  
```json
{
  "type": "playlist",
  "channel": {
    "name": "Richy Vaughn",
    "link": "https://youtube.com/channel/UCyZQ2K2WZ8PEyRDM4kM9pmA",
    "verified": false
  },
  "id": "PLSWKpdZ-Q4JIWGY9grtQr7iCl30-eLHxW",
  "title": "Short change hero",
  "link": "https://www.youtube.com/watch?v=l6eSksEp27U&list=PLSWKpdZ-Q4JIWGY9grtQr7iCl30-eLHxW",
  "description": "",
  "thumbnail": "https://i.ytimg.com/vi/l6eSksEp27U/hqdefault.jpg",
  "videoCount": 12
}
```