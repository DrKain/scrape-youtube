scrape-youtube
=============

[![NPM](https://img.shields.io/npm/v/scrape-youtube)](https://www.npmjs.com/package/scrape-youtube) [![NPM](https://img.shields.io/npm/dt/scrape-youtube)](https://www.npmjs.com/package/scrape-youtube) [![NPM](https://img.shields.io/npm/types/scrape-youtube)](https://www.npmjs.com/package/scrape-youtube)
  
 **What is this?***
------------------
Scrape information from youtube search results. This was made for Discord Bots but can be used for whatever.  
  
Basic Use
---------------------

Require the package 
```javascript
import youtube from 'scrape-youtube';
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

Other result types (like playlists and and live streams) are unsupported in this version. They will be re-added in the future, When I get more time.  