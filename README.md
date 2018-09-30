scrape-youtube
=============

[![NPM](https://nodei.co/npm/scrape-youtube.png?downloads=true)](https://nodei.co/npm/scrape-youtube/)

**What is this?***
------------------
scrape-youtube is A NodeJS Package to scrape information from search results. This supports videos, playlists, channels, movies and shows.
Right now, It supports three basic options that are explained below.
This one uses `jsdom 12.0.0` and the latest version of `jQuery` to retrieve and parse the results.

Note: scrape-youtube@0.0.4+ uses promises instead of callbacks.

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
search("Upside down and inside out", {
    limit : 5,
    type : "video"
}).then(function(results){
    console.log(results);
}, function(err){
    console.log(err);
});
```

TODO
----------------------

- Multiple Pages
- Sorting Options

**Additional Notes**
- Please report any issues [here](https://github.com/TryHardHusky/scrape-youtube/issues)