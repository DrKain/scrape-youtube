scrape-youtube
=============

[![NPM](https://img.shields.io/npm/v/scrape-youtube)](https://www.npmjs.com/package/scrape-youtube) [![NPM](https://img.shields.io/npm/dt/scrape-youtube)](https://www.npmjs.com/package/scrape-youtube) [![NPM](https://img.shields.io/npm/types/scrape-youtube)](https://www.npmjs.com/package/scrape-youtube)
  
 **What is this?***
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
    console.log(results)
});
```

#### Example Response
This is the structure of a single result. The search function will return an array of up to 20 results.
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

#### Notes
- Currently additional types like playlists, live streams and movies are unsupported. These will be re-added in some time.  
- You can load another page by passing `{ page: 1 }` as the second parameter.

