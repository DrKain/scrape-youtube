Scrape YouTube
=============

[![NPM](https://img.shields.io/npm/v/scrape-youtube)](https://www.npmjs.com/package/scrape-youtube) [![NPM](https://img.shields.io/npm/dt/scrape-youtube)](https://www.npmjs.com/package/scrape-youtube) [![NPM](https://img.shields.io/npm/types/scrape-youtube)](https://www.npmjs.com/package/scrape-youtube)
  
 **What is this?**
------------------
A [lightning fast](https://i.imgur.com/ipsWhkv.png) package to scrape YouTube search results. This was made and optimized for Discord Bots. 
  
#### Install  
```npm install scrape-youtube```

#### Require 
```javascript
import youtube from 'scrape-youtube';
// const youtube = require('scrape-youtube').default;
```

#### Search  
```javascript
youtube.search('Short Change Hero').then(results => {
    // Unless you specify a type, it will only return 'video' results
    console.log(results.videos); 
});
```

#### Custom Types
Supported types are: `video`, `live`, `movie`, `any` and `playlist`
```javascript
youtube.search('lofi hip hop beats to relax/study to', { type: 'live' }).then(results => {
  console.log(results.streams);
})
```

#### Example Response (Video)
This is the structure of a single video result. The search function will return up to 20 results per search.  
```json
{
  "id": "lkvScx3Po8I",
  "title": "The Heavy - Short Change Hero",
  "link": "https://www.youtube.com/watch?v=lkvScx3Po8I",
  "description": "... long description ...",   
  "thumbnail": "https://i.ytimg.com/vi/lkvScx3Po8I/hqdefault.jpg",
  "channel": {
    "name": "Magloire Lamine",
    "link": "https://youtube.com/user/TENESANGO",
    "verified": false,
    "thumbnail": "https://yt3.ggpht.com/a/AATXAJz3kOe_LDvhRWpQLu1wHb5xU7HNOKvpKQnLQA=s88-c-k-c0xffffffff-no-rj-mo"
  },  
  "views": 7960221,
  "duration": 238,
  "uploaded": "6 years ago"
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
    "name": "ChilledCow",
    "link": "https://www.youtube.com/channel/UCSJ4gkVC6NrvII8umztf0Ow",
    "verified": false,
    "thumbnail": "https://yt3.ggpht.com/a-/AOh14Gj1ME7zG6pJG6689WU13fYHmafnUGK7IMeWIg=s68-c-k-c0x00ffffff-no-rj-mo"
  },
  "watching": 34576
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
      "duration": 211,
      "thumbnail": "https://i.ytimg.com/vi/yoaNCEE4QLY/hqdefault.jpg"
    },
    {
      "id": "mGV_oiAcmaY",
      "title": "Bach Violin Concerto in D Minor",
      "link": "https://youtu.be/mGV_oiAcmaY",
      "duration": 381,
      "thumbnail": "https://i.ytimg.com/vi/mGV_oiAcmaY/hqdefault.jpg"
    }
  ]
}
```

#### Notes
1. You can load another page by passing `{ page: 1 }` as the second parameter.  
2. Contributions are welcome and greatly appreciated.  
3. If this package stops working please create an issue on GitHub so I can fix it as soon as possible.
4. If this readme is lacking, Please feel free to create a PR fixing or adding any information you feel would help.
