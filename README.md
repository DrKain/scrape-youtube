scrape-youtube
=============

[![NPM](https://nodei.co/npm/scrape-youtube.png?downloads=true)](https://nodei.co/npm/scrape-youtube/)

**What is this?***
------------------
Scrape information from youtube search results. This supports videos, playlists, channels, movies and shows.  
This was made for Discord Bots.

Install
---------------------

```npm install --save scrape-youtube```

Usage
---------------------

```javascript
var search = require('scrape-youtube');
```

# Basic Search
---------------------

```javascript
search("Upside down and inside out").then(function(results){
    console.log(results);
});
```

Additional Options
----------------------

- limit
    - Number of videos returned in the response. Max 20, minimum 0.
    default=20
- type
    - The type of results you want to receive.
    Allowed: any, video, channel, playlist, movie, show
    default=video
- null_values
    - Allow null values to be returned in the results.
    default=false


```javascript
const results = await search("Upside down and inside out", { limit : 5, type : "video" });
```

Example Result: 

```json 
[
  {
    "type": "video",
    "channel": "Channel Name",
    "channel_link": "https://youtube.com/channel/XXXXXXXXX",
    "title": "Video Title",
    "duration": 110,
    "thumbnail": "https://i.ytimg.com/vi/XXXXXXXXXXX/hqdefault.jpg?XXXXXXXXXX",
    "upload_date": "4 months ago",
    "views": 524759,
    "description": "A video description",
    "link": "https://youtube.com/watch?v=XXXXXXXXXXX",
    "verified": false
  }
]
```

TODO
----------------------

- Multiple Pages
- Sorting Options

**Additional Notes**
- Please report any issues [here](https://github.com/DrKain/scrape-youtube/issues)